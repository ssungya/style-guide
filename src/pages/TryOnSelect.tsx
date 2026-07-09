import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { ItemCard } from "../components/ItemCard";
import { useSessionStore } from "../store/useSessionStore";
import { getRecommendations } from "../data/styleItems";
import type { Category } from "../types";

const CATEGORY_LABEL: Record<Category, string> = {
  top: "상의",
  bottom: "하의",
  outer: "아우터",
  accessory: "액세서리",
};
const CATEGORIES: Category[] = ["top", "bottom", "outer", "accessory"];

export default function TryOnSelect() {
  const navigate = useNavigate();
  const { diagnosisResult, selectedItemIds, toggleSelectedItem, consent, photos, basicInfo } =
    useSessionStore();

  useEffect(() => {
    if (!diagnosisResult) navigate("/result");
  }, [diagnosisResult, navigate]);

  const items = useMemo(
    () =>
      diagnosisResult ? getRecommendations(diagnosisResult.type, basicInfo.gender) : [],
    [diagnosisResult, basicInfo.gender],
  );

  if (!diagnosisResult) return null;

  if (!photos.front) {
    return (
      <Layout title="가상 피팅">
        <div className="space-y-4 text-center">
          <p className="text-base">
            가상 피팅은 전신사진이 있어야 이용할 수 있어요.
          </p>
          <Button onClick={() => navigate("/photo")}>사진 추가하러 가기</Button>
        </div>
      </Layout>
    );
  }

  if (!consent.tryOnAgreed) {
    return (
      <Layout title="가상 피팅">
        <div className="space-y-4 text-center">
          <p className="text-base">
            가상 피팅을 이용하려면 이미지 합성 동의가 필요해요.
          </p>
          <Button onClick={() => navigate("/consent")}>동의하러 가기</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="가상 피팅 선택">
      <div className="space-y-5">
        <p className="text-sm text-[var(--text-muted)]">
          입어보고 싶은 아이템을 최대 2개까지 골라주세요. ({selectedItemIds.length}/2)
        </p>

        {CATEGORIES.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;
          return (
            <div key={cat} className="space-y-2">
              <p className="text-base font-bold">{CATEGORY_LABEL[cat]}</p>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    selectable
                    selected={selectedItemIds.includes(item.id)}
                    onToggle={() => toggleSelectedItem(item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <Button
          disabled={selectedItemIds.length === 0}
          onClick={() => navigate("/tryon-result")}
        >
          선택한 옷 입어보기
        </Button>
      </div>
    </Layout>
  );
}
