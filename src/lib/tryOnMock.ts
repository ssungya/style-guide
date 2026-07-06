import type { StyleItem } from "../types";
import { loadImage } from "./pose";

interface Landmarks {
  shoulderY: number;
  hipY: number;
  kneeY: number;
  shoulderXMin: number;
  shoulderXMax: number;
  hipXMin: number;
  hipXMax: number;
}

const FALLBACK_LANDMARKS: Landmarks = {
  shoulderY: 0.22,
  hipY: 0.52,
  kneeY: 0.78,
  shoulderXMin: 0.32,
  shoulderXMax: 0.68,
  hipXMin: 0.3,
  hipXMax: 0.7,
};

const CATEGORY_ORDER: Record<StyleItem["category"], number> = {
  outer: 0,
  top: 1,
  bottom: 2,
  accessory: 3,
};

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawDisclaimerBanner(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  watermark: boolean,
) {
  const bannerH = Math.max(34, height * 0.06);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, height - bannerH, width, bannerH);
  ctx.fillStyle = "#ffffff";
  ctx.font = `${Math.max(12, Math.round(bannerH * 0.4))}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "AI 시뮬레이션 결과이며 실제 착용감과 다를 수 있어요",
    width / 2,
    height - bannerH / 2,
  );

  if (watermark) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = `bold ${Math.max(12, Math.round(width * 0.03))}px sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("바디라인 스타일링", width - 12, 12);
  }
}

/**
 * 이미지에 AI 시뮬레이션 고지 배너와(옵션) 워터마크를 입혀 새 데이터URL로 반환한다.
 * 워터마크 on/off를 바꿀 때 API를 다시 호출하지 않고 이 함수만 재실행하면 된다.
 */
export async function stampDisclaimer(
  dataUrl: string,
  watermark: boolean,
): Promise<string> {
  const img = await loadImage(dataUrl);
  const maxW = 900;
  const scale = Math.min(1, maxW / img.naturalWidth);
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);
  drawDisclaimerBanner(ctx, width, height, watermark);
  return canvas.toDataURL("image/jpeg", 0.9);
}

/**
 * 실제 가상 피팅 API 없이, 사용자 사진 위에 선택한 아이템의
 * 색상 블록을 신체 부위 대략적 위치에 겹쳐 그리는 목업 합성(고지 배너 제외).
 * 실제 API 호출이 불가능하거나 실패했을 때의 대체(fallback) 경로로 쓰인다.
 */
export async function composeTryOnMockBase(
  photoDataUrl: string,
  items: StyleItem[],
  landmarks: Landmarks | undefined,
): Promise<string> {
  const img = await loadImage(photoDataUrl);
  const maxW = 900;
  const scale = Math.min(1, maxW / img.naturalWidth);
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);

  const lm = landmarks ?? FALLBACK_LANDMARKS;
  const sorted = [...items].sort(
    (a, b) => CATEGORY_ORDER[a.category] - CATEGORY_ORDER[b.category],
  );

  for (const item of sorted) {
    let top: number;
    let bottom: number;
    let xMin: number;
    let xMax: number;
    let alpha = 0.42;

    switch (item.category) {
      case "outer":
        top = lm.shoulderY - 0.03;
        bottom = lm.hipY + 0.08;
        xMin = lm.shoulderXMin - 0.07;
        xMax = lm.shoulderXMax + 0.07;
        alpha = 0.3;
        break;
      case "top":
        top = lm.shoulderY;
        bottom = lm.hipY;
        xMin = lm.shoulderXMin - 0.03;
        xMax = lm.shoulderXMax + 0.03;
        alpha = 0.45;
        break;
      case "bottom":
        top = lm.hipY;
        bottom = Math.min(0.96, lm.kneeY + (lm.kneeY - lm.hipY) * 0.3);
        xMin = lm.hipXMin - 0.02;
        xMax = lm.hipXMax + 0.02;
        alpha = 0.45;
        break;
      case "accessory":
      default:
        top = lm.shoulderY - 0.08;
        bottom = lm.shoulderY;
        xMin = (lm.shoulderXMin + lm.shoulderXMax) / 2 - 0.06;
        xMax = (lm.shoulderXMin + lm.shoulderXMax) / 2 + 0.06;
        alpha = 0.55;
        break;
    }

    const x = xMin * width;
    const y = top * height;
    const w = (xMax - xMin) * width;
    const h = (bottom - top) * height;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = item.color;
    roundRect(ctx, x, y, w, Math.max(h, 12), Math.min(24, w / 4));
    ctx.fill();
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 2;
    ctx.strokeStyle = item.color;
    roundRect(ctx, x, y, w, Math.max(h, 12), Math.min(24, w / 4));
    ctx.stroke();
    ctx.restore();
  }

  return canvas.toDataURL("image/jpeg", 0.92);
}
