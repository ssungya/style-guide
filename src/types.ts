export type Gender = "female" | "male" | "unspecified";

export type BodyType = "straight" | "wave" | "natural";

export type Category = "top" | "bottom" | "outer" | "accessory";

export type Occasion = "formal" | "outdoor" | "special" | "daily" | "active";

export interface ConsentState {
  diagnosisAgreed: boolean;
  diagnosisAgreedAt: string | null;
  tryOnAgreed: boolean;
  tryOnAgreedAt: string | null;
  isMinor: boolean;
  guardianName: string;
  guardianAgreed: boolean;
}

export interface BasicInfo {
  heightCm: number | null;
  gender: Gender;
}

export interface QuestionOption {
  id: string;
  label: string;
  leaning: BodyType;
}

export interface Question {
  id: string;
  prompt: string;
  helper?: string;
  options: QuestionOption[];
}

export interface PoseScores {
  straight: number;
  wave: number;
  natural: number;
  available: boolean;
  shoulderHipRatio?: number;
  torsoLegRatio?: number;
  landmarks?: {
    shoulderY: number;
    hipY: number;
    kneeY: number;
    shoulderXMin: number;
    shoulderXMax: number;
    hipXMin: number;
    hipXMax: number;
  };
}

export interface DiagnosisResult {
  type: BodyType;
  confidence: number;
  reasons: string[];
  photoUsed: boolean;
  createdAt: string;
}

export interface StyleItem {
  id: string;
  bodyType: BodyType;
  category: Category;
  occasion: Occasion;
  name: string;
  description: string;
  fit: string;
  material: string;
  neckline?: string;
  practicalNotes: string;
  icon: string;
  color: string;
}

export interface TryOnResultItem {
  itemId: string;
  resultDataUrl: string;
  baseDataUrl: string;
  source: "ai" | "mock";
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  type: BodyType;
  confidence: number;
  createdAt: string;
}

export type FontScale = "base" | "lg" | "xl";
