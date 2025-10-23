/**
 * IconButton Component - Atomic Design
 * Circular button with icon only
 * @module components/atoms/IconButton
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

const IconButton = ({
  icon,
  onPress,
  variant = 'default',
  size = 'medium',
  disabled = false,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <Text style={[styles.icon, styles[`${size}Icon`]]}>{icon}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },

  // Variants
  default: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primary: {
    backgroundColor: COLORS.PRIMARY + '10',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '20',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY,
  },
  ghost: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  // Sizes
  small: {
    width: 32,
    height: 32,
  },
  medium: {
    width: 44,
    height: 44,
  },
  large: {
    width: 56,
    height: 56,
  },

  // Icon Sizes
  smallIcon: {
    fontSize: 16,
  },
  mediumIcon: {
    fontSize: 20,
  },
  largeIcon: {
    fontSize: 24,
  },

  // States
  disabled: {
    opacity: 0.5,
  },

  icon: {
    textAlign: 'center',
  },
});

export default IconButton;
