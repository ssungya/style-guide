import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { analyzePoseImage, loadImage } from "../lib/pose";
import { combineDiagnosis, scoreQuestionnaire } from "../lib/diagnosis";
import { useSessionStore } from "../store/useSessionStore";
import { useHistoryStore } from "../store/useHistoryStore";

const STEPS = [
  "사진 속 자세를 살펴보고 있어요",
  "문진 응답을 확인하고 있어요",
  "체형 타입을 계산하고 있어요",
];

export default function Processing() {
  const navigate = useNavigate();
  const ran = useRef(false);
  const [stepText, setStepText] = useState(STEPS[0]);
  const {
    photos,
    questionnaireAnswers,
    setPoseScores,
    setDiagnosisResult,
  } = useSessionStore();
  const addEntry = useHistoryStore((s) => s.addEntry);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      setStepText(STEPS[0]);
      const poseScores = await (async () => {
        if (!photos.front) {
          // 사진을 등록하지 않은 경우 문진 점수만으로 진단한다.
          return { straight: 1 / 3, wave: 1 / 3, natural: 1 / 3, available: false };
        }
        try {
          const img = await loadImage(photos.front);
          return await analyzePoseImage(img);
        } catch {
          return {
            straight: 1 / 3,
            wave: 1 / 3,
            natural: 1 / 3,
            available: false,
          };
        }
      })();
      setPoseScores(poseScores);

      setStepText(STEPS[1]);
      const qScores = scoreQuestionnaire(questionnaireAnswers);

      setStepText(STEPS[2]);
      const result = combineDiagnosis(qScores, poseScores);
      setDiagnosisResult(result);
      addEntry({
        id: crypto.randomUUID(),
        type: result.type,
        confidence: result.confidence,
        createdAt: result.createdAt,
      });

      navigate("/result");
    })();
  }, [photos.front, questionnaireAnswers, setPoseScores, setDiagnosisResult, addEntry, navigate]);

  return (
    <Layout title="진단 중" showBack={false}>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[var(--surface-muted)] border-t-[var(--primary)]" />
        <p className="text-lg font-bold">{stepText}</p>
        <p className="text-sm text-[var(--text-muted)]">
          잠시만 기다려주세요. 곧 결과를 보여드릴게요.
        </p>
      </div>
    </Layout>
  );
}
