import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { ItemCard } from "../components/ItemCard";
import { useSessionStore } from "../store/useSessionStore";
import { getRecommendations } from "../data/styleItems";
import { typeLabel } from "../lib/diagnosis";
import type { Category, Occasion } from "../types";

const CATEGORY_LABEL: Record<Category, string> = {
  top: "상의",
  bottom: "하의",
  outer: "아우터",
  accessory: "액세서리",
};

const OCCASION_LABEL: Record<Occasion, string> = {
  formal: "경조사·모임",
  outdoor: "야외활동",
  special: "특별한 행사",
  daily: "편안한 일상",
  active: "활동·돌봄",
};

const OCCASIONS: Occasion[] = ["daily", "formal", "outdoor", "active", "special"];
const CATEGORIES: Category[] = ["top", "bottom", "outer", "accessory"];

export default function Recommendations() {
  const navigate = useNavigate();
  const diagnosisResult = useSessionStore((s) => s.diagnosisResult);
  const hasPhoto = useSessionStore((s) => !!s.photos.front);
  const gender = useSessionStore((s) => s.basicInfo.gender);
  const [occasion, setOccasion] = useState<Occasion>("daily");

  const items = useMemo(
    () => (diagnosisResult ? getRecommendations(diagnosisResult.type, gender) : []),
    [diagnosisResult, gender],
  );

  useEffect(() => {
    if (!diagnosisResult) navigate("/result");
  }, [diagnosisResult, navigate]);

  if (!diagnosisResult) return null;

  const filtered = items.filter((item) => item.occasion === occasion);

  return (
    <Layout title="스타일 추천">
      <div className="space-y-5">
        <p className="text-sm text-[var(--text-muted)]">
          <strong className="text-[var(--text)]">{typeLabel(diagnosisResult.type)} 타입</strong>
          {" "}에게 어울리는 상황별 스타일을 모아봤어요.
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {OCCASIONS.map((o) => (
            <button
              key={o}
              onClick={() => setOccasion(o)}
              className={`flex-shrink-0 rounded-full border-2 px-4 py-2 text-sm font-semibold ${
                occasion === o
                  ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-contrast)]"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              {OCCASION_LABEL[o]}
            </button>
          ))}
        </div>

        {CATEGORIES.map((cat) => {
          const catItems = filtered.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;
          return (
            <div key={cat} className="space-y-2">
              <p className="text-base font-bold">{CATEGORY_LABEL[cat]}</p>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">
            이 상황에 대한 추천을 준비 중이에요. 다른 상황을 선택해보세요.
          </p>
        )}

        {hasPhoto ? (
          <Button onClick={() => navigate("/tryon-select")}>
            마음에 드는 옷 입어보기
          </Button>
        ) : (
          <div className="space-y-3 rounded-2xl bg-[var(--surface-muted)] p-4 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              가상 피팅(직접 입어본 모습 보기)은 전신사진이 있어야 이용할 수 있어요.
            </p>
            <Button onClick={() => navigate("/photo")}>
              사진 추가하고 입어보기
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
