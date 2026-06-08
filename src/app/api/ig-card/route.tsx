import { ImageResponse } from 'next/og';

// Branded Instagram card rendered on demand, post-style layout (4:5) or
// story (9:16). Example:
//   /api/ig-card?title=Como não cair em golpes do WhatsApp e Instagram
//     &highlight=golpes&subtitle=A engenharia social por trás do golpe
//     &bg=https://images.unsplash.com/photo-...&tag=AGILITY SAFE&icon=cloud
//
// Composition (matches the reference design):
//   ┌──────────────────────────┐
//   │  background image (top)  │  ← ~45% of the card height
//   │                          │
//   │      ▽ brand chip ▽      │  ← centered, overlapping the boundary
//   ├──────────────────────────┤
//   │  TITLE WITH [HIGHLIGHT]  │  ← uppercase, wraps, highlight pill
//   │     subtitle here        │
//   │                          │
//   │       [ TAG PILL ]       │  ← pinned to the bottom
//   └──────────────────────────┘

export const runtime = 'edge';

const PRIMARY = '#7C3AED'; // brand purple
const PRIMARY_SOFT = '#E8DEFF';
const BG = '#0A0A0A';

const FONT_BASE = 'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.16/files';

const loadFont = async (weight: 400 | 700 | 800): Promise<ArrayBuffer | null> => {
  try {
    const res = await fetch(`${FONT_BASE}/inter-latin-${weight}-normal.woff`);
    if (!res.ok) {
      return null;
    }
    return await res.arrayBuffer();
  } catch {
    return null;
  }
};

// Break the title into segments, marking the highlighted span so it can be
// rendered with the inline pill background. Match is case-insensitive but the
// pill preserves the source casing in the visible glyphs.
const renderTitleParts = (title: string, highlight?: string) => {
  if (!highlight) {
    return [{ text: title, hl: false }];
  }
  const idx = title.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) {
    return [{ text: title, hl: false }];
  }
  return [
    { text: title.slice(0, idx), hl: false },
    { text: title.slice(idx, idx + highlight.length), hl: true },
    { text: title.slice(idx + highlight.length), hl: false },
  ].filter(p => p.text.length > 0);
};

// Triangular brand mark — matches the Agility logo silhouette without needing
// to fetch the actual SVG (edge runtime + SVG via <img> is unreliable).
const BrandMark = ({ size = 88 }: { size?: number }) => {
  const triangleSize = Math.round(size * 0.5);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        background: PRIMARY_SOFT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 12px 28px -8px rgba(124, 58, 237, 0.55), inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${triangleSize / 2}px solid transparent`,
          borderRight: `${triangleSize / 2}px solid transparent`,
          borderBottom: `${triangleSize}px solid ${PRIMARY}`,
          display: 'flex',
        }}
      />
    </div>
  );
};

// Tiny cloud icon for the tag pill (optional). next/og's inline SVG support
// is shaky — using positioned divs to draw the icon shape instead.
const CloudIcon = () => (
  <div style={{ position: 'relative', width: 28, height: 20, display: 'flex' }}>
    <div style={{ position: 'absolute', left: 0, bottom: 0, width: 28, height: 12, background: '#fff', borderRadius: 6 }} />
    <div style={{ position: 'absolute', left: 5, top: 0, width: 14, height: 14, background: '#fff', borderRadius: '50%' }} />
    <div style={{ position: 'absolute', left: 14, top: 3, width: 11, height: 11, background: '#fff', borderRadius: '50%' }} />
  </div>
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') ?? 'Agility Creative').slice(0, 120);
  const subtitle = (searchParams.get('subtitle') ?? '').slice(0, 160);
  const highlight = searchParams.get('highlight') ?? undefined;
  const tag = (searchParams.get('tag') ?? 'AGILITY').slice(0, 24);
  const icon = searchParams.get('icon') ?? undefined;
  const bg = searchParams.get('bg');
  const ratio = searchParams.get('ratio') === '9:16' ? '9:16' : '4:5';

  const width = 1080;
  const height = ratio === '9:16' ? 1920 : 1350;
  // Image takes the upper portion; the dark band hosts the brand + copy.
  // Story aspect (9:16) gets a slightly taller image to balance the longer card.
  const imageHeightPct = ratio === '9:16' ? 0.50 : 0.45;

  const [regular, bold, black] = await Promise.all([loadFont(400), loadFont(700), loadFont(800)]);
  const fonts = [
    ...(regular ? [{ name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const }] : []),
    ...(bold ? [{ name: 'Inter', data: bold, weight: 700 as const, style: 'normal' as const }] : []),
    ...(black ? [{ name: 'Inter', data: black, weight: 800 as const, style: 'normal' as const }] : []),
  ];

  const upperTitle = title.toUpperCase();
  const titleParts = renderTitleParts(upperTitle, highlight?.toUpperCase());

  // Title scales with how much copy we have; ~80px is the high end for short
  // headlines, scaling down so longer ones still fit two/three lines.
  const titleSize = upperTitle.length > 60 ? 64 : upperTitle.length > 40 ? 72 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: BG,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
        }}
      >
        {/* Top: background image */}
        <div
          style={{
            width: '100%',
            height: `${imageHeightPct * 100}%`,
            position: 'relative',
            display: 'flex',
            background: '#1a1a1a',
          }}
        >
          {bg
            ? (
                // eslint-disable-next-line next/no-img-element
                <img
                  src={bg}
                  alt=""
                  width={width}
                  height={Math.round(height * imageHeightPct)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )
            : null}
          {/* Soft gradient at the bottom of the image so the brand chip's
              white text doesn't fight the photo edge. */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 180,
              display: 'flex',
              background: `linear-gradient(to bottom, rgba(10,10,10,0) 0%, ${BG} 100%)`,
            }}
          />
        </div>

        {/* Bottom: dark band with content */}
        <div
          style={{
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 64px 88px 64px',
            background: BG,
            position: 'relative',
          }}
        >
          {/* Brand chip — centered, pulled up so it overlaps the image edge. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: -52,
            }}
          >
            <BrandMark size={88} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>
                Agility Creative
              </span>
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 24, fontWeight: 400 }}>
                @agilitycreative
              </span>
            </div>
          </div>

          {/* Title — ALL CAPS, centered, with optional inline highlight pill. */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 48,
              lineHeight: 1.05,
              textAlign: 'center',
            }}
          >
            {titleParts.map((part, i) => (
              <span
                key={i}
                style={{
                  color: '#fff',
                  fontSize: titleSize,
                  fontWeight: 800,
                  letterSpacing: -1.5,
                  display: 'flex',
                  alignItems: 'center',
                  ...(part.hl
                    ? {
                        background: PRIMARY,
                        padding: `2px ${Math.round(titleSize * 0.18)}px`,
                        margin: `0 ${Math.round(titleSize * 0.04)}px`,
                        borderRadius: 10,
                      }
                    : {
                        padding: `0 ${Math.round(titleSize * 0.04)}px`,
                      }),
                }}
              >
                {part.text}
              </span>
            ))}
          </div>

          {/* Subtitle */}
          {subtitle
            ? (
                <span
                  style={{
                    color: 'rgba(255,255,255,0.78)',
                    fontSize: 34,
                    fontWeight: 400,
                    marginTop: 28,
                    textAlign: 'center',
                    lineHeight: 1.3,
                    maxWidth: 880,
                  }}
                >
                  {subtitle}
                </span>
              )
            : null}

          {/* Tag pill — pinned near the bottom. */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: 'rgba(124,58,237,0.18)',
              border: '1px solid rgba(124,58,237,0.45)',
              padding: '14px 26px',
              borderRadius: 999,
            }}
          >
            {icon === 'cloud' && <CloudIcon />}
            <span
              style={{
                color: '#fff',
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 1.5,
              }}
            >
              {tag.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      ...(fonts.length > 0 ? { fonts } : {}),
    },
  );
}
