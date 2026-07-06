import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import { PoseGuideSvg } from "../components/PoseGuideSvg";
import { useSessionStore } from "../store/useSessionStore";
import { questions } from "../data/questionnaire";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function PhotoSlot({
  label,
  badge,
  dataUrl,
  onPick,
  onClear,
  side,
}: {
  label: string;
  badge: string;
  dataUrl: string | null;
  onPick: (file: File) => void;
  onClear: () => void;
  side?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <p className="text-base font-bold">
        {label}
        <span className="ml-1 text-[var(--text-muted)]">{badge}</span>
      </p>
      <div
        className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]"
      >
        {dataUrl ? (
          <img src={dataUrl} alt={`${label} 미리보기`} className="h-full w-full object-cover" />
        ) : (
          <PoseGuideSvg side={side} />
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = "";
        }}
      />
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>
          {dataUrl ? "다시 촬영/업로드" : "촬영 또는 업로드"}
        </Button>
        {dataUrl && (
          <button
            type="button"
            onClick={onClear}
            className="min-h-14 rounded-2xl border-2 border-[var(--border)] px-4 text-sm text-[var(--text-muted)]"
          >
            지우기
          </button>
        )}
      </div>
    </div>
  );
}

export default function PhotoCapture() {
  const navigate = useNavigate();
  const { photos, setPhoto, questionnaireAnswers } = useSessionStore();

  const hasPhoto = !!photos.front;
  // 문진을 이미 마친 뒤(진단 후 사진을 추가로 등록하러 돌아온 경우) 처리 단계로 바로 이동
  const questionnaireDone = questions.every((q) => questionnaireAnswers[q.id]);

  function handleContinue() {
    navigate(questionnaireDone ? "/processing" : "/questionnaire");
  }

  return (
    <Layout title="전신사진">
      <div className="space-y-6">
        <div className="rounded-2xl bg-[var(--surface-muted)] p-4 text-sm text-[var(--text-muted)]">
          <p className="mb-2 font-bold text-[var(--text)]">전신사진은 선택사항이에요</p>
          <ul className="space-y-1">
            <li>• 사진 없이 문진만으로도 체형 진단과 스타일 추천을 받을 수 있어요</li>
            <li>• 사진을 등록하면 진단 정확도가 높아지고, 마지막 단계에서 고른 옷을 실제로 입어본 모습(가상 피팅)까지 확인할 수 있어요</li>
            <li>• 혼자 찍기 어렵다면 거울에 비춰 찍거나 가족에게 부탁해보세요</li>
            <li>• 몸 전체가 다 나오도록 2~3걸음 뒤로 떨어져 주세요</li>
          </ul>
        </div>

        <PhotoSlot
          label="정면 사진"
          badge="(권장 · 가상 피팅에 필요)"
          dataUrl={photos.front}
          onPick={async (file) => setPhoto("front", await readFileAsDataUrl(file))}
          onClear={() => setPhoto("front", null)}
        />
        <PhotoSlot
          label="측면 사진"
          badge="(선택)"
          dataUrl={photos.side}
          onPick={async (file) => setPhoto("side", await readFileAsDataUrl(file))}
          onClear={() => setPhoto("side", null)}
          side
        />

        <Button onClick={handleContinue}>
          {hasPhoto ? "다음으로" : "사진 없이 진행하기"}
        </Button>
      </div>
    </Layout>
  );
}
