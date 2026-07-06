import type { StyleItem } from "../types";
import { ClothingIcon, type IconName } from "./ClothingIcon";

export function ItemCard({
  item,
  selectable = false,
  selected = false,
  onToggle,
}: {
  item: StyleItem;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div
      className={`flex gap-3 rounded-2xl border-2 p-3 ${
        selected
          ? "border-[var(--primary)] bg-[var(--surface-muted)]"
          : "border-[var(--border)] bg-[var(--surface)]"
      }`}
    >
      <div className="h-16 w-16 flex-shrink-0">
        <ClothingIcon name={item.icon as IconName} color={item.color} />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-base font-bold">{item.name}</p>
        <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
        <p className="text-xs text-[var(--text-muted)]">
          핏 {item.fit} · 소재 {item.material}
          {item.neckline ? ` · ${item.neckline}` : ""}
        </p>
        <p className="text-xs text-[var(--accent)]">{item.practicalNotes}</p>
      </div>
      {selectable && (
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={selected}
          className={`h-10 w-10 flex-shrink-0 self-center rounded-full border-2 text-lg font-bold ${
            selected
              ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-contrast)]"
              : "border-[var(--border)] bg-[var(--surface)]"
          }`}
        >
          {selected ? "✓" : "+"}
        </button>
      )}
    </div>
  );
}
