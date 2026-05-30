export const BrazilFlag = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 28 20"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="28" height="20" rx="2" fill="#009b3a" />
    <polygon points="14,3 25,10 14,17 3,10" fill="#fedf00" />
    <circle cx="14" cy="10" r="3.5" fill="#002776" />
    <path
      d="M10.8 9.2c2-0.4 4.4-0.4 6.4 0.1"
      stroke="#fff"
      strokeWidth="0.4"
      fill="none"
    />
  </svg>
);

export const UsFlag = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 28 20"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="28" height="20" rx="2" fill="#fff" />
    {Array.from({ length: 7 }).map((_, i) => (
      <rect
        key={`stripe-${i}`}
        y={i * (20 / 13) * 2}
        width="28"
        height={20 / 13}
        fill="#bf0a30"
      />
    ))}
    <rect width="11.2" height={20 / 13 * 7} fill="#002868" />
  </svg>
);
