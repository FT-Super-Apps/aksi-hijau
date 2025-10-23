/**
 * Badge Component - Atomic Design
 * Small status indicator or label
 * @module components/atoms/Badge
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONT_FAMILIES } from '../../constants/typography';

const Badge = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.badge, styles[variant], styles[size], style]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  // Variants
  primary: {
    backgroundColor: COLORS.PRIMARY,
  },
  secondary: {
    backgroundColor: '#F0FBF5',
    borderWidth: 1,
    borderColor: '#7DB39A',
  },
  success: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  warning: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  error: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  neutral: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Sizes
  small: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  // Text
  text: {
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    letterSpacing: 0.1,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  secondaryText: {
    color: COLORS.PRIMARY,
    fontSize: 11,
  },
  successText: {
    color: '#059669',
    fontSize: 11,
  },
  warningText: {
    color: '#D97706',
    fontSize: 11,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
  },
  neutralText: {
    color: '#4B5563',
    fontSize: 11,
  },

  // Text Sizes
  smallText: {
    fontSize: 9,
  },
  mediumText: {
    fontSize: 11,
  },
  largeText: {
    fontSize: 13,
  },

  // Icon
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
});

export default Badge;
