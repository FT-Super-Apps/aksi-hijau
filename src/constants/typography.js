/**
 * Typography System - Aksi Hijau Design System
 * Based on Figma design specifications
 * Fonts: Sora (headings), Kulim Park (body text)
 */

// Font Families (sesuai Figma design dan expo-google-fonts)
export const FONT_FAMILIES = {
  // Primary font for headings and important text
  SORA: {
    REGULAR: 'Sora_400Regular',
    SEMIBOLD: 'Sora_600SemiBold',
    BOLD: 'Sora_700Bold',
  },

  // Secondary font for body text
  KULIM_PARK: {
    REGULAR: 'KulimPark_400Regular',
    SEMIBOLD: 'KulimPark_600SemiBold',
    BOLD: 'KulimPark_700Bold',
  },

  // System fallback
  SYSTEM: 'System',
};

// Font Sizes (sesuai Figma specifications)
export const FONT_SIZES = {
  // Display sizes
  DISPLAY_LARGE: 57,
  DISPLAY_MEDIUM: 45,
  DISPLAY_SMALL: 36,

  // Headline sizes
  HEADLINE_LARGE: 32,
  HEADLINE_MEDIUM: 28,
  HEADLINE_SMALL: 24,

  // Title sizes
  TITLE_LARGE: 22,
  TITLE_MEDIUM: 16,
  TITLE_SMALL: 14,

  // Label sizes
  LABEL_LARGE: 14,
  LABEL_MEDIUM: 12,
  LABEL_SMALL: 11,

  // Body sizes
  BODY_LARGE: 16,
  BODY_MEDIUM: 14,
  BODY_SMALL: 12,

  // Caption
  CAPTION: 10,
};

// Line Heights
export const LINE_HEIGHTS = {
  TIGHT: 1.1,
  NORMAL: 1.25,
  RELAXED: 1.4,
  LOOSE: 1.6,
};

// Font Weights
export const FONT_WEIGHTS = {
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
};

// Typography Styles (Ready-to-use styles sesuai Figma)
export const TYPOGRAPHY = {
  // Display styles (Sora Bold)
  DISPLAY_LARGE: {
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    fontSize: FONT_SIZES.DISPLAY_LARGE,
    fontWeight: FONT_WEIGHTS.BOLD,
    lineHeight: FONT_SIZES.DISPLAY_LARGE * LINE_HEIGHTS.TIGHT,
  },

  DISPLAY_MEDIUM: {
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    fontSize: FONT_SIZES.DISPLAY_MEDIUM,
    fontWeight: FONT_WEIGHTS.BOLD,
    lineHeight: FONT_SIZES.DISPLAY_MEDIUM * LINE_HEIGHTS.TIGHT,
  },

  DISPLAY_SMALL: {
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    fontSize: FONT_SIZES.DISPLAY_SMALL,
    fontWeight: FONT_WEIGHTS.BOLD,
    lineHeight: FONT_SIZES.DISPLAY_SMALL * LINE_HEIGHTS.TIGHT,
  },

  // Headline styles (Sora Bold) - untuk hero title
  HEADLINE_LARGE: {
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    fontSize: FONT_SIZES.HEADLINE_LARGE,
    fontWeight: FONT_WEIGHTS.BOLD,
    lineHeight: FONT_SIZES.HEADLINE_LARGE * LINE_HEIGHTS.NORMAL,
  },

  HEADLINE_MEDIUM: {
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    fontSize: FONT_SIZES.HEADLINE_MEDIUM,
    fontWeight: FONT_WEIGHTS.BOLD,
    lineHeight: FONT_SIZES.HEADLINE_MEDIUM * LINE_HEIGHTS.NORMAL,
  },

  HEADLINE_SMALL: {
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    fontSize: FONT_SIZES.HEADLINE_SMALL,
    fontWeight: FONT_WEIGHTS.BOLD,
    lineHeight: FONT_SIZES.HEADLINE_SMALL * LINE_HEIGHTS.NORMAL,
  },

  // Title styles (Sora SemiBold)
  TITLE_LARGE: {
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    fontSize: FONT_SIZES.TITLE_LARGE,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    lineHeight: FONT_SIZES.TITLE_LARGE * LINE_HEIGHTS.NORMAL,
  },

  TITLE_MEDIUM: {
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    fontSize: FONT_SIZES.TITLE_MEDIUM,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    lineHeight: FONT_SIZES.TITLE_MEDIUM * LINE_HEIGHTS.NORMAL,
  },

  TITLE_SMALL: {
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    fontSize: FONT_SIZES.TITLE_SMALL,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    lineHeight: FONT_SIZES.TITLE_SMALL * LINE_HEIGHTS.NORMAL,
  },

  // Label styles (Kulim Park SemiBold)
  LABEL_LARGE: {
    fontFamily: FONT_FAMILIES.KULIM_PARK.SEMIBOLD,
    fontSize: FONT_SIZES.LABEL_LARGE,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    lineHeight: FONT_SIZES.LABEL_LARGE * LINE_HEIGHTS.NORMAL,
  },

  LABEL_MEDIUM: {
    fontFamily: FONT_FAMILIES.KULIM_PARK.SEMIBOLD,
    fontSize: FONT_SIZES.LABEL_MEDIUM,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    lineHeight: FONT_SIZES.LABEL_MEDIUM * LINE_HEIGHTS.NORMAL,
  },

  LABEL_SMALL: {
    fontFamily: FONT_FAMILIES.KULIM_PARK.SEMIBOLD,
    fontSize: FONT_SIZES.LABEL_SMALL,
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
    lineHeight: FONT_SIZES.LABEL_SMALL * LINE_HEIGHTS.NORMAL,
  },

  // Body styles (Kulim Park Regular) - untuk body text
  BODY_LARGE: {
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: FONT_SIZES.BODY_LARGE * LINE_HEIGHTS.RELAXED,
  },

  BODY_MEDIUM: {
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    fontSize: FONT_SIZES.BODY_MEDIUM,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: FONT_SIZES.BODY_MEDIUM * LINE_HEIGHTS.RELAXED,
  },

  BODY_SMALL: {
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    fontSize: FONT_SIZES.BODY_SMALL,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: FONT_SIZES.BODY_SMALL * LINE_HEIGHTS.RELAXED,
  },

  // Caption style (Kulim Park Regular)
  CAPTION: {
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    fontSize: FONT_SIZES.CAPTION,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: FONT_SIZES.CAPTION * LINE_HEIGHTS.NORMAL,
  },

  // Button styles (Kulim Park Regular) - sesuai Figma
  BUTTON_LARGE: {
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    fontSize: FONT_SIZES.LABEL_LARGE,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: FONT_SIZES.LABEL_LARGE * LINE_HEIGHTS.NORMAL,
  },

  BUTTON_MEDIUM: {
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    fontSize: FONT_SIZES.LABEL_MEDIUM,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: FONT_SIZES.LABEL_MEDIUM * LINE_HEIGHTS.NORMAL,
  },

  BUTTON_SMALL: {
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    fontSize: FONT_SIZES.LABEL_SMALL,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: FONT_SIZES.LABEL_SMALL * LINE_HEIGHTS.NORMAL,
  },
};

// Export default
export default TYPOGRAPHY;
