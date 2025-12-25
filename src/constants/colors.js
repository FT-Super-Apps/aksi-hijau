/**
 * Application Color Palette - EcoUnity Design System
 * Modern glassmorphism-inspired design with organic nature tones
 */

export const COLORS = {
  // Primary Colors - Rich forest greens
  PRIMARY: '#549B79',
  PRIMARY_DARK: '#1F5F5B',
  PRIMARY_LIGHT: '#7DB39A',
  PRIMARY_SOFT: '#A8D5BA',

  // Secondary Colors - Deep ocean teal
  SECONDARY: '#2D8B7A',
  SECONDARY_DARK: '#1A5C50',
  SECONDARY_LIGHT: '#5AAFA0',

  // Accent Colors - Warm sunset orange
  ACCENT: '#FF9500',
  ACCENT_DARK: '#CC7700',
  ACCENT_LIGHT: '#FFB84D',
  ACCENT_SOFT: '#FFD699',

  // Tertiary - Nature inspired
  EARTH: '#8B7355',
  EARTH_LIGHT: '#C4A77D',
  SKY: '#87CEEB',
  SKY_DARK: '#5BA3C6',
  LEAF: '#90EE90',
  CORAL: '#FF7F7F',

  // Neutral Colors
  WHITE: '#FFFFFF',
  WHITE_SOFT: '#F8FAFC',
  BLACK: '#0F172A',
  BLACK_SOFT: '#1E293B',
  
  // Gray Scale - Cooler tones
  GRAY_50: '#F8FAFC',
  GRAY_100: '#F1F5F9',
  GRAY_200: '#E2E8F0',
  GRAY_300: '#CBD5E1',
  GRAY_400: '#94A3B8',
  GRAY_500: '#64748B',
  GRAY_600: '#475569',
  GRAY_700: '#334155',
  GRAY_800: '#1E293B',
  GRAY_900: '#0F172A',

  // Status Colors
  SUCCESS: '#10B981',
  SUCCESS_LIGHT: '#34D399',
  SUCCESS_SOFT: '#D1FAE5',
  WARNING: '#F59E0B',
  WARNING_LIGHT: '#FBBF24',
  WARNING_SOFT: '#FEF3C7',
  WARNING_DARK: '#D97706',
  ERROR: '#EF4444',
  ERROR_LIGHT: '#F87171',
  ERROR_SOFT: '#FEE2E2',
  INFO: '#3B82F6',
  INFO_LIGHT: '#60A5FA',
  INFO_SOFT: '#DBEAFE',

  // Background Colors - Soft eco tones
  BACKGROUND: '#F0FDF4',
  BACKGROUND_SECONDARY: '#ECFDF5',
  SURFACE: '#FFFFFF',
  SURFACE_ELEVATED: '#FFFFFF',
  OVERLAY: 'rgba(15, 23, 42, 0.6)',
  OVERLAY_LIGHT: 'rgba(15, 23, 42, 0.3)',

  // Glassmorphism Colors
  GLASS_WHITE: 'rgba(255, 255, 255, 0.85)',
  GLASS_WHITE_LIGHT: 'rgba(255, 255, 255, 0.6)',
  GLASS_WHITE_ULTRA: 'rgba(255, 255, 255, 0.95)',
  GLASS_DARK: 'rgba(15, 23, 42, 0.7)',
  GLASS_PRIMARY: 'rgba(84, 155, 121, 0.15)',
  GLASS_PRIMARY_MEDIUM: 'rgba(84, 155, 121, 0.25)',
  GLASS_ACCENT: 'rgba(255, 149, 0, 0.15)',
  GLASS_BORDER: 'rgba(255, 255, 255, 0.3)',
  GLASS_BORDER_LIGHT: 'rgba(255, 255, 255, 0.18)',

  // Text Colors
  TEXT_PRIMARY: '#0F172A',
  TEXT_SECONDARY: '#475569',
  TEXT_TERTIARY: '#64748B',
  TEXT_DISABLED: '#94A3B8',
  TEXT_ON_PRIMARY: '#FFFFFF',
  TEXT_ON_DARK: '#F8FAFC',
  TEXT_LINK: '#3B82F6',

  // Border Colors
  BORDER: '#E2E8F0',
  BORDER_LIGHT: '#F1F5F9',
  BORDER_DARK: '#CBD5E1',
  BORDER_FOCUS: '#549B79',

  // Shadow Colors
  SHADOW: 'rgba(15, 23, 42, 0.08)',
  SHADOW_MEDIUM: 'rgba(15, 23, 42, 0.12)',
  SHADOW_DARK: 'rgba(15, 23, 42, 0.18)',
  SHADOW_PRIMARY: 'rgba(84, 155, 121, 0.25)',
  SHADOW_ACCENT: 'rgba(255, 149, 0, 0.25)',
  SHADOW_COLORED: 'rgba(84, 155, 121, 0.15)',
};

export const GRADIENT_COLORS = {
  // Primary Gradients
  PRIMARY: ['#549B79', '#1F5F5B'],
  PRIMARY_SOFT: ['#7DB39A', '#549B79'],
  PRIMARY_VIBRANT: ['#34D399', '#059669'],
  
  // Nature Inspired
  FOREST: ['#549B79', '#2D5A4A', '#1A3D32'],
  OCEAN: ['#2D8B7A', '#1F5F5B', '#0F3D35'],
  SUNRISE: ['#FFB84D', '#FF9500', '#E67E00'],
  SUNSET: ['#FF9500', '#FF6B6B', '#FF4757'],
  EARTH: ['#C4A77D', '#8B7355', '#5D4E37'],
  SKY: ['#87CEEB', '#5BA3C6', '#3B82F6'],
  
  // UI Gradients
  CARD_LIGHT: ['#FFFFFF', '#F8FAFC'],
  CARD_GLASS: ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'],
  HEADER: ['#549B79', '#3D7A5F', '#1F5F5B'],
  HEADER_VIBRANT: ['#34D399', '#10B981', '#059669'],
  
  // Status Gradients
  SUCCESS: ['#34D399', '#10B981'],
  WARNING: ['#FBBF24', '#F59E0B'],
  ERROR: ['#F87171', '#EF4444'],
  INFO: ['#60A5FA', '#3B82F6'],
  
  // Special Effects
  SHIMMER: ['transparent', 'rgba(255,255,255,0.4)', 'transparent'],
  GLOW_PRIMARY: ['rgba(84,155,121,0)', 'rgba(84,155,121,0.3)', 'rgba(84,155,121,0)'],
  GLOW_ACCENT: ['rgba(255,149,0,0)', 'rgba(255,149,0,0.3)', 'rgba(255,149,0,0)'],
  
  // Background
  ECO_BACKGROUND: ['#F0FDF4', '#ECFDF5', '#D1FAE5'],
  MESH_1: ['#D1FAE5', '#A7F3D0', '#6EE7B7'],
  MESH_2: ['#FEF3C7', '#FDE68A', '#FCD34D'],
};

// Shadow presets for consistent elevation
export const SHADOWS = {
  SMALL: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  MEDIUM: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  LARGE: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  EXTRA_LARGE: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  GLOW_PRIMARY: {
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  GLOW_ACCENT: {
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  INNER: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 0,
  },
};

// Glass effect presets
export const GLASS = {
  LIGHT: {
    backgroundColor: COLORS.GLASS_WHITE,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  MEDIUM: {
    backgroundColor: COLORS.GLASS_WHITE_LIGHT,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER_LIGHT,
  },
  DARK: {
    backgroundColor: COLORS.GLASS_DARK,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  PRIMARY: {
    backgroundColor: COLORS.GLASS_PRIMARY,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '30',
  },
};

export default COLORS;
