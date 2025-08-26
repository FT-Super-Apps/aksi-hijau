import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  LargeLeaf1,
  LargeLeaf2,
  LightFoliage,
  SmallLeaf1,
  SmallLeaf2,
  GoldenDecoration,
  FlowingFern,
  OrangeDot
} from '../utils/SvgAssets';

const { width, height } = Dimensions.get('window');

const BackgroundIllustration = () => {
  return (
    <View style={styles.container}>
      {/* Large background foliage elements */}
      <View style={styles.largeLeaf1}>
        <LargeLeaf1 width={120} height={141} />
      </View>

      <View style={styles.largeLeaf2}>
        <LargeLeaf2 width={140} height={100} />
      </View>

      {/* Light green foliage for depth */}
      <View style={styles.lightFoliage1}>
        <LightFoliage width={110} height={75} />
      </View>

      <View style={styles.lightFoliage2}>
        <LightFoliage width={90} height={60} />
      </View>

      {/* Golden decorative element */}
      <View style={styles.goldenDecoration}>
        <GoldenDecoration width={60} height={52} />
      </View>

      {/* Small leaf details for organic feel */}
      <View style={styles.smallLeaf1}>
        <SmallLeaf1 width={12} height={18} />
      </View>

      <View style={styles.smallLeaf2}>
        <SmallLeaf2 width={8} height={22} />
      </View>

      <View style={styles.smallLeaf3}>
        <SmallLeaf1 width={10} height={15} />
      </View>

      <View style={styles.smallLeaf4}>
        <SmallLeaf2 width={6} height={18} />
      </View>

      <View style={styles.smallLeaf5}>
        <SmallLeaf1 width={14} height={20} />
      </View>

      {/* Beautiful flowing fern elements */}
      <View style={styles.flowingFern1}>
        <FlowingFern width={45} height={120} />
      </View>

      <View style={styles.flowingFern2}>
        <FlowingFern width={35} height={95} />
      </View>

      {/* Small orange accent dots */}
      <View style={styles.orangeDot1}>
        <OrangeDot width={8} height={8} />
      </View>

      <View style={styles.orangeDot2}>
        <OrangeDot width={6} height={6} />
      </View>

      <View style={styles.orangeDot3}>
        <OrangeDot width={10} height={10} />
      </View>

      <View style={styles.orangeDot4}>
        <OrangeDot width={7} height={7} />
      </View>

      {/* Additional background foliage layers */}
      <View style={styles.backgroundLeaf1}>
        <LargeLeaf1 width={80} height={94} />
      </View>

      <View style={styles.backgroundLeaf2}>
        <LightFoliage width={70} height={48} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: 0,
    left: 0,
    right: 0,
  },
  // Large foliage elements positioned to create depth
  largeLeaf1: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    opacity: 0.9,
    transform: [{ rotate: '15deg' }],
  },
  largeLeaf2: {
    position: 'absolute',
    bottom: 40,
    left: -30,
    opacity: 0.8,
    transform: [{ rotate: '-10deg' }],
  },
  // Light foliage for layering
  lightFoliage1: {
    position: 'absolute',
    top: 120,
    right: 20,
    opacity: 0.7,
    transform: [{ rotate: '25deg' }],
  },
  lightFoliage2: {
    position: 'absolute',
    bottom: 120,
    left: 10,
    opacity: 0.6,
    transform: [{ rotate: '-15deg' }],
  },
  // Golden decorative accent
  goldenDecoration: {
    position: 'absolute',
    top: 100,
    left: 40,
    opacity: 0.8,
    transform: [{ rotate: '10deg' }],
  },
  // Small leaf details scattered throughout
  smallLeaf1: {
    position: 'absolute',
    top: 200,
    right: 80,
    opacity: 0.9,
    transform: [{ rotate: '45deg' }],
  },
  smallLeaf2: {
    position: 'absolute',
    bottom: 180,
    right: 150,
    opacity: 0.8,
    transform: [{ rotate: '-30deg' }],
  },
  smallLeaf3: {
    position: 'absolute',
    top: 160,
    left: 20,
    opacity: 0.7,
    transform: [{ rotate: '60deg' }],
  },
  smallLeaf4: {
    position: 'absolute',
    bottom: 250,
    left: 80,
    opacity: 0.6,
    transform: [{ rotate: '-45deg' }],
  },
  smallLeaf5: {
    position: 'absolute',
    top: 250,
    right: 40,
    opacity: 0.8,
    transform: [{ rotate: '20deg' }],
  },
  // Flowing fern elements for organic beauty
  flowingFern1: {
    position: 'absolute',
    top: 60,
    right: 30,
    opacity: 0.6,
    transform: [{ rotate: '12deg' }],
  },
  flowingFern2: {
    position: 'absolute',
    bottom: 60,
    left: 25,
    opacity: 0.5,
    transform: [{ rotate: '-25deg' }],
  },
  // Small orange accent dots scattered for energy
  orangeDot1: {
    position: 'absolute',
    top: 140,
    left: 60,
    opacity: 0.8,
  },
  orangeDot2: {
    position: 'absolute',
    bottom: 200,
    right: 120,
    opacity: 0.9,
  },
  orangeDot3: {
    position: 'absolute',
    top: 220,
    right: 160,
    opacity: 0.7,
  },
  orangeDot4: {
    position: 'absolute',
    bottom: 140,
    left: 120,
    opacity: 0.8,
  },
  // Background layers for depth
  backgroundLeaf1: {
    position: 'absolute',
    top: 80,
    left: 50,
    opacity: 0.4,
    transform: [{ rotate: '-20deg' }],
  },
  backgroundLeaf2: {
    position: 'absolute',
    bottom: 80,
    right: 90,
    opacity: 0.3,
    transform: [{ rotate: '35deg' }],
  },
});

export default BackgroundIllustration;
