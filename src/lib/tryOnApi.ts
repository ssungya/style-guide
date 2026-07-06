import type { StyleItem } from "../types";

export class TryOnApiError extends Error {}

/** 백엔드(/api/tryon)를 통해 Gemini 이미지 생성 API로 실제 합성을 요청한다. */
export async function requestRealTryOn(
  photoDataUrl: string,
  items: StyleItem[],
): Promise<string> {
  const res = await fetch("/api/tryon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      photo: photoDataUrl,
      items: items.map((item) => ({
        name: item.name,
        description: item.description,
        fit: item.fit,
        material: item.material,
        neckline: item.neckline,
        color: item.color,
        category: item.category,
      })),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.image) {
    throw new TryOnApiError(data.error || "가상 피팅 API 호출에 실패했어요.");
  }
  return data.image as string;
}
