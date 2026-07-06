import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { useSessionStore } from "../store/useSessionStore";
import { typeLabel } from "../lib/diagnosis";

const TYPE_TAGLINE: Record<string, string> = {
  straight: "곧고 탄탄한 인상의 스트레이트 타입",
  wave: "부드럽고 유연한 인상의 웨이브 타입",
  natural: "자연스럽고 시원한 인상의 내추럴 타입",
};

export default function DiagnosisResult() {
  const navigate = useNavigate();
  const diagnosisResult = useSessionStore((s) => s.diagnosisResult);

  useEffect(() => {
    if (!diagnosisResult) navigate("/photo");
  }, [diagnosisResult, navigate]);

  if (!diagnosisResult) return null;

  const confidencePct = Math.round(diagnosisResult.confidence * 100);

  return (
    <Layout title="진단 결과">
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[var(--surface-muted)] text-4xl">
          ✨
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-muted)]">
            회원님의 체형 타입은
          </p>
          <h2 className="mt-1 text-3xl font-extrabold text-[var(--primary)]">
            {typeLabel(diagnosisResult.type)} 타입
          </h2>
          <p className="mt-1 text-base text-[var(--text-muted)]">
            {TYPE_TAGLINE[diagnosisResult.type]}
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--surface)] p-4 text-left">
          <p className="mb-2 text-sm font-bold">진단 신뢰도 {confidencePct}%</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 rounded-2xl bg-[var(--surface)] p-4 text-left">
          <p className="mb-1 text-sm font-bold">이렇게 판단했어요</p>
          <ul className="space-y-2 text-[15px] text-[var(--text-muted)]">
            {diagnosisResult.reasons.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Button onClick={() => navigate("/recommendations")}>
            나에게 맞는 스타일 보기
          </Button>
          <Button variant="ghost" onClick={() => navigate("/basic-info")}>
            다시 진단하기
          </Button>
        </div>
      </div>
    </Layout>
  );
}
