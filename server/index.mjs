import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { generateTryOnFromGemini, TryOnRequestError } from "../shared/tryonLogic.mjs";

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

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.post("/api/tryon", async (req, res) => {
  try {
    const { photo, items } = req.body;
    const image = await generateTryOnFromGemini({ apiKey, model: MODEL, photo, items });
    res.json({ image });
  } catch (err) {
    if (err instanceof TryOnRequestError) {
      return res.status(err.status).json({ error: err.message });
    }
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
