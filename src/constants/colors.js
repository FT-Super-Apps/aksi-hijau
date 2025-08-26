/**
 * Application Color Palette - EcoUnity Design System
 * Based on Figma design variables
 * Contains all the colors used throughout the app
 */

export const COLORS = {
  // Primary Colors (from Figma: Green #549B79, Dark Green #1F5F5B)
  PRIMARY: '#549B79',
  PRIMARY_DARK: '#1F5F5B',
  PRIMARY_LIGHT: '#7DB39A',

  // Secondary Colors (variations of green theme)
  SECONDARY: '#6BA888',
  SECONDARY_DARK: '#2E7D5B',
  SECONDARY_LIGHT: '#8BC4A2',

  // Accent Colors (complementary to green)
  ACCENT: '#FF9500',
  ACCENT_DARK: '#CC7700',
  ACCENT_LIGHT: '#FFB84D',

  // Neutral Colors (from Figma: Black #292B2D, White #F5F5F5)
  WHITE: '#F5F5F5',
  BLACK: '#292B2D',
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',

  // Status Colors
  SUCCESS: '#549B79', // Using primary green for success
  SUCCESS_LIGHT: '#7DB39A',
  WARNING: '#F59E0B',
  WARNING_LIGHT: '#FCD34D',
  ERROR: '#EF4444',
  ERROR_LIGHT: '#FCA5A5',
  INFO: '#3B82F6',
  INFO_LIGHT: '#93C5FD',

  // Background Colors (eco-friendly light green tones)
  BACKGROUND: '#F8FDF8',
  SURFACE: '#FFFFFF',
  OVERLAY: 'rgba(0, 0, 0, 0.5)',

  // Text Colors (using Figma colors)
  TEXT_PRIMARY: '#292B2D', // From Figma Black
  TEXT_SECONDARY: '#6B7280',
  TEXT_DISABLED: '#9CA3AF',
  TEXT_ON_PRIMARY: '#F5F5F5', // From Figma White
  TEXT_ON_DARK: '#F5F5F5',

  // Border Colors
  BORDER: '#E5E7EB',
  BORDER_LIGHT: '#F3F4F6',
  BORDER_DARK: '#D1D5DB',

  // Shadow Colors
  SHADOW: 'rgba(84, 155, 121, 0.1)', // Green-tinted shadow
  SHADOW_DARK: 'rgba(84, 155, 121, 0.2)',
};

export const GRADIENT_COLORS = {
  PRIMARY: ['#549B79', '#1F5F5B'], // Green gradient from Figma
  SECONDARY: ['#6BA888', '#2E7D5B'],
  ACCENT: ['#FF9500', '#CC7700'],
  SUCCESS: ['#549B79', '#1F5F5B'],
  WARNING: ['#F59E0B', '#D97706'],
  ERROR: ['#EF4444', '#DC2626'],
  ECO_BACKGROUND: ['#F8FDF8', '#E8F8E8', '#D8F3D8'], // Eco-friendly background gradient
};

export default COLORS;
