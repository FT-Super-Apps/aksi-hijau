import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { theme } from '../../theme';

/**
 * Floating Action Button Component
 * A circular floating button typically used for primary actions
 */
const FloatingActionButton = ({
  icon: IconComponent,
  onPress,
  size = 'medium', // small, medium, large
  disabled = false,
  style,
  ...props
}) => {
  const getButtonStyle = () => {
    const sizeStyle = getSizeStyle();

    return [
      styles.button,
      sizeStyle,
      disabled && styles.disabled,
      style,
    ];
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          width: 40,
          height: 40,
        };
      case 'large':
        return {
          width: 64,
          height: 64,
        };
      default:
        return {
          width: 56,
          height: 56,
        };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={getButtonStyle()}
      activeOpacity={0.8}
      {...props}
    >
      {IconComponent && (
        <IconComponent
          color={theme.colors.TEXT_ON_PRIMARY}
          size={size === 'small' ? 20 : size === 'large' ? 32 : 24}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.PRIMARY,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.LARGE,
    elevation: 6,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: theme.colors.GRAY_400,
  },
});

export default FloatingActionButton;
