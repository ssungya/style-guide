export default function handler(_req, res) {
  res.status(200).json({ ok: true, hasKey: !!process.env.GEMINI_API_KEY });
}
