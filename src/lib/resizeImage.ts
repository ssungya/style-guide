import { loadImage } from "./pose";

/**
 * 업로드 직후의 원본 사진(휴대폰 촬영 시 수 MB)을 API 전송 전에 축소한다.
 * Vercel 서버리스 함수의 요청 본문 크기 제한을 피하고 비용(토큰)도 줄인다.
 */
export async function resizeImageDataUrl(
  dataUrl: string,
  maxDim = 1024,
  quality = 0.85,
): Promise<string> {
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}
