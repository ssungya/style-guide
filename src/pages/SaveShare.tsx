import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { useSessionStore } from "../store/useSessionStore";
import { styleItems } from "../data/styleItems";
import { stampDisclaimer } from "../lib/tryOnMock";
import { typeLabel } from "../lib/diagnosis";

export default function SaveShare() {
  const navigate = useNavigate();
  const {
    diagnosisResult,
    selectedItemIds,
    tryOnResults,
    watermarkEnabled,
    setWatermarkEnabled,
    resetForRediagnosis,
  } = useSessionStore();

  const latest = tryOnResults[tryOnResults.length - 1] ?? null;
  const [preview, setPreview] = useState<string | null>(latest?.resultDataUrl ?? null);
  const [regenerating, setRegenerating] = useState(false);

  const selectedItems = styleItems.filter((i) => selectedItemIds.includes(i.id));

  useEffect(() => {
    if (!diagnosisResult || !preview) navigate("/result");
  }, [diagnosisResult, preview, navigate]);

  // 워터마크 on/off는 이미 만들어둔 합성 결과(baseDataUrl)에 배너만 다시 그리는
  // 방식으로 처리한다. API를 다시 호출하지 않아 추가 비용이 들지 않는다.
  async function handleWatermarkToggle(checked: boolean) {
    setWatermarkEnabled(checked);
    if (!latest) return;
    setRegenerating(true);
    try {
      const dataUrl = await stampDisclaimer(latest.baseDataUrl, checked);
      setPreview(dataUrl);
    } finally {
      setRegenerating(false);
    }
  }

  function handleDownload() {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = "bodyline-styling-result.jpg";
    a.click();
  }

  async function handleShare() {
    if (!preview) return;
    try {
      const res = await fetch(preview);
      const blob = await res.blob();
      const file = new File([blob], "bodyline-styling-result.jpg", {
        type: "image/jpeg",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "바디라인 스타일링 결과",
        });
        return;
      }
    } catch {
      // 공유 API 미지원 시 아래 안내로 대체
    }
    alert("이 브라우저는 바로 공유가 어려워요. 먼저 저장한 뒤 원하는 곳에 올려주세요.");
  }

  if (!diagnosisResult || !preview) return null;

  return (
    <Layout title="저장 및 공유">
      <div className="space-y-5">
        <img
          src={preview}
          alt="최종 스타일링 결과"
          className={`w-full rounded-2xl border border-[var(--border)] ${
            regenerating ? "opacity-50" : ""
          }`}
        />

        <div className="rounded-2xl bg-[var(--surface)] p-4 space-y-2">
          <p className="text-sm font-bold">
            진단 결과: {typeLabel(diagnosisResult.type)} 타입
          </p>
          <ul className="space-y-1 text-sm text-[var(--text-muted)]">
            {selectedItems.map((item) => (
              <li key={item.id}>• {item.name}</li>
            ))}
          </ul>
        </div>

        <label className="flex items-center gap-3 text-sm font-semibold">
          <input
            type="checkbox"
            checked={watermarkEnabled}
            onChange={(e) => handleWatermarkToggle(e.target.checked)}
            className="h-6 w-6 accent-[var(--primary)]"
          />
          공유 이미지에 서비스 워터마크 넣기
        </label>

        <div className="space-y-3">
          <Button onClick={handleDownload}>내 기기에 저장하기</Button>
          <Button variant="secondary" onClick={handleShare}>
            공유하기
          </Button>
          <Button variant="ghost" onClick={() => navigate("/mypage")}>
            마이페이지에서 이력 보기
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              resetForRediagnosis();
              navigate("/");
            }}
          >
            처음으로
          </Button>
        </div>
      </div>
    </Layout>
  );
}
