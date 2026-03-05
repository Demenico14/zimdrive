import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    tint: '#0E8A3E',
    tintLight: '#E8F5ED',
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#0E8A3E',
    border: '#E5E7EB',
    correct: '#16A34A',
    correctBg: '#DCFCE7',
    wrong: '#DC2626',
    wrongBg: '#FEE2E2',
    warning: '#F59E0B',
    warningBg: '#FEF3C7',
    card: '#FFFFFF',
    accent: '#0E8A3E',
    accentLight: '#E8F5ED',
  },
  dark: {
    text: '#F3F4F6',
    textSecondary: '#9CA3AF',
    background: '#111827',
    surface: '#1F2937',
    tint: '#34D669',
    tintLight: '#1A2E23',
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#34D669',
    border: '#374151',
    correct: '#22C55E',
    correctBg: '#14532D',
    wrong: '#EF4444',
    wrongBg: '#7F1D1D',
    warning: '#FBBF24',
    warningBg: '#78350F',
    card: '#1F2937',
    accent: '#34D669',
    accentLight: '#1A2E23',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
