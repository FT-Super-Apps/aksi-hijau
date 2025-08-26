/**
 * Typography Constants
 * Contains font families, sizes, and text styles
 */

export const FONT_FAMILIES = {
  SORA: {
    LIGHT: 'Sora_300Light',
    REGULAR: 'Sora_400Regular',
    MEDIUM: 'Sora_500Medium',
    SEMIBOLD: 'Sora_600SemiBold',
    BOLD: 'Sora_700Bold',
  },
  KULIM_PARK: {
    LIGHT: 'KulimPark_300Light',
    REGULAR: 'KulimPark_400Regular',
    MEDIUM: 'KulimPark_500Medium',
    SEMIBOLD: 'KulimPark_600SemiBold',
    BOLD: 'KulimPark_700Bold',
  },
  SYSTEM: {
    IOS: 'System',
    ANDROID: 'Roboto',
  },
};

export const FONT_SIZES = {
  // Heading Sizes
  H1: 32,
  H2: 28,
  H3: 24,
  H4: 20,
  H5: 18,
  H6: 16,

  // Body Text Sizes
  LARGE: 18,
  MEDIUM: 16,
  REGULAR: 14,
  SMALL: 12,
  TINY: 10,

  // Button Text Sizes
  BUTTON_LARGE: 16,
  BUTTON_MEDIUM: 14,
  BUTTON_SMALL: 12,

  // Caption and Labels
  CAPTION: 11,
  LABEL: 13,
};

export const LINE_HEIGHTS = {
  TIGHT: 1.2,
  NORMAL: 1.4,
  RELAXED: 1.6,
  LOOSE: 1.8,
};

export const LETTER_SPACING = {
  TIGHT: -0.5,
  NORMAL: 0,
  WIDE: 0.5,
  WIDER: 1,
};

export const TEXT_STYLES = {
  // Heading Styles
  H1: {
    fontSize: FONT_SIZES.H1,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    lineHeight: FONT_SIZES.H1 * LINE_HEIGHTS.TIGHT,
    letterSpacing: LETTER_SPACING.TIGHT,
  },
  H2: {
    fontSize: FONT_SIZES.H2,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    lineHeight: FONT_SIZES.H2 * LINE_HEIGHTS.TIGHT,
    letterSpacing: LETTER_SPACING.TIGHT,
  },
  H3: {
    fontSize: FONT_SIZES.H3,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    lineHeight: FONT_SIZES.H3 * LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.NORMAL,
  },
  H4: {
    fontSize: FONT_SIZES.H4,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    lineHeight: FONT_SIZES.H4 * LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.NORMAL,
  },
  H5: {
    fontSize: FONT_SIZES.H5,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    lineHeight: FONT_SIZES.H5 * LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.NORMAL,
  },
  H6: {
    fontSize: FONT_SIZES.H6,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    lineHeight: FONT_SIZES.H6 * LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.NORMAL,
  },

  // Body Text Styles
  BODY_LARGE: {
    fontSize: FONT_SIZES.LARGE,
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    lineHeight: FONT_SIZES.LARGE * LINE_HEIGHTS.RELAXED,
    letterSpacing: LETTER_SPACING.NORMAL,
  },
  BODY_MEDIUM: {
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    lineHeight: FONT_SIZES.MEDIUM * LINE_HEIGHTS.RELAXED,
    letterSpacing: LETTER_SPACING.NORMAL,
  },
  BODY_REGULAR: {
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    lineHeight: FONT_SIZES.REGULAR * LINE_HEIGHTS.RELAXED,
    letterSpacing: LETTER_SPACING.NORMAL,
  },
  BODY_SMALL: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    lineHeight: FONT_SIZES.SMALL * LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.NORMAL,
  },

  // Button Text Styles
  BUTTON_LARGE: {
    fontSize: FONT_SIZES.BUTTON_LARGE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    lineHeight: FONT_SIZES.BUTTON_LARGE * LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.WIDE,
  },
  BUTTON_MEDIUM: {
    fontSize: FONT_SIZES.BUTTON_MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    lineHeight: FONT_SIZES.BUTTON_MEDIUM * LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.WIDE,
  },
  BUTTON_SMALL: {
    fontSize: FONT_SIZES.BUTTON_SMALL,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    lineHeight: FONT_SIZES.BUTTON_SMALL * LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.WIDE,
  },

  // Caption and Label Styles
  CAPTION: {
    fontSize: FONT_SIZES.CAPTION,
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    lineHeight: FONT_SIZES.CAPTION * LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.NORMAL,
  },
  LABEL: {
    fontSize: FONT_SIZES.LABEL,
    fontFamily: FONT_FAMILIES.KULIM_PARK.MEDIUM,
    lineHeight: FONT_SIZES.LABEL * LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.NORMAL,
  },
};
