import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FontScale } from "../types";

interface SettingsState {
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontScale: "base",
      setFontScale: (scale) => set({ fontScale: scale }),
      highContrast: false,
      setHighContrast: (value) => set({ highContrast: value }),
    }),
    { name: "bodyline-settings" },
  ),
);
