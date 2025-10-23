/**
 * Button Component - Atomic Design
 * Reusable button component with consistent styling
 * @module components/atoms/Button
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES } from '../../constants/typography';

/**
 * Button Variants
 * - primary: Solid green button (default)
 * - secondary: Outlined button
 * - ghost: Text-only button
 * - gradient: Gradient background button
 */

const Button = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'right',
  style,
  textStyle,
  ...props
}) => {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'gradient' ? '#FFFFFF' : COLORS.PRIMARY}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <Text style={styles.icon}>{icon}</Text>}
          <Text style={textStyles}>{children}</Text>
          {icon && iconPosition === 'right' && <Text style={styles.icon}>{icon}</Text>}
        </>
      )}
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.button, styles[size], fullWidth && styles.fullWidth, style]}
        {...props}
      >
        <LinearGradient
          colors={disabled ? [COLORS.GRAY_300, COLORS.GRAY_400] : [COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={buttonStyles}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    overflow: 'hidden',
  },

  // Variants
  primary: {
    backgroundColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  gradient: {
    overflow: 'hidden',
  },

  // Sizes
  small: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },

  // States
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  fullWidth: {
    width: '100%',
  },

  // Text Styles
  buttonText: {
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    letterSpacing: 0.2,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  secondaryText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
  },
  ghostText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
  },
  gradientText: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  // Text Sizes
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },

  disabledText: {
    opacity: 0.7,
  },

  // Icon
  icon: {
    fontSize: 16,
    marginHorizontal: 6,
  },

  // Gradient
  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
