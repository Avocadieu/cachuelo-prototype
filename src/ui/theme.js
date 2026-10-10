// ─── TEMA ────────────────────────────────────────────────────────────────────
// Los valores de superficie/texto apuntan a CSS variables definidas en
// src/styles/liquid-glass.css (.light-mode / .dark-mode). El valor después de
// la coma es el fallback si la variable no existe.
import { createContext, useContext } from 'react';

export const LIGHT = {
  primary: '#FF6B35', primaryLight: '#FF8C5A', primaryDark: '#E55A25',
  headerBg: '#2563EB', headerDark: '#1D4ED8', headerLight: '#3B82F6',
  success: '#10B981', warning: '#F59E0B', danger: '#EF4444', purple: '#8B5CF6',
  bg: 'var(--c-bg,#EEF2FB)', card: 'var(--c-card,#FFFFFF)',
  cardElevated: 'var(--c-card-el,#F8FAFF)',
  text: 'var(--c-text,#0D1B3E)', textSec: 'var(--c-tsec,#45537A)',
  textMuted: 'var(--c-tmut,#7C86A6)', border: 'var(--c-bord,#DDE3F5)',
  // Superficies semánticas que funcionan en claro y oscuro
  dangerSoft: 'rgba(239,68,68,0.12)', successSoft: 'rgba(16,185,129,0.14)', infoSoft: 'rgba(37,99,235,0.10)',
};

export const DARK = {
  primary: '#FF7A47', primaryLight: '#FF9563', primaryDark: '#E86A35',
  headerBg: '#1E40AF', headerDark: '#1E3A8A', headerLight: '#2563EB',
  success: '#34D399', warning: '#FCD34D', danger: '#F87171', purple: '#C4B5FD',
  bg: 'var(--c-bg,#070B16)', card: 'var(--c-card,#1C2438)',
  cardElevated: 'var(--c-card-el,#242E48)',
  text: 'var(--c-text,#F0F4FF)', textSec: 'var(--c-tsec,#AEB9DC)',
  textMuted: 'var(--c-tmut,#76819F)', border: 'var(--c-bord,#2E3C5E)',
  dangerSoft: 'rgba(248,113,113,0.16)', successSoft: 'rgba(52,211,153,0.16)', infoSoft: 'rgba(96,165,250,0.14)',
};

export const ThemeCtx = createContext({ C: LIGHT, isDark: false, toggleDark: () => {} });
export const useTheme = () => useContext(ThemeCtx);
