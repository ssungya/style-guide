import type { PoseScores, StyleItem } from "../types";
import { requestRealTryOn } from "./tryOnApi";
import { composeTryOnMockBase, stampDisclaimer } from "./tryOnMock";

export interface TryOnGenerationResult {
  /** 고지 배너/워터마크가 입혀지지 않은 원본 합성 결과. 워터마크 재적용 시 재사용한다. */
  baseDataUrl: string;
  /** 화면에 바로 보여줄, 고지 배너가 입혀진 최종 이미지. */
  dataUrl: string;
  source: "ai" | "mock";
}

/**
 * 실제 가상 피팅(Gemini API)을 먼저 시도하고, 서버 미설정·API 오류·안전 정책
 * 차단 등으로 실패하면 목업 합성으로 자동 대체한다.
 */
export async function generateTryOnImage(
  photoDataUrl: string,
  items: StyleItem[],
  landmarks: PoseScores["landmarks"] | undefined,
  watermark: boolean,
): Promise<TryOnGenerationResult> {
  try {
    const baseDataUrl = await requestRealTryOn(photoDataUrl, items);
    const dataUrl = await stampDisclaimer(baseDataUrl, watermark);
    return { baseDataUrl, dataUrl, source: "ai" };
  } catch (err) {
    console.warn("[tryon] 실제 API 합성 실패, 목업으로 대체합니다.", err);
    const baseDataUrl = await composeTryOnMockBase(photoDataUrl, items, landmarks);
    const dataUrl = await stampDisclaimer(baseDataUrl, watermark);
    return { baseDataUrl, dataUrl, source: "mock" };
  }
}
