/**
 * GlassCard - Modern glassmorphism card component
 * @module components/atoms/GlassCard
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

const GlassCard = ({
  children,
  variant = 'light', // light, medium, dark, primary, accent
  blur = true,
  padding = 'md',
  borderRadius = 20,
  style,
  gradientColors,
  glowColor,
  ...props
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'light':
        return COLORS.GLASS_WHITE_ULTRA;
      case 'medium':
        return COLORS.GLASS_WHITE;
      case 'dark':
        return COLORS.GLASS_DARK;
      case 'primary':
        return COLORS.GLASS_PRIMARY;
      case 'accent':
        return COLORS.GLASS_ACCENT;
      case 'transparent':
        return 'transparent';
      default:
        return COLORS.GLASS_WHITE;
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'dark':
        return 'rgba(255,255,255,0.1)';
      case 'primary':
        return COLORS.PRIMARY + '30';
      case 'accent':
        return COLORS.ACCENT + '30';
      default:
        return COLORS.GLASS_BORDER;
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'xs':
        return SPACING.PADDING.XS;
      case 'sm':
        return SPACING.PADDING.SM;
      case 'md':
        return SPACING.PADDING.MD;
      case 'lg':
        return SPACING.PADDING.LG;
      case 'xl':
        return SPACING.PADDING.XL;
      default:
        return SPACING.PADDING.MD;
    }
  };

  const getShadow = () => {
    if (glowColor) {
      return {
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
      };
    }
    return variant === 'dark' ? {} : SHADOWS.MEDIUM;
  };

  const cardStyles = [
    styles.card,
    {
      backgroundColor: getBackgroundColor(),
      borderRadius,
      borderWidth: 1,
      borderColor: getBorderColor(),
      padding: getPadding(),
    },
    getShadow(),
    style,
  ];

  if (gradientColors) {
    return (
      <View style={[styles.wrapper, { borderRadius }, getShadow(), style]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            {
              borderRadius,
              padding: getPadding(),
              borderWidth: 1,
              borderColor: getBorderColor(),
            },
          ]}
          {...props}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  card: {
    overflow: 'hidden',
  },
  gradient: {
    overflow: 'hidden',
  },
});

export default GlassCard;

