/**
 * StatCard Molecule - Atomic Design
 * Card for displaying statistics
 * @module components/molecules/StatCard
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../atoms';
import { FONT_FAMILIES } from '../../constants/typography';

const StatCard = ({
  icon,
  label,
  value,
  variant = 'default', // default, primary, success
  onPress,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#F0FBF5',
          borderColor: '#7DB39A',
          iconColor: '#549B79',
          labelColor: '#549B79',
          valueColor: '#1F5F5B',
        };
      case 'success':
        return {
          backgroundColor: '#F0FDF4',
          borderColor: '#86EFAC',
          iconColor: '#16A34A',
          labelColor: '#15803D',
          valueColor: '#166534',
        };
      default:
        return {
          backgroundColor: '#F9FAFB',
          borderColor: '#E5E7EB',
          iconColor: '#6B7280',
          labelColor: '#6B7280',
          valueColor: '#1F2937',
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Card
      variant="default"
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
        },
        style,
      ]}
    >
      <Text style={[styles.icon, { color: variantStyles.iconColor }]}>
        {icon}
      </Text>
      <Text style={[styles.value, { color: variantStyles.valueColor }]}>
        {value}
      </Text>
      <Text style={[styles.label, { color: variantStyles.labelColor }]}>
        {label}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 100,
    flex: 1,
    borderWidth: 1,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});

export default StatCard;
