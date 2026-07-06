import { create } from "zustand";
import type {
  BasicInfo,
  ConsentState,
  DiagnosisResult,
  PoseScores,
  TryOnResultItem,
} from "../types";

interface Photos {
  front: string | null;
  side: string | null;
}

interface SessionState {
  consent: ConsentState;
  setConsent: (patch: Partial<ConsentState>) => void;

  basicInfo: BasicInfo;
  setBasicInfo: (patch: Partial<BasicInfo>) => void;

  photos: Photos;
  setPhoto: (which: "front" | "side", dataUrl: string | null) => void;

  questionnaireAnswers: Record<string, string>;
  setAnswer: (questionId: string, optionId: string) => void;

  poseScores: PoseScores | null;
  setPoseScores: (scores: PoseScores | null) => void;

  diagnosisResult: DiagnosisResult | null;
  setDiagnosisResult: (result: DiagnosisResult | null) => void;

  selectedItemIds: string[];
  toggleSelectedItem: (id: string) => void;

  tryOnResults: TryOnResultItem[];
  addTryOnResult: (item: TryOnResultItem) => void;

  watermarkEnabled: boolean;
  setWatermarkEnabled: (value: boolean) => void;

  resetForRediagnosis: () => void;
}

const initialConsent: ConsentState = {
  diagnosisAgreed: false,
  diagnosisAgreedAt: null,
  tryOnAgreed: false,
  tryOnAgreedAt: null,
  isMinor: false,
  guardianName: "",
  guardianAgreed: false,
};

const initialBasicInfo: BasicInfo = {
  heightCm: null,
  gender: "unspecified",
};

export const useSessionStore = create<SessionState>((set) => ({
  consent: initialConsent,
  setConsent: (patch) =>
    set((state) => ({ consent: { ...state.consent, ...patch } })),

  basicInfo: initialBasicInfo,
  setBasicInfo: (patch) =>
    set((state) => ({ basicInfo: { ...state.basicInfo, ...patch } })),

  photos: { front: null, side: null },
  setPhoto: (which, dataUrl) =>
    set((state) => ({ photos: { ...state.photos, [which]: dataUrl } })),

  questionnaireAnswers: {},
  setAnswer: (questionId, optionId) =>
    set((state) => ({
      questionnaireAnswers: {
        ...state.questionnaireAnswers,
        [questionId]: optionId,
      },
    })),

  poseScores: null,
  setPoseScores: (scores) => set({ poseScores: scores }),

  diagnosisResult: null,
  setDiagnosisResult: (result) => set({ diagnosisResult: result }),

  selectedItemIds: [],
  toggleSelectedItem: (id) =>
    set((state) => {
      const exists = state.selectedItemIds.includes(id);
      if (exists) {
        return { selectedItemIds: state.selectedItemIds.filter((x) => x !== id) };
      }
      if (state.selectedItemIds.length >= 2) return state;
      return { selectedItemIds: [...state.selectedItemIds, id] };
    }),

  tryOnResults: [],
  addTryOnResult: (item) =>
    set((state) => ({ tryOnResults: [...state.tryOnResults, item] })),

  watermarkEnabled: true,
  setWatermarkEnabled: (value) => set({ watermarkEnabled: value }),

  resetForRediagnosis: () =>
    set({
      photos: { front: null, side: null },
      questionnaireAnswers: {},
      poseScores: null,
      diagnosisResult: null,
      selectedItemIds: [],
      tryOnResults: [],
    }),
}));
