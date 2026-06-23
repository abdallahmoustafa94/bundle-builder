/** Circular "100% satisfaction guarantee" seal rendered inline as SVG. */
export function GuaranteeBadge({ percent, className }: { percent: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`${percent} satisfaction guarantee`}>
      <defs>
        <path id="seal-text-top" d="M50 50 m-37 0 a37 37 0 0 1 74 0" fill="none" />
        <path id="seal-text-bottom" d="M50 50 m37 0 a37 37 0 0 1 -74 0" fill="none" />
      </defs>
      {/* Scalloped edge */}
      <g fill="#4E2FD2">
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          return <circle key={i} cx={50 + Math.cos(angle) * 44} cy={50 + Math.sin(angle) * 44} r="6" />;
        })}
      </g>
      <circle cx="50" cy="50" r="44" fill="#4E2FD2" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.5" />
      <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="800" fill="#ffffff">
        {percent}
      </text>
      <text x="50" y="60" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#ffffff" letterSpacing="0.5">
        WYZE
      </text>
      <text>
        <textPath href="#seal-text-bottom" startOffset="50%" textAnchor="middle" fontSize="7" fontWeight="700" fill="#ffffff" letterSpacing="0.5">
          satisfaction guarantee
        </textPath>
      </text>
    </svg>
  );
}
