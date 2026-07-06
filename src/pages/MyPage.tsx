import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { useHistoryStore } from "../store/useHistoryStore";
import { useSessionStore } from "../store/useSessionStore";
import { typeLabel } from "../lib/diagnosis";

export default function MyPage() {
  const navigate = useNavigate();
  const { entries, clear } = useHistoryStore();
  const resetForRediagnosis = useSessionStore((s) => s.resetForRediagnosis);

  return (
    <Layout title="마이페이지">
      <div className="space-y-5">
        <Button
          onClick={() => {
            resetForRediagnosis();
            navigate("/basic-info");
          }}
        >
          새로 진단하기
        </Button>

        <div>
          <p className="mb-2 text-base font-bold">지난 진단 이력</p>
          {entries.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">
              아직 진단 이력이 없어요.
            </p>
          ) : (
            <ul className="space-y-2">
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between rounded-2xl bg-[var(--surface)] p-4"
                >
                  <div>
                    <p className="font-bold">{typeLabel(e.type)} 타입</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {new Date(e.createdAt).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <span className="text-sm text-[var(--accent)]">
                    신뢰도 {Math.round(e.confidence * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {entries.length > 0 && (
          <Button variant="ghost" onClick={clear}>
            이력 전체 삭제
          </Button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => navigate("/help")}>
            촬영 가이드
          </Button>
          <Button variant="secondary" onClick={() => navigate("/settings")}>
            접근성 설정
          </Button>
        </div>
      </div>
    </Layout>
  );
}
