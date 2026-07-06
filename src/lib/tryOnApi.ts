import type { StyleItem } from "../types";
import { resizeImageDataUrl } from "./resizeImage";

export class TryOnApiError extends Error {}

/** 백엔드(/api/tryon)를 통해 Gemini 이미지 생성 API로 실제 합성을 요청한다. */
export async function requestRealTryOn(
  photoDataUrl: string,
  items: StyleItem[],
): Promise<string> {
  // 원본 사진(수 MB)을 그대로 보내면 서버리스 함수의 요청 크기 제한에 걸릴 수 있어
  // 전송 전에 축소한다.
  const resizedPhoto = await resizeImageDataUrl(photoDataUrl);

  const res = await fetch("/api/tryon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      photo: resizedPhoto,
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
