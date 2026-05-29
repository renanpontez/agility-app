type MockupProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * CSS-only laptop/browser mockup frame.
 * Renders a dark container with a browser-style top bar (three colored dots)
 * and the children fill the screen area below.
 */
export function LaptopMockup({ children, className = '' }: MockupProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-white/[0.08] bg-[#111] shadow-2xl shadow-black/50 ${className}`}>
      {/* Browser top bar */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#1a1a1a] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        {/* URL bar placeholder */}
        <div className="ml-3 h-5 flex-1 rounded-md bg-white/[0.06]" />
      </div>
      {/* Screen content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

/**
 * CSS-only smartphone mockup frame.
 * Renders a dark rounded container with device bezels, a notch at top,
 * and the children fill the screen area.
 */
export function PhoneMockup({ children, className = '' }: MockupProps) {
  return (
    <div className={`inline-block rounded-[2rem] border-[3px] border-white/[0.1] bg-[#111] p-1.5 shadow-2xl shadow-black/50 ${className}`}>
      {/* Inner device frame */}
      <div className="relative overflow-hidden rounded-3xl bg-black">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-[#111]" />
        {/* Screen content */}
        <div className="relative">
          {children}
        </div>
        {/* Bottom bar indicator */}
        <div className="absolute bottom-1.5 left-1/2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
