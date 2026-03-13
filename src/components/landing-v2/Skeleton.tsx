const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`} />
);

export default Skeleton;
