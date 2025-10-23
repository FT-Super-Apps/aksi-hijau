/**
 * Simple Assets Components
 * Minimal components tanpa StyleSheet untuk debugging
 */

import React from 'react';
import { View, Text } from 'react-native';

// Background Illustration Component (Minimal)
export const BackgroundIllustration = ({ style }) => {
  return (
    <View style={[{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    }, style]}>
      {/* Decorative elements */}
      <View style={{
        position: 'absolute',
        bottom: 100,
        left: 50,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#549B79',
        opacity: 0.1,
      }} />
      <View style={{
        position: 'absolute',
        bottom: 150,
        right: 80,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1F5F5B',
        opacity: 0.15,
      }} />
    </View>
  );
};

// Arrow Right Icon
export const ArrowRightIcon = ({ size = 18, color = "#F5F5F5" }) => {
  return (
    <Text style={{
      fontSize: size,
      color: color,
      fontWeight: 'bold',
    }}>→</Text>
  );
};

// Arrow Oblique Icon
export const ArrowObliqueIcon = ({ size = 18, color = "#549B79" }) => {
  return (
    <Text style={{
      fontSize: size,
      color: color,
      fontWeight: 'bold',
    }}>↗</Text>
  );
};

// Eco Unity Logo
export const EcoUnityLogo = ({ color = "#549B79" }) => {
  return (
    <Text style={{
      fontSize: 18,
      color: color,
      fontWeight: 'bold',
    }}>Aksi Hijau</Text>
  );
};

export default {
  BackgroundIllustration,
  ArrowRightIcon,
  ArrowObliqueIcon,
  EcoUnityLogo,
};
