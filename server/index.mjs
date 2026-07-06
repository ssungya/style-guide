import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

// npm 스크립트가 프로젝트 루트에서 실행돼도 항상 server/.env를 정확히 찾도록
// 이 파일 위치 기준 절대 경로로 로드한다 (cwd에 의존하지 않음).
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

// PORT는 프리뷰/배포 환경에서 프론트엔드용으로 이미 쓰이는 경우가 많아
// 충돌을 피하기 위해 이 서버 전용 변수명(API_PORT)을 사용한다.
const PORT = process.env.API_PORT || 8787;
const apiKey = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

if (!apiKey) {
  console.warn(
    "[server] GEMINI_API_KEY가 설정되지 않았습니다. server/.env 파일에 키를 넣어주세요.",
  );
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

function parseDataUrl(dataUrl) {
  const match = /^data:(.+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("잘못된 이미지 형식이에요.");
  return { mimeType: match[1], base64: match[2] };
}

function buildPrompt(items) {
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

app.post("/api/tryon", async (req, res) => {
  if (!ai) {
    return res.status(503).json({ error: "서버에 GEMINI_API_KEY가 설정되어 있지 않아요." });
  }

  try {
    const { photo, items } = req.body;
    if (!photo || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "사진과 선택한 아이템 정보가 필요해요." });
    }

    const { mimeType, base64 } = parseDataUrl(photo);
    const prompt = buildPrompt(items);

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, { inlineData: { mimeType, data: base64 } }],
        },
      ],
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p.inlineData);

    if (!imagePart) {
      const blockReason = response.promptFeedback?.blockReason;
      return res.status(422).json({
        error: blockReason
          ? `AI가 안전 정책으로 이미지를 생성하지 못했어요 (${blockReason})`
          : "AI가 이미지를 생성하지 못했어요.",
      });
    }

    const resultMime = imagePart.inlineData.mimeType || "image/png";
    const resultDataUrl = `data:${resultMime};base64,${imagePart.inlineData.data}`;
    res.json({ image: resultDataUrl });
  } catch (err) {
    console.error("[server] /api/tryon 오류:", err);
    res.status(500).json({ error: "가상 피팅 생성 중 오류가 발생했어요." });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, hasKey: !!apiKey });
});

app.listen(PORT, () => {
  console.log(`[server] API server listening on http://localhost:${PORT}`);
});
