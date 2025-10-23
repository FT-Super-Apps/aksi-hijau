/**
 * Figma Assets Components
 * Simplified components untuk menghindari SVG runtime issues
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

// Background Illustration Component (Simplified)
export const BackgroundIllustration = ({ width = 414, height = 896, style }) => {
  return (
    <View style={[styles.backgroundContainer, style]}>
      {/* Decorative background elements using View components */}
      <View style={styles.decorativeElement1} />
      <View style={styles.decorativeElement2} />
      <View style={styles.decorativeElement3} />
    </View>
  );
};

// Arrow Right Icon (Text-based)
export const ArrowRightIcon = ({ size = 18, color = "#F5F5F5", style }) => {
  return (
    <View style={[styles.iconContainer, style]}>
      <Text style={[styles.iconText, { fontSize: size, color }]}>→</Text>
    </View>
  );
};

// Arrow Oblique Icon (Text-based)
export const ArrowObliqueIcon = ({ size = 18, color = "#549B79", style }) => {
  return (
    <View style={[styles.iconContainer, style]}>
      <Text style={[styles.iconText, { fontSize: size, color }]}>↗</Text>
    </View>
  );
};

// Eco Unity Logo (Text-based)
export const EcoUnityLogo = ({ width = 90, height = 23, color = "#549B79", style }) => {
  return (
    <View style={[styles.logoContainer, style]}>
      <Text style={[styles.logoText, { color, fontSize: height * 0.8 }]}>
        Aksi Hijau
      </Text>
    </View>
  );
};

// Menu Icon (Text-based)
export const MenuIcon = ({ size = 24, color = "#292B2D", style }) => {
  return (
    <View style={[styles.iconContainer, style]}>
      <Text style={[styles.iconText, { fontSize: size, color }]}>☰</Text>
    </View>
  );
};

// Statistics Card Icons (Text-based)
export const PlasticWasteIcon = ({ size = 24, color = "#292B2D", style }) => {
  return (
    <View style={[styles.iconContainer, style]}>
      <Text style={[styles.iconText, { fontSize: size, color }]}>🗑️</Text>
    </View>
  );
};

export const SpeciesIcon = ({ size = 24, color = "#549B79", style }) => {
  return (
    <View style={[styles.iconContainer, style]}>
      <Text style={[styles.iconText, { fontSize: size, color }]}>🌿</Text>
    </View>
  );
};

export const TemperatureIcon = ({ size = 24, color = "#549B79", style }) => {
  return (
    <View style={[styles.iconContainer, style]}>
      <Text style={[styles.iconText, { fontSize: size, color }]}>🌡️</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorativeElement1: {
    position: 'absolute',
    bottom: 100,
    left: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#549B79',
    opacity: 0.1,
  },
  decorativeElement2: {
    position: 'absolute',
    bottom: 150,
    right: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1F5F5B',
    opacity: 0.15,
  },
  decorativeElement3: {
    position: 'absolute',
    top: 200,
    right: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFB84D',
    opacity: 0.2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default {
  BackgroundIllustration,
  MenuIcon,
  ArrowRightIcon,
  ArrowObliqueIcon,
  EcoUnityLogo,
  PlasticWasteIcon,
  SpeciesIcon,
  TemperatureIcon,
};
