import { GoogleGenAI } from "@google/genai";

export function parseDataUrl(dataUrl) {
  const match = /^data:(.+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("잘못된 이미지 형식이에요.");
  return { mimeType: match[1], base64: match[2] };
}

export function buildPrompt(items) {
  const itemLines = items
    .map((item, i) => {
      const parts = [
        `${i + 1}. ${item.name} (${item.category})`,
        `설명: ${item.description}`,
        `핏: ${item.fit}`,
        `소재: ${item.material}`,
      ];
      if (item.neckline) parts.push(`넥라인: ${item.neckline}`);
      if (item.color) parts.push(`대표 색상: ${item.color}`);
      return parts.join(", ");
    })
    .join("\n");

  return [
    "첨부된 사진 속 인물이 아래 설명의 옷을 자연스럽고 사실적으로 입은 모습으로 이미지를 다시 생성해줘.",
    "인물의 얼굴, 체형, 포즈, 배경, 조명은 원본 사진과 최대한 동일하게 유지하고, 옷만 아래 설명대로 교체해줘.",
    "",
    itemLines,
    "",
    "결과는 사진처럼 자연스러운 한 장의 이미지로만 생성해줘.",
  ].join("\n");
}

/**
 * TryOnRequestError는 클라이언트에 그대로 보여줄 수 있는 메시지와 HTTP 상태코드를 담는다.
 * 로컬 Express 서버와 Vercel 서버리스 함수가 동일한 방식으로 에러를 처리하도록 공용화했다.
 */
export class TryOnRequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/**
 * 사진 + 선택 아이템 정보를 받아 Gemini 이미지 생성 API를 호출하고
 * data URL 형태의 합성 이미지를 반환한다. Express/Vercel 양쪽에서 재사용한다.
 */
export async function generateTryOnFromGemini({ apiKey, model, photo, items }) {
  if (!apiKey) {
    throw new TryOnRequestError("서버에 GEMINI_API_KEY가 설정되어 있지 않아요.", 503);
  }
  if (!photo || !Array.isArray(items) || items.length === 0) {
    throw new TryOnRequestError("사진과 선택한 아이템 정보가 필요해요.", 400);
  }

  const { mimeType, base64 } = parseDataUrl(photo);
  const prompt = buildPrompt(items);
  const ai = new GoogleGenAI({ apiKey });

  let response;
  try {
    response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, { inlineData: { mimeType, data: base64 } }],
        },
      ],
    });
  } catch (err) {
    console.error("[tryon] Gemini 호출 오류:", err);
    throw new TryOnRequestError("가상 피팅 생성 중 오류가 발생했어요.", 500);
  }

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart) {
    const blockReason = response.promptFeedback?.blockReason;
    throw new TryOnRequestError(
      blockReason
        ? `AI가 안전 정책으로 이미지를 생성하지 못했어요 (${blockReason})`
        : "AI가 이미지를 생성하지 못했어요.",
      422,
    );
  }

  const resultMime = imagePart.inlineData.mimeType || "image/png";
  return `data:${resultMime};base64,${imagePart.inlineData.data}`;
}
