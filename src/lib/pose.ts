import {
  FilesetResolver,
  PoseLandmarker,
  type PoseLandmarkerResult,
} from "@mediapipe/tasks-vision";
import type { PoseScores } from "../types";

const WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

let landmarkerPromise: Promise<PoseLandmarker> | null = null;

function getLandmarker(): Promise<PoseLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE);
      return PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: "GPU",
        },
        runningMode: "IMAGE",
        numPoses: 1,
      });
    })();
  }
  return landmarkerPromise;
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// MediaPipe Pose landmark indices
const L_SHOULDER = 11;
const R_SHOULDER = 12;
const L_HIP = 23;
const R_HIP = 24;
const L_KNEE = 25;
const R_KNEE = 26;
const L_ANKLE = 27;
const R_ANKLE = 28;

const NEUTRAL: PoseScores = {
  straight: 1 / 3,
  wave: 1 / 3,
  natural: 1 / 3,
  available: false,
};

/**
 * MVP 규칙 기반 추정치. 어깨-골반 비율과 상하체 비율만으로 3분류를 근사하며,
 * PRD 5.2 항목대로 출시 전 전문가 검증을 거쳐 가중치를 조정해야 한다.
 */
export async function analyzePoseImage(
  imageEl: HTMLImageElement,
): Promise<PoseScores> {
  try {
    const landmarker = await getLandmarker();
    const result: PoseLandmarkerResult = landmarker.detect(imageEl);
    const landmarks = result.landmarks?.[0];
    if (!landmarks) return NEUTRAL;

    const lShoulder = landmarks[L_SHOULDER];
    const rShoulder = landmarks[R_SHOULDER];
    const lHip = landmarks[L_HIP];
    const rHip = landmarks[R_HIP];
    const lKnee = landmarks[L_KNEE];
    const rKnee = landmarks[R_KNEE];
    const lAnkle = landmarks[L_ANKLE];
    const rAnkle = landmarks[R_ANKLE];
    if (!lShoulder || !rShoulder || !lHip || !rHip) return NEUTRAL;

    const shoulderWidth = dist(lShoulder, rShoulder);
    const hipWidth = dist(lHip, rHip);
    const shoulderMid = {
      x: (lShoulder.x + rShoulder.x) / 2,
      y: (lShoulder.y + rShoulder.y) / 2,
    };
    const hipMid = { x: (lHip.x + rHip.x) / 2, y: (lHip.y + rHip.y) / 2 };
    const torsoLength = dist(shoulderMid, hipMid);

    let legLength: number | undefined;
    if (lAnkle && rAnkle) {
      const ankleMid = {
        x: (lAnkle.x + rAnkle.x) / 2,
        y: (lAnkle.y + rAnkle.y) / 2,
      };
      legLength = dist(hipMid, ankleMid);
    } else if (lKnee && rKnee) {
      const kneeMid = {
        x: (lKnee.x + rKnee.x) / 2,
        y: (lKnee.y + rKnee.y) / 2,
      };
      legLength = dist(hipMid, kneeMid) * 1.9;
    }

    const shoulderHipRatio = shoulderWidth / hipWidth;
    const torsoLegRatio = legLength ? torsoLength / legLength : undefined;

    // 어깨-골반 차이가 클수록 straight/wave 쪽으로, 균형 잡혀 있으면 natural 쪽 가중치
    const diff = shoulderHipRatio - 1; // >0: 어깨가 넓음, <0: 골반이 넓음
    let straight = Math.max(0, diff) * 1.8 + 0.33;
    let wave = Math.max(0, -diff) * 1.8 + 0.33;
    let natural = (1 - Math.min(1, Math.abs(diff) * 2)) * 0.6 + 0.2;

    if (torsoLegRatio !== undefined) {
      // 상체가 상대적으로 길면(=torsoLegRatio 큼) straight, 하체 비중이 크면 wave 성향 보정
      if (torsoLegRatio > 0.85) straight += 0.15;
      if (torsoLegRatio < 0.75) wave += 0.15;
      if (torsoLegRatio >= 0.75 && torsoLegRatio <= 0.85) natural += 0.1;
    }

    const total = straight + wave + natural;
    const kneeY =
      lKnee && rKnee ? (lKnee.y + rKnee.y) / 2 : hipMid.y + torsoLength * 0.9;

    return {
      straight: straight / total,
      wave: wave / total,
      natural: natural / total,
      available: true,
      shoulderHipRatio,
      torsoLegRatio,
      landmarks: {
        shoulderY: shoulderMid.y,
        hipY: hipMid.y,
        kneeY,
        shoulderXMin: Math.min(lShoulder.x, rShoulder.x),
        shoulderXMax: Math.max(lShoulder.x, rShoulder.x),
        hipXMin: Math.min(lHip.x, rHip.x),
        hipXMax: Math.max(lHip.x, rHip.x),
      },
    };
  } catch (err) {
    console.warn("포즈 분석 실패, 문진 점수만 사용합니다.", err);
    return NEUTRAL;
  }
}

export function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}
