import { ImageResponse } from 'next/og';

// Branded Instagram card rendered on demand, post-style layout (4:5) or
// story (9:16). Example:
//   /api/ig-card?title=Como não cair em golpes do WhatsApp e Instagram
//     &highlight=golpes&subtitle=A engenharia social por trás do golpe
//     &bg=https://images.unsplash.com/photo-...
//     &tag=AGILITY SAFE&icon=cloud
//
// Composition:
//   ┌──────────────────────────┐
//   │                          │
//   │   background image       │  full bleed, the entire canvas
//   │                          │
//   │   ▒░ smooth gradient ░▒  │  fades transparent → ~92% dark
//   │   ████████████████████   │  (starts higher than the brand chip
//   │   [logo] Agility C       │   so the chip sits on a soft dark band)
//   │   TITLE WITH [HIGHLIGHT] │  ← all content anchored to the bottom
//   │   subtitle here          │  ← tight bottom padding (no tag = closer to edge)
//   │   [ optional tag pill ]  │  ← only rendered when `tag` is explicitly passed
//   └──────────────────────────┘

export const runtime = 'edge';

const PRIMARY = '#7C3AED'; // brand purple
// Pure black so the chip reads as a solid silhouette against the gradient zone
// (which sits around 90% dark + ~10% photo bleed — slightly textured, not flat).
const CHIP_BG = '#000000';
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

// Split the title into per-word tokens, marking each word as highlighted
// (gets the inline pill background) or plain. Each token is rendered as its
// own inline-flex item in the title row so Satori's flex-wrap can break the
// line at the natural word boundaries — wrapping a single multi-word string
// doesn't work because Satori treats each <span> as an indivisible item.
type TitleToken = { text: string; hl: boolean };

const tokenizeTitle = (title: string, highlight?: string): TitleToken[] => {
  if (!highlight) {
    return title
      .split(/\s+/)
      .filter(Boolean)
      .map(text => ({ text, hl: false }));
  }
  const idx = title.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) {
    return title
      .split(/\s+/)
      .filter(Boolean)
      .map(text => ({ text, hl: false }));
  }
  const before = title.slice(0, idx).split(/\s+/).filter(Boolean);
  const hl = title.slice(idx, idx + highlight.length);
  const after = title.slice(idx + highlight.length).split(/\s+/).filter(Boolean);
  return [
    ...before.map(text => ({ text, hl: false })),
    { text: hl, hl: true },
    ...after.map(text => ({ text, hl: false })),
  ];
};

// Dark rounded chip with the real Agility "A" silhouette in white.
// Path data extracted from public/assets/images/logo/logo_symbol_white.svg
// so the brand mark on the card is byte-identical to what we use on the site.
const BrandChip = ({ size = 88 }: { size?: number }) => {
  const logoSize = Math.round(size * 0.56);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.24),
        background: CHIP_BG,
        border: '1px solid rgba(255,255,255,0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 12px 30px -10px rgba(0,0,0,0.6)',
      }}
    >
      <svg width={logoSize} height={Math.round(logoSize * 197 / 226)} viewBox="0 0 226 197" fill="none">
        <path d="M221.461 168.345H56.3809C54.0125 168.345 52.0903 166.424 52.0903 164.057C52.0903 161.69 54.0125 159.769 56.3809 159.769H214.03L129.177 12.8733L126.184 17.8169C125.002 19.8695 122.379 20.5757 120.326 19.395C118.272 18.2143 117.565 15.5927 118.747 13.5401L125.453 2.14984C126.217 0.820484 127.635 0.00285883 129.169 0C130.702 0 132.118 0.817626 132.884 2.14412L225.177 161.913C225.943 163.239 225.943 164.874 225.177 166.201C224.41 167.527 222.994 168.345 221.461 168.345Z" fill="white" />
        <path d="M17.5283 168.345H4.29054C2.75739 168.345 1.34151 167.527 0.574933 166.201C-0.191644 164.874 -0.191644 163.239 0.574933 161.913L92.8674 2.14412C93.634 0.817626 95.0499 0 96.583 0C98.1162 0 99.532 0.817626 100.299 2.14412L182.611 144.637C184.362 147.879 183.491 149.616 181.44 150.799C179.846 151.719 177.19 151.861 174.799 148.144L96.583 12.8647L11.7218 159.769H17.5283C19.8967 159.769 21.8189 161.69 21.8189 164.057C21.8189 166.424 19.8967 168.345 17.5283 168.345Z" fill="white" />
        <path d="M205.168 196.716H20.586C19.0528 196.716 17.6369 195.898 16.8703 194.572C16.1038 193.245 16.1038 191.61 16.8703 190.284L99.3607 47.4826C100.545 45.4328 103.171 44.7295 105.222 45.9131C107.272 47.0967 107.976 49.7211 106.792 51.7708L28.0172 188.14H197.748L195.255 183.218C194.074 181.166 194.781 178.544 196.834 177.363C198.888 176.183 201.511 176.889 202.692 178.941L208.889 190.292C209.653 191.619 209.653 193.254 208.887 194.578C208.12 195.904 206.704 196.719 205.171 196.719L205.168 196.716Z" fill="white" />
      </svg>
    </div>
  );
};

// Tiny cloud icon for the tag pill (optional). next/og's inline SVG support
// is shaky for complex paths — using positioned divs to draw the icon.
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
  // Tag is OPT-IN — only shown when explicitly passed (series posts).
  // News posts pass no tag, so the bottom edge stays clean.
  const tagRaw = searchParams.get('tag');
  const tag = tagRaw ? tagRaw.slice(0, 24) : undefined;
  const icon = searchParams.get('icon') ?? undefined;
  const bg = searchParams.get('bg');
  const ratio = searchParams.get('ratio') === '9:16' ? '9:16' : '4:5';

  const width = 1080;
  const height = ratio === '9:16' ? 1920 : 1350;

  const [regular, bold, black] = await Promise.all([loadFont(400), loadFont(700), loadFont(800)]);
  const fonts = [
    ...(regular ? [{ name: 'Inter', data: regular, weight: 400 as const, style: 'normal' as const }] : []),
    ...(bold ? [{ name: 'Inter', data: bold, weight: 700 as const, style: 'normal' as const }] : []),
    ...(black ? [{ name: 'Inter', data: black, weight: 800 as const, style: 'normal' as const }] : []),
  ];

  const upperTitle = title.toUpperCase();
  const titleTokens = tokenizeTitle(upperTitle, highlight?.toUpperCase());

  // Title scales with how much copy we have; 80px is the high end for short
  // headlines, scaling down so longer ones still fit two/three lines.
  const titleSize = upperTitle.length > 60 ? 64 : upperTitle.length > 40 ? 72 : 80;

  // Bottom padding: tight when there's no tag pill so the title sits close
  // to the edge; a bit more breathing room when the pill is present.
  const paddingBottom = tag ? 56 : 48;

  return (
    new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'relative',
            background: BG,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Background image — full bleed */}
          {bg
            ? (
                // eslint-disable-next-line next/no-img-element
                <img
                  src={bg}
                  alt=""
                  width={width}
                  height={height}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )
            : null}

          {/* Smooth dark mask — continuous linear gradient from transparent
              at the top of the canvas to 90% dark at the bottom. Single fade,
              no plateaus, max opacity 90% per spec. Satori requires explicit
              top/right/bottom/left (no `inset` shorthand) AND a non-empty
              child for the overlay div to actually render. */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              display: 'flex',
              background: 'linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.90) 100%)',
            }}
          >
            <span style={{ display: 'flex' }} />
          </div>

          {/* Content — absolutely anchored to the bottom of the canvas.
              Using `bottom` + `left/right` directly because Satori doesn't
              consistently honor `justify-content: flex-end` on absolutely
              positioned containers; explicit positioning is more reliable. */}
          <div
            style={{
              position: 'absolute',
              bottom: paddingBottom,
              left: 64,
              right: 64,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Brand chip + name + handle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 30 }}>
              <BrandChip size={88} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#fff', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.1 }}>
                  Agility Creative
                </span>
                <span style={{ color: 'rgba(255,255,255,0.62)', fontSize: 24, fontWeight: 400, marginTop: 2 }}>
                  @agilitycreative
                </span>
              </div>
            </div>

            {/* Title — ALL CAPS, per-word tokens so flex-wrap breaks at word
                boundaries. Word spacing is set with explicit marginRight on
                each token because Satori doesn't apply flex `gap` reliably to
                wrapped inline-flex children. */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                rowGap: Math.round(titleSize * 0.12),
                lineHeight: 1,
              }}
            >
              {titleTokens.map((token, i) => {
                const isLast = i === titleTokens.length - 1;
                return (
                  <span
                    key={i}
                    style={{
                      color: '#fff',
                      fontSize: titleSize,
                      fontWeight: 800,
                      letterSpacing: -1.5,
                      display: 'flex',
                      alignItems: 'center',
                      lineHeight: 1.05,
                      marginRight: isLast ? 0 : Math.round(titleSize * 0.24),
                      ...(token.hl
                        ? {
                            background: PRIMARY,
                            padding: `2px ${Math.round(titleSize * 0.18)}px`,
                            borderRadius: 10,
                          }
                        : {}),
                    }}
                  >
                    {token.text}
                  </span>
                );
              })}
            </div>

            {/* Subtitle */}
            {subtitle
              ? (
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.82)',
                      fontSize: 32,
                      fontWeight: 400,
                      marginTop: 22,
                      lineHeight: 1.3,
                      maxWidth: 880,
                    }}
                  >
                    {subtitle}
                  </span>
                )
              : null}

            {/* Tag pill — only when `tag` is explicitly passed (series posts).
                News posts pass no tag and the bottom stays clean. */}
            {tag
              ? (
                  <div
                    style={{
                      marginTop: 28,
                      alignSelf: 'flex-start',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      background: 'rgba(124,58,237,0.18)',
                      border: '1px solid rgba(124,58,237,0.45)',
                      padding: '12px 24px',
                      borderRadius: 999,
                    }}
                  >
                    {icon === 'cloud' && <CloudIcon />}
                    <span
                      style={{
                        color: '#fff',
                        fontSize: 24,
                        fontWeight: 800,
                        letterSpacing: 1.5,
                      }}
                    >
                      {tag.toUpperCase()}
                    </span>
                  </div>
                )
              : null}
          </div>
        </div>
      ),
      {
        width,
        height,
        ...(fonts.length > 0 ? { fonts } : {}),
      },
    )
  );
}
