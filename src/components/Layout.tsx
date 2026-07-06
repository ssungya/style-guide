import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSettingsStore } from "../store/useSettingsStore";

const STEP_ROUTES = [
  "/consent",
  "/basic-info",
  "/photo",
  "/questionnaire",
  "/processing",
  "/result",
];

export function useApplyAccessibility() {
  const { fontScale, highContrast } = useSettingsStore();
  useEffect(() => {
    document.documentElement.setAttribute("data-font-scale", fontScale);
  }, [fontScale]);
  useEffect(() => {
    document.documentElement.classList.toggle("hc", highContrast);
  }, [highContrast]);
}

export function Layout({
  children,
  title,
  showBack = true,
  hideChrome = false,
}: {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  hideChrome?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const stepIndex = STEP_ROUTES.indexOf(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {!hideChrome && (
        <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3">
            {showBack ? (
              <button
                onClick={() => navigate(-1)}
                aria-label="이전으로"
                className="rounded-full p-2 text-xl leading-none hover:bg-[var(--surface-muted)]"
              >
                ←
              </button>
            ) : (
              <span className="w-9" />
            )}
            <h1 className="flex-1 text-center text-lg font-bold">
              {title ?? "바디라인 스타일링"}
            </h1>
            <Link
              to="/mypage"
              aria-label="마이페이지"
              className="rounded-full p-2 text-xl leading-none hover:bg-[var(--surface-muted)]"
            >
              👤
            </Link>
            <Link
              to="/settings"
              aria-label="접근성 설정"
              className="rounded-full p-2 text-xl leading-none hover:bg-[var(--surface-muted)]"
            >
              ⚙
            </Link>
          </div>
          {stepIndex >= 0 && (
            <div className="mx-auto max-w-xl px-4 pb-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all"
                  style={{
                    width: `${((stepIndex + 1) / STEP_ROUTES.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </header>
      )}
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
