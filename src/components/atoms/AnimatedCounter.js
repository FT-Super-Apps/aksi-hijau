/**
 * AnimatedCounter - Smooth number animation component
 * @module components/atoms/AnimatedCounter
 */

import React, { useEffect, useRef, useState } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';

const AnimatedCounter = ({
  value = 0,
  duration = 1500,
  prefix = '',
  suffix = '',
  decimals = 0,
  style,
  textStyle,
  formatNumber = true,
  delay = 0,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Reset animation
    animatedValue.setValue(0);

    // Start animation after delay
    const timer = setTimeout(() => {
      Animated.timing(animatedValue, {
        toValue: value,
        duration,
        useNativeDriver: false,
      }).start();
    }, delay);

    // Listen to animated value changes
    const listener = animatedValue.addListener(({ value: v }) => {
      setDisplayValue(v);
    });

    return () => {
      clearTimeout(timer);
      animatedValue.removeListener(listener);
    };
  }, [value, duration, delay]);

  const formatDisplayValue = () => {
    let num = decimals > 0 
      ? displayValue.toFixed(decimals) 
      : Math.round(displayValue);

    if (formatNumber && typeof num === 'number') {
      num = num.toLocaleString();
    } else if (formatNumber && typeof num === 'string') {
      const parts = num.split('.');
      parts[0] = parseInt(parts[0]).toLocaleString();
      num = parts.join('.');
    }

    return `${prefix}${num}${suffix}`;
  };

  return (
    <Text style={[styles.text, textStyle]}>
      {formatDisplayValue()}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
});

export default AnimatedCounter;

