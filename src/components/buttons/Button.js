import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';

/**
 * Primary Button Component
 * A reusable button component with various variants and states
 */
const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  gradient = false,
  gradientColors,
  icon: IconComponent,
  iconPosition = 'left', // left, right
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = theme.components.button[variant] || theme.components.button.primary;
    const sizeStyle = getSizeStyle();

    return [
      styles.button,
      baseStyle,
      sizeStyle,
      disabled && styles.disabled,
      style,
    ];
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          height: theme.dimensions.COMPONENT_HEIGHT.BUTTON_SMALL,
          paddingHorizontal: theme.spacing.MD,
          paddingVertical: theme.spacing.XS,
        };
      case 'large':
        return {
          height: theme.dimensions.COMPONENT_HEIGHT.BUTTON_LARGE,
          paddingHorizontal: theme.spacing.XL,
          paddingVertical: theme.spacing.LG,
        };
      default:
        return {
          height: theme.dimensions.COMPONENT_HEIGHT.BUTTON_MEDIUM,
          paddingHorizontal: theme.spacing.LG,
          paddingVertical: theme.spacing.MD,
        };
    }
  };

  const getTextStyle = () => {
    const baseTextColor = theme.components.button[variant]?.textColor || theme.colors.TEXT_ON_PRIMARY;
    const sizeTextStyle = getTextSizeStyle();

    return [
      styles.text,
      sizeTextStyle,
      { color: disabled ? theme.colors.TEXT_DISABLED : baseTextColor },
      textStyle,
    ];
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return theme.typography.BUTTON_SMALL;
      case 'large':
        return theme.typography.BUTTON_LARGE;
      default:
        return theme.typography.BUTTON_MEDIUM;
    }
  };

  const renderContent = () => (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={theme.components.button[variant]?.textColor || theme.colors.TEXT_ON_PRIMARY}
        />
      ) : (
        <>
          {IconComponent && iconPosition === 'left' && (
            <View style={styles.iconLeft}>
              <IconComponent />
            </View>
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {IconComponent && iconPosition === 'right' && (
            <View style={styles.iconRight}>
              <IconComponent />
            </View>
          )}
        </>
      )}
    </View>
  );

  if (gradient && (gradientColors || theme.gradients.PRIMARY)) {
    const colors = gradientColors || theme.gradients.PRIMARY;
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyle(), { backgroundColor: 'transparent' }]}
        {...props}
      >
        <LinearGradient
          colors={colors}
          style={styles.gradient}
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
      style={getButtonStyle()}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.BUTTON,
  },
  disabled: {
    opacity: 0.6,
  },
  iconLeft: {
    marginRight: theme.spacing.SM,
  },
  iconRight: {
    marginLeft: theme.spacing.SM,
  },
});

export default Button;
