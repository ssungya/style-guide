import { generateTryOnFromGemini, TryOnRequestError } from "../shared/tryonLogic.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "허용되지 않은 메서드예요." });
    return;
  }

  try {
    const { photo, items } = req.body ?? {};
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
    const image = await generateTryOnFromGemini({ apiKey, model, photo, items });
    res.status(200).json({ image });
  } catch (err) {
    if (err instanceof TryOnRequestError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error("[api/tryon] 오류:", err);
    res.status(500).json({ error: "가상 피팅 생성 중 오류가 발생했어요." });
  }
}
