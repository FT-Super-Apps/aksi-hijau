/**
 * Spacing Constants
 * Contains standardized spacing values for consistent layout
 */

export const SPACING = {
  // Base spacing unit (4px)
  BASE: 4,

  // Specific spacing values
  XS: 4,    // 4px
  SM: 8,    // 8px
  MD: 12,   // 12px
  LG: 16,   // 16px
  XL: 20,   // 20px
  XXL: 24,  // 24px
  XXXL: 32, // 32px

  // Margin values
  MARGIN: {
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 20,
    XXL: 24,
    XXXL: 32,
    LARGE: 40,
    XLARGE: 48,
  },

  // Padding values
  PADDING: {
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 20,
    XXL: 24,
    XXXL: 32,
    LARGE: 40,
    XLARGE: 48,
  },

  // Component specific spacing
  COMPONENT: {
    BUTTON_PADDING_HORIZONTAL: 16,
    BUTTON_PADDING_VERTICAL: 12,
    CARD_PADDING: 16,
    SECTION_SPACING: 24,
    SCREEN_PADDING: 16,
    HEADER_PADDING: 12,
    TAB_BAR_PADDING: 8,
  },
};

export const BORDER_RADIUS = {
  NONE: 0,
  XS: 2,
  SM: 4,
  MD: 6,
  LG: 8,
  XL: 12,
  XXL: 16,
  ROUND: 50,
  CIRCLE: 9999,

  // Component specific
  BUTTON: 8,
  CARD: 12,
  INPUT: 6,
  MODAL: 16,
  IMAGE: 8,
};

export const BORDER_WIDTH = {
  NONE: 0,
  THIN: 0.5,
  REGULAR: 1,
  THICK: 2,
  EXTRA_THICK: 3,
};

export const SHADOWS = {
  NONE: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  SMALL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  EXTRA_LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const DIMENSIONS = {
  // Screen breakpoints
  SCREEN: {
    SMALL: 320,
    MEDIUM: 768,
    LARGE: 1024,
  },

  // Component heights
  COMPONENT_HEIGHT: {
    BUTTON_SMALL: 32,
    BUTTON_MEDIUM: 40,
    BUTTON_LARGE: 48,
    INPUT: 44,
    TAB_BAR: 60,
    HEADER: 56,
    CARD_MIN: 100,
  },

  // Icon sizes
  ICON: {
    XS: 12,
    SM: 16,
    MD: 20,
    LG: 24,
    XL: 32,
    XXL: 40,
    XXXL: 48,
  },
};

export default SPACING;
