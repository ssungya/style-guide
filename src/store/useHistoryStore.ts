import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HistoryEntry } from "../types";

interface HistoryState {
  entries: HistoryEntry[];
  addEntry: (entry: HistoryEntry) => void;
  clear: () => void;
}

// 개인정보 보호를 위해 사진 등 원본 이미지는 저장하지 않고
// 진단 타입/신뢰도/일시만 기록에 남긴다 (PRD 6.2 참고).
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({ entries: [entry, ...state.entries].slice(0, 20) })),
      clear: () => set({ entries: [] }),
    }),
    { name: "bodyline-history" },
  ),
);
