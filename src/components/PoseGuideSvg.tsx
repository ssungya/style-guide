export function PoseGuideSvg({ side = false }: { side?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 260"
      className="h-full w-full opacity-40"
      aria-hidden="true"
    >
      <circle cx="60" cy="28" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
      {side ? (
        <path
          d="M60 46 L60 150 M60 60 L82 100 M60 60 L44 95 M60 150 L74 250 M60 150 L52 250"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M60 46 L60 150 M60 65 L20 110 M60 65 L100 110 M60 150 L40 250 M60 150 L80 250 M32 150 L88 150"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
