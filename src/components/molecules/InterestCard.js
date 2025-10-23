/**
 * InterestCard Molecule - Atomic Design
 * Selectable card for interest/hobby selection
 * @module components/molecules/InterestCard
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Badge } from '../atoms';
import { FONT_FAMILIES } from '../../constants/typography';

const InterestCard = ({
  icon,
  label,
  active = false,
  onPress,
  style,
}) => {
  return (
    <Card
      variant="default"
      active={active}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.label, active && styles.labelActive]}>
        {label}
      </Text>
      {active && (
        <View style={styles.checkMark}>
          <Text style={styles.checkMarkText}>✓</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 12,
    minHeight: 90,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 30,
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: '#4B5563',
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    textAlign: 'center',
    lineHeight: 13,
  },
  labelActive: {
    color: '#1F5F5B',
  },
  checkMark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#549B79',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
});

export default InterestCard;
