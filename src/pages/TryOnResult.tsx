import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { useSessionStore } from "../store/useSessionStore";
import { styleItems } from "../data/styleItems";
import { generateTryOnImage } from "../lib/generateTryOnImage";

export default function TryOnResult() {
  const navigate = useNavigate();
  const ran = useRef(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [source, setSource] = useState<"ai" | "mock" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    photos,
    selectedItemIds,
    poseScores,
    watermarkEnabled,
    addTryOnResult,
  } = useSessionStore();

  const selectedItems = styleItems.filter((i) => selectedItemIds.includes(i.id));

  useEffect(() => {
    if (ran.current) return;
    if (!photos.front || selectedItemIds.length === 0) {
      navigate("/tryon-select");
      return;
    }
    ran.current = true;

    (async () => {
      try {
        const { dataUrl, baseDataUrl, source } = await generateTryOnImage(
          photos.front!,
          selectedItems,
          poseScores?.landmarks,
          watermarkEnabled,
        );
        setResultUrl(dataUrl);
        setSource(source);
        addTryOnResult({
          itemId: selectedItemIds.join(","),
          resultDataUrl: dataUrl,
          baseDataUrl,
          source,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error(err);
        setError("합성 중 문제가 발생했어요. 다시 시도해주세요.");
      }
    })();
  }, []);

  return (
    <Layout title="가상 피팅 결과">
      <div className="space-y-5">
        {!resultUrl && !error && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--surface-muted)] border-t-[var(--primary)]" />
            <p className="text-base font-bold">합성 이미지를 만들고 있어요</p>
            <p className="text-sm text-[var(--text-muted)]">
              AI가 선택하신 옷을 입혀보는 중이에요. 몇 초 정도 걸릴 수 있어요.
            </p>
          </div>
        )}

        {error && (
          <div className="space-y-4 text-center">
            <p className="text-[var(--danger)]">{error}</p>
            <Button onClick={() => navigate("/tryon-select")}>다시 선택하기</Button>
          </div>
        )}

        {resultUrl && (
          <>
            <img
              src={resultUrl}
              alt="가상 피팅 결과"
              className="w-full rounded-2xl border border-[var(--border)]"
            />
            {source === "mock" && (
              <p className="text-xs text-[var(--danger)]">
                AI 합성 서버에 연결하지 못해 간단한 미리보기로 대신 보여드렸어요.
              </p>
            )}
            <div className="rounded-2xl bg-[var(--surface)] p-4">
              <p className="mb-2 text-sm font-bold">이번에 골라보신 아이템</p>
              <ul className="space-y-1 text-sm text-[var(--text-muted)]">
                {selectedItems.map((item) => (
                  <li key={item.id}>• {item.name} — {item.description}</li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              이 이미지는 AI로 만든 참고용 시뮬레이션이며, 실제 착용감이나
              색감과 다를 수 있어요. 촬영에 사용한 원본 사진은 이 화면을 벗어나면
              폐기돼요.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/save-share")}>저장하고 공유하기</Button>
              <Button variant="secondary" onClick={() => navigate("/tryon-select")}>
                다른 옷 입어보기
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
