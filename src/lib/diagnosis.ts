import { questions } from "../data/questionnaire";
import type { BodyType, DiagnosisResult, PoseScores } from "../types";

const TYPE_LABEL: Record<BodyType, string> = {
  straight: "스트레이트",
  wave: "웨이브",
  natural: "내추럴",
};

const TYPE_REASON: Record<BodyType, string> = {
  straight:
    "어깨와 상체가 탄탄하고 허리 라인 굴곡이 적은, 곧고 단단한 인상의 체형이에요.",
  wave: "상체가 부드럽고 하체 쪽으로 자연스러운 곡선이 있는, 부드러운 인상의 체형이에요.",
  natural:
    "어깨나 손목 같은 관절이 도드라지고 팔다리가 길어 보이는, 자연스럽고 시원한 인상의 체형이에요.",
};

export function scoreQuestionnaire(
  answers: Record<string, string>,
): Record<BodyType, number> {
  const totals: Record<BodyType, number> = { straight: 0, wave: 0, natural: 0 };
  for (const q of questions) {
    const selectedOptionId = answers[q.id];
    const option = q.options.find((o) => o.id === selectedOptionId);
    if (option) totals[option.leaning] += 1;
  }
  const answeredCount = Object.values(answers).filter(Boolean).length || 1;
  return {
    straight: totals.straight / answeredCount,
    wave: totals.wave / answeredCount,
    natural: totals.natural / answeredCount,
  };
}

const PHOTO_WEIGHT = 0.4;
const QUESTIONNAIRE_WEIGHT = 0.6;

export function combineDiagnosis(
  questionnaireScores: Record<BodyType, number>,
  poseScores: PoseScores,
): DiagnosisResult {
  const photoWeight = poseScores.available ? PHOTO_WEIGHT : 0;
  const qWeight = poseScores.available
    ? QUESTIONNAIRE_WEIGHT
    : QUESTIONNAIRE_WEIGHT + PHOTO_WEIGHT;

  const combined: Record<BodyType, number> = {
    straight:
      questionnaireScores.straight * qWeight + poseScores.straight * photoWeight,
    wave: questionnaireScores.wave * qWeight + poseScores.wave * photoWeight,
    natural:
      questionnaireScores.natural * qWeight + poseScores.natural * photoWeight,
  };

  const entries = Object.entries(combined) as [BodyType, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const [topType, topScore] = entries[0];
  const [, secondScore] = entries[1];

  const total = entries.reduce((sum, [, v]) => sum + v, 0) || 1;
  const margin = (topScore - secondScore) / total;
  const confidence = Math.min(0.95, Math.max(0.4, 0.55 + margin * 1.5));

  const reasons = [TYPE_REASON[topType]];
  if (poseScores.available) {
    reasons.push(
      "전신사진 분석 결과 어깨와 골반의 비율이 문진 응답 경향과 비슷하게 나타났어요.",
    );
  } else {
    reasons.push(
      "사진 분석은 참고용으로만 반영되었고, 이번 진단은 문진 응답을 중심으로 산출했어요.",
    );
  }
  reasons.push(
    "이 결과는 참고용 스타일링 가이드이며, 의학적 진단이 아니에요. 언제든 다시 진단해볼 수 있어요.",
  );

  return {
    type: topType,
    confidence,
    reasons,
    photoUsed: poseScores.available,
    createdAt: new Date().toISOString(),
  };
}

export function typeLabel(type: BodyType): string {
  return TYPE_LABEL[type];
}
