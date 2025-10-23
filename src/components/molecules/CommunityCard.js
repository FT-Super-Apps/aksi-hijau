/**
 * CommunityCard Molecule - Atomic Design
 * Card for displaying community information
 * @module components/molecules/CommunityCard
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Badge } from '../atoms';
import { FONT_FAMILIES } from '../../constants/typography';

const CommunityCard = ({
  icon,
  name,
  description,
  members,
  trees,
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
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>

        {members > 0 && (
          <View style={styles.stats}>
            <Text style={styles.statText}>
              👥 {members.toLocaleString()} anggota
            </Text>
            <Text style={styles.statDivider}>•</Text>
            <Text style={styles.statText}>
              🌳 {trees.toLocaleString()} pohon
            </Text>
          </View>
        )}
      </View>

      {active && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>✓</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 6,
    lineHeight: 16,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  statDivider: {
    fontSize: 10,
    color: '#D1D5DB',
    marginHorizontal: 6,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#549B79',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
});

export default CommunityCard;
