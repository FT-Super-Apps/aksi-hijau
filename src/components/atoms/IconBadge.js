/**
 * IconBadge - Animated icon with background and optional glow
 * @module components/atoms/IconBadge
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../constants/colors';

const IconBadge = ({
  icon,
  size = 48,
  iconSize,
  backgroundColor = COLORS.PRIMARY,
  gradientColors,
  glow = false,
  glowColor,
  animated = false,
  animationType = 'pulse', // pulse, bounce, rotate
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    let animation;
    
    if (animationType === 'pulse') {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
    } else if (animationType === 'bounce') {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1.15,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(animatedValue, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }),
        ])
      );
    } else if (animationType === 'rotate') {
      animation = Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      );
    }

    animation?.start();
    return () => animation?.stop();
  }, [animated, animationType]);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [
      { scale: animatedValue },
      { rotate: animationType === 'rotate' ? rotateInterpolate : '0deg' },
    ],
  };

  const containerStyles = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    glow && {
      shadowColor: glowColor || backgroundColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: size / 4,
      elevation: 8,
    },
    style,
  ];

  const calculatedIconSize = iconSize || size * 0.5;

  const content = (
    <Animated.View style={animatedStyle}>
      <Text style={{ fontSize: calculatedIconSize }}>{icon}</Text>
    </Animated.View>
  );

  if (gradientColors) {
    return (
      <View style={containerStyles}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: size / 2 }]}
        >
          {content}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[containerStyles, { backgroundColor }]}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconBadge;

