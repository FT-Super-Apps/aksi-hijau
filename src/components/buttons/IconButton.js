import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { theme } from '../../theme';

/**
 * Icon Button Component
 * A circular button with just an icon
 */
const IconButton = ({
  icon: IconComponent,
  onPress,
  size = 'medium', // small, medium, large
  variant = 'primary', // primary, secondary, outline, ghost
  disabled = false,
  loading = false,
  style,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = getVariantStyle();
    const sizeStyle = getSizeStyle();

    return [
      styles.button,
      baseStyle,
      sizeStyle,
      disabled && styles.disabled,
      style,
    ];
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.GRAY_100,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.PRIMARY,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: theme.colors.PRIMARY,
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          width: theme.dimensions.ICON.LG,
          height: theme.dimensions.ICON.LG,
          borderRadius: theme.dimensions.ICON.LG / 2,
        };
      case 'large':
        return {
          width: theme.dimensions.ICON.XXXL,
          height: theme.dimensions.ICON.XXXL,
          borderRadius: theme.dimensions.ICON.XXXL / 2,
        };
      default:
        return {
          width: theme.dimensions.ICON.XL,
          height: theme.dimensions.ICON.XL,
          borderRadius: theme.dimensions.ICON.XL / 2,
        };
    }
  };

  const getIconColor = () => {
    if (disabled) return theme.colors.TEXT_DISABLED;

    switch (variant) {
      case 'secondary':
        return theme.colors.TEXT_PRIMARY;
      case 'outline':
      case 'ghost':
        return theme.colors.PRIMARY;
      default:
        return theme.colors.TEXT_ON_PRIMARY;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getIconColor()}
        />
      ) : (
        IconComponent && <IconComponent color={getIconColor()} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.SMALL,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default IconButton;
