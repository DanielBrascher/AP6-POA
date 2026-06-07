// src/styles/theme.js
export const COLORS = {
  background: '#000000',      // preto puro
  surface: '#0A0A0A',        // preto levemente mais claro para cards
  primary: '#007AFF',        // azul principal (iOS blue)
  primaryDark: '#0055CC',    // azul escuro para hover/pressionado
  primaryLight: '#4DA3FF',   // azul claro para detalhes
  text: '#FFFFFF',           // branco
  textSecondary: '#8E8E93',  // cinza para subtítulos
  border: '#1C1C1E',         // borda sutil
  error: '#FF3B30',          // vermelho para erros
  success: '#34C759',        // verde para sucessos
};

export const TYPOGRAPHY = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 41,
  },
  title1: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 34,
  },
  title2: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  body: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 21,
  },
  subhead: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
};