/**
 * Main Theme Configuration
 * Combines all design tokens into a cohesive theme system
 */

import { COLORS, GRADIENT_COLORS } from '../constants/colors';
import { TEXT_STYLES, FONT_FAMILIES } from '../constants/typography';
import { SPACING, BORDER_RADIUS, SHADOWS, DIMENSIONS } from '../constants/spacing';

export const theme = {
  // Colors
  colors: COLORS,
  gradients: GRADIENT_COLORS,

  // Typography
  typography: TEXT_STYLES,
  fonts: FONT_FAMILIES,

  // Layout
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  dimensions: DIMENSIONS,

  // Component specific themes
  components: {
    button: {
      primary: {
        backgroundColor: COLORS.PRIMARY,
        textColor: COLORS.TEXT_ON_PRIMARY,
        borderRadius: BORDER_RADIUS.BUTTON,
        paddingHorizontal: SPACING.COMPONENT.BUTTON_PADDING_HORIZONTAL,
        paddingVertical: SPACING.COMPONENT.BUTTON_PADDING_VERTICAL,
        shadow: SHADOWS.SMALL,
      },
      secondary: {
        backgroundColor: COLORS.GRAY_100,
        textColor: COLORS.TEXT_PRIMARY,
        borderRadius: BORDER_RADIUS.BUTTON,
        paddingHorizontal: SPACING.COMPONENT.BUTTON_PADDING_HORIZONTAL,
        paddingVertical: SPACING.COMPONENT.BUTTON_PADDING_VERTICAL,
        shadow: SHADOWS.NONE,
      },
      outline: {
        backgroundColor: 'transparent',
        textColor: COLORS.PRIMARY,
        borderColor: COLORS.PRIMARY,
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.BUTTON,
        paddingHorizontal: SPACING.COMPONENT.BUTTON_PADDING_HORIZONTAL,
        paddingVertical: SPACING.COMPONENT.BUTTON_PADDING_VERTICAL,
        shadow: SHADOWS.NONE,
      },
      ghost: {
        backgroundColor: 'transparent',
        textColor: COLORS.PRIMARY,
        borderRadius: BORDER_RADIUS.BUTTON,
        paddingHorizontal: SPACING.COMPONENT.BUTTON_PADDING_HORIZONTAL,
        paddingVertical: SPACING.COMPONENT.BUTTON_PADDING_VERTICAL,
        shadow: SHADOWS.NONE,
      },
    },
    card: {
      default: {
        backgroundColor: COLORS.SURFACE,
        borderRadius: BORDER_RADIUS.CARD,
        padding: SPACING.COMPONENT.CARD_PADDING,
        shadow: SHADOWS.SMALL,
        borderColor: COLORS.BORDER,
        borderWidth: 1,
      },
      elevated: {
        backgroundColor: COLORS.SURFACE,
        borderRadius: BORDER_RADIUS.CARD,
        padding: SPACING.COMPONENT.CARD_PADDING,
        shadow: SHADOWS.MEDIUM,
      },
    },
    input: {
      default: {
        backgroundColor: COLORS.SURFACE,
        borderColor: COLORS.BORDER,
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.INPUT,
        paddingHorizontal: SPACING.LG,
        paddingVertical: SPACING.MD,
        height: DIMENSIONS.COMPONENT_HEIGHT.INPUT,
      },
      focused: {
        borderColor: COLORS.PRIMARY,
        borderWidth: 2,
      },
      error: {
        borderColor: COLORS.ERROR,
        borderWidth: 1,
      },
    },
  },
};

export default theme;
