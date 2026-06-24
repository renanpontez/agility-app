// Thin wrapper over the Umami custom-event API. The site only loads the
// Umami script in production (see src/app/[locale]/layout.tsx) so this
// silently no-ops in dev and preview, which is exactly what we want — no
// noisy events from local development polluting the dashboard.
type UmamiTrack = (event: string, data?: Record<string, unknown>) => void;

type UmamiGlobal = {
  track?: UmamiTrack;
};

declare global {
  // eslint-disable-next-line vars-on-top
  var umami: UmamiGlobal | undefined;
}

export const track = (event: string, data?: Record<string, unknown>): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const umami = window.umami;
  if (umami && typeof umami.track === 'function') {
    try {
      umami.track(event, data);
    } catch {
      // Tracking must never break the experience.
    }
  }
};
