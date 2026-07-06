export type IconName =
  | "shirt"
  | "blouse"
  | "knit"
  | "pants"
  | "wide-pants"
  | "skirt"
  | "long-skirt"
  | "jacket"
  | "coat"
  | "cardigan"
  | "scarf"
  | "necklace"
  | "bag"
  | "hanbok"
  | "dress"
  | "vest";

const paths: Record<IconName, string> = {
  shirt:
    "M32 8 L46 8 L56 18 L50 26 L44 22 L44 58 L20 58 L20 22 L14 26 L8 18 Z",
  blouse:
    "M32 8 L44 10 L56 20 L48 28 L44 24 L46 58 L18 58 L20 24 L16 28 L8 20 Z",
  knit: "M32 6 L48 10 L54 20 L46 26 L44 22 L46 58 L18 58 L20 22 L18 26 L10 20 L16 10 Z",
  pants: "M18 8 L46 8 L48 58 L36 58 L33 26 L30 58 L18 58 Z",
  "wide-pants": "M14 8 L50 8 L54 58 L40 58 L32 26 L24 58 L10 58 Z",
  skirt: "M22 8 L42 8 L54 56 L10 56 Z",
  "long-skirt": "M22 8 L42 8 L58 62 L6 62 Z",
  jacket:
    "M32 8 L46 10 L58 22 L50 30 L44 24 L44 58 L20 58 L20 24 L14 30 L6 22 L18 10 Z",
  coat: "M32 6 L48 10 L60 24 L50 32 L44 26 L46 62 L18 62 L20 26 L14 32 L4 24 L16 10 Z",
  cardigan:
    "M30 8 L46 8 L46 58 L38 58 L38 20 L26 20 L26 58 L18 58 L18 8 Z M46 8 L58 20 L50 28 L44 22 Z M18 8 L6 20 L14 28 L20 22 Z",
  scarf:
    "M8 20 Q32 6 56 20 Q52 30 44 26 Q34 34 32 44 Q30 34 20 26 Q12 30 8 20 Z",
  necklace:
    "M12 12 Q32 40 52 12 M32 40 L32 52 M24 46 L40 46",
  bag: "M18 26 L46 26 L50 58 L14 58 Z M24 26 C24 14 40 14 40 26",
  hanbok:
    "M32 6 L44 12 L40 20 L44 24 L52 58 L12 58 L20 24 L24 20 L20 12 Z",
  dress: "M32 8 L42 12 L46 24 L58 58 L6 58 L18 24 L22 12 Z",
  vest: "M26 8 L38 8 L38 58 L30 58 L30 20 L22 40 L18 36 Z M38 8 L46 40 L42 36 L34 20 Z",
};

export function ClothingIcon({
  name,
  color,
  className,
}: {
  name: IconName;
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 66"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <rect x="0" y="0" width="64" height="66" rx="12" fill={color} opacity="0.12" />
      <path
        d={paths[name]}
        fill={color}
        fillOpacity="0.85"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
