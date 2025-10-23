/**
 * Card Component - Atomic Design
 * Reusable card component with consistent styling
 * @module components/atoms/Card
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

const Card = ({
  children,
  variant = 'default',
  onPress,
  active = false,
  disabled = false,
  style,
  ...props
}) => {
  const cardStyles = [
    styles.card,
    styles[variant],
    active && styles.active,
    disabled && styles.disabled,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={cardStyles}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
  },

  // Variants
  default: {
    // Default styling already applied
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(84, 155, 121, 0.12)',
  },

  // States
  active: {
    borderColor: '#7DB39A',
    backgroundColor: '#F0FBF5',
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Card;
