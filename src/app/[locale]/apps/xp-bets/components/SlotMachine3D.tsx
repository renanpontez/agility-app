'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { SYMBOLS } from '../lib/paytable';
import type { SpinResult, SymbolId } from '../lib/types';
import { renderSymbolDataUri } from './symbolToDataUri';

type Props = {
  result: SpinResult | null;
  isSpinning: boolean;
  reducedMotion: boolean;
  onReelStop?: () => void;
};

// Shared texture cache so we only encode each symbol's data URI once.
const TEXTURE_CACHE = new Map<SymbolId, THREE.Texture>();

const loadTexture = (sym: SymbolId): THREE.Texture => {
  if (!TEXTURE_CACHE.has(sym)) {
    const loader = new THREE.TextureLoader();
    const t = loader.load(renderSymbolDataUri(sym));
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    TEXTURE_CACHE.set(sym, t);
  }
  return TEXTURE_CACHE.get(sym)!;
};

const STRIP_LENGTH = 24; // symbols per reel strip; controls scroll distance feel
const ROW_HEIGHT = 1.05;
const REEL_X = [-1.25, 0, 1.25] as const;

// Generates a pseudo-random strip of symbols ending in the target three cells.
// The last three are what the player sees; everything above scrolls past.
const buildStrip = (column: number, target: SymbolId[]): SymbolId[] => {
  const strip: SymbolId[] = [];
  for (let i = 0; i < STRIP_LENGTH - 3; i += 1) {
    strip.push(SYMBOLS[(i * 7 + column * 13) % SYMBOLS.length]!);
  }
  strip.push(...target);
  return strip;
};

type ReelProps = {
  column: number;
  targets: SymbolId[];
  spinning: boolean;
  reducedMotion: boolean;
  onStop: () => void;
};

const Reel = ({ column, targets, spinning, reducedMotion, onStop }: ReelProps) => {
  const group = useRef<THREE.Group>(null);
  const [strip] = useState<SymbolId[]>(() => buildStrip(column, targets));
  // y-position 0 = the bottom three symbols visible. We start scrolled up so
  // unseen strip is above and animate down to land on the final 3 cells.
  const startY = useRef((STRIP_LENGTH - 3) * ROW_HEIGHT);
  const targetY = useRef(0);
  const elapsed = useRef(0);
  const totalDuration = reducedMotion ? 0 : 1.2 + column * 0.25;
  const reportedStop = useRef(false);

  // When `spinning` flips on, restart the strip from above the visible area.
  useEffect(() => {
    if (spinning) {
      elapsed.current = 0;
      reportedStop.current = false;
      startY.current = (STRIP_LENGTH - 3) * ROW_HEIGHT + 6 + column * 2;
      if (group.current) {
        group.current.position.y = startY.current;
      }
    }
  }, [spinning, column]);

  // Also reset position when targets change (i.e., new spin result arrives).
  useEffect(() => {
    if (!spinning && group.current) {
      group.current.position.y = 0;
    }
    // strip is constant once mounted; in production we'd rebuild — for now,
    // we mutate the last 3 slots directly so the visual update is cheap.
    if (strip.length >= 3) {
      strip[strip.length - 3] = targets[0]!;
      strip[strip.length - 2] = targets[1]!;
      strip[strip.length - 1] = targets[2]!;
    }
  }, [targets, spinning, strip]);

  useFrame((_state, delta) => {
    if (!group.current || !spinning) {
      return;
    }
    elapsed.current += delta;
    const p = Math.min(1, elapsed.current / totalDuration);
    const eased = 1 - (1 - p) ** 3;
    const y = startY.current + (targetY.current - startY.current) * eased;
    group.current.position.y = y;
    if (p >= 1 && !reportedStop.current) {
      reportedStop.current = true;
      onStop();
    }
  });

  return (
    <group ref={group} position={[REEL_X[column]!, 0, 0]}>
      {strip.map((sym, i) => {
        const y = (strip.length - 1 - i) * ROW_HEIGHT;
        return (
          <mesh key={i} position={[0, -y, 0]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={loadTexture(sym)} transparent toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

const ReelMask = () => (
  // The 3-tall window we render the reels inside. Two flanking boxes hide
  // the strip above/below the visible rows.
  <>
    <mesh position={[0, 2.2, 0.3]}>
      <planeGeometry args={[5, 2]} />
      <meshBasicMaterial color="#0c0a09" />
    </mesh>
    <mesh position={[0, -2.2, 0.3]}>
      <planeGeometry args={[5, 2]} />
      <meshBasicMaterial color="#0c0a09" />
    </mesh>
  </>
);

const JackpotBurst = ({ active }: { active: boolean }) => {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const count = 240;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = Math.random() * 0.6 + 0.2;
      const a = Math.random() * Math.PI * 2;
      const z = Math.random() * 0.5 - 0.25;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = z;
      const speed = 0.8 + Math.random() * 2.2;
      velocities[i * 3] = Math.cos(a) * speed;
      velocities[i * 3 + 1] = Math.sin(a) * speed + 1.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    return g;
  }, []);

  const tStart = useRef<number | null>(null);
  useFrame((state) => {
    if (!points.current) {
      return;
    }
    if (!active) {
      tStart.current = null;
      points.current.visible = false;
      return;
    }
    if (tStart.current === null) {
      tStart.current = state.clock.elapsedTime;
    }
    const elapsed = state.clock.elapsedTime - tStart.current;
    const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
    const velocities = geometry.getAttribute('velocity') as THREE.BufferAttribute;
    const arr = positions.array as Float32Array;
    const vel = velocities.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i]! += vel[i]! * 0.016;
      arr[i + 1]! += vel[i + 1]! * 0.016 - 0.05;
      arr[i + 2]! += vel[i + 2]! * 0.016;
    }
    positions.needsUpdate = true;
    const material = points.current.material as THREE.PointsMaterial;
    material.opacity = Math.max(0, 1 - elapsed / 1.5);
    points.current.visible = elapsed < 1.5;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color="#fbbf24" size={0.14} transparent opacity={1} sizeAttenuation depthWrite={false} />
    </points>
  );
};

const Scene = ({ result, isSpinning, reducedMotion, onReelStop }: Props) => {
  const grid = result?.grid ?? [
    ['tiger', 'gold', 'green'],
    ['blue', 'wild', 'purple'],
    ['coin', 'bamboo', 'coin'],
  ] as SymbolId[][];
  const columnTargets: SymbolId[][] = [0, 1, 2].map(c => [grid[0]![c]!, grid[1]![c]!, grid[2]![c]!]);
  const isJackpot = !!result?.isJackpot;
  const [stops, setStops] = useState(0);
  useEffect(() => {
    if (!isSpinning) {
      setStops(0);
    }
  }, [isSpinning]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <spotLight position={[0, 5, 6]} angle={0.5} intensity={1.2} color="#fcd34d" />
      <group>
        {[0, 1, 2].map(c => (
          <Reel
            key={c}
            column={c}
            targets={columnTargets[c]!}
            spinning={isSpinning}
            reducedMotion={reducedMotion}
            onStop={() => {
              setStops(s => s + 1);
              onReelStop?.();
            }}
          />
        ))}
      </group>
      <ReelMask />
      <JackpotBurst active={isJackpot && stops === 3} />
    </>
  );
};

export default function SlotMachine3D({ result, isSpinning, reducedMotion, onReelStop }: Props) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          result={result}
          isSpinning={isSpinning}
          reducedMotion={reducedMotion}
          onReelStop={onReelStop}
        />
      </Canvas>
    </div>
  );
}
