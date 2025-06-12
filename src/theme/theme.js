export const COLORS = {
  primary: "#FF6600",         // Laranja Inter
  primaryDark: "#CC5200",     // Laranja escuro
  primaryLight: "#FFF3E5",    // Laranja bem claro (fundo de inputs, por ex.)
  background: "#FFFFFF",      // Fundo branco
  surface: "#FFFFFF",         // Cartões ou áreas elevadas
  text: "#1C1C1E",            // Texto escuro
  muted: "#A1A1A1",           // Texto auxiliar
  border: "#E0E0E0",          // Bordas leves
  accent: "#FF9933",          // Acento complementar
};

export const theme = {
  dark: false,
  roundness: 10,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    placeholder: COLORS.muted,
    disabled: COLORS.muted,
    onPrimary: COLORS.surface,
    elevation: {
      level0: "transparent",
      level1: COLORS.surface,
    },
  },
};
