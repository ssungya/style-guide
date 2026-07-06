import { Layout } from "../components/Layout";
import { useSettingsStore } from "../store/useSettingsStore";
import type { FontScale } from "../types";

const SCALE_OPTIONS: { id: FontScale; label: string }[] = [
  { id: "base", label: "기본 크기" },
  { id: "lg", label: "크게" },
  { id: "xl", label: "아주 크게" },
];

export default function AccessibilitySettings() {
  const { fontScale, setFontScale, highContrast, setHighContrast } =
    useSettingsStore();

  return (
    <Layout title="접근성 설정">
      <div className="space-y-8">
        <div>
          <p className="mb-3 text-base font-bold">글자 크기</p>
          <div className="grid grid-cols-3 gap-2">
            {SCALE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFontScale(opt.id)}
                className={`min-h-16 rounded-2xl border-2 text-sm font-semibold ${
                  fontScale === opt.id
                    ? "border-[var(--primary)] bg-[var(--surface-muted)]"
                    : "border-[var(--border)] bg-[var(--surface)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="mb-1 text-base font-bold">미리보기</p>
          <p className="text-base">
            이 화면처럼 글자 크기가 조절돼요. 읽기 편한 크기를 골라주세요.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div>
            <p className="text-base font-bold">고대비 모드</p>
            <p className="text-sm text-[var(--text-muted)]">
              화면 대비를 높여 글자와 배경을 더 뚜렷하게 보여줘요.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={highContrast}
            onClick={() => setHighContrast(!highContrast)}
            className={`h-9 w-16 flex-shrink-0 rounded-full border-2 p-1 transition-colors ${
              highContrast
                ? "border-[var(--primary)] bg-[var(--primary)]"
                : "border-[var(--border)] bg-[var(--surface-muted)]"
            }`}
          >
            <span
              className={`block h-6 w-6 rounded-full bg-[var(--surface)] transition-transform ${
                highContrast ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </Layout>
  );
}
