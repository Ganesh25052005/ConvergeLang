import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("ConvergeLang-theme") || "night",
    setTheme: (theme) => {
        localStorage.setItem("ConvergeLang-theme", theme);
        set({ theme });
    },
}));