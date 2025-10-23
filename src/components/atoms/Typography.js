/**
 * Typography Components - Atomic Design
 * Consistent text styling across the app
 * @module components/atoms/Typography
 */

import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { FONT_FAMILIES } from '../../constants/typography';
import { COLORS } from '../../constants/colors';

// Heading Component
export const Heading = ({ level = 1, children, style, ...props }) => {
  const headingStyle = styles[`h${level}`];
  return (
    <RNText style={[headingStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

// Body Text Component
export const Body = ({ size = 'medium', children, style, ...props }) => {
  return (
    <RNText style={[styles.body, styles[`body${size}`], style]} {...props}>
      {children}
    </RNText>
  );
};

// Caption Text Component
export const Caption = ({ children, style, ...props }) => {
  return (
    <RNText style={[styles.caption, style]} {...props}>
      {children}
    </RNText>
  );
};

// Label Component
export const Label = ({ children, style, ...props }) => {
  return (
    <RNText style={[styles.label, style]} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  // Headings
  h1: {
    fontSize: 32,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  h2: {
    fontSize: 26,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  h3: {
    fontSize: 22,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  h5: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  h6: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.1,
    lineHeight: 20,
  },

  // Body Text
  body: {
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_PRIMARY,
  },
  bodysmall: {
    fontSize: 12,
    lineHeight: 18,
  },
  bodymedium: {
    fontSize: 14,
    lineHeight: 21,
  },
  bodylarge: {
    fontSize: 16,
    lineHeight: 24,
  },

  // Caption
  caption: {
    fontSize: 11,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 16,
  },

  // Label
  label: {
    fontSize: 13,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: -0.1,
  },
});

export default { Heading, Body, Caption, Label };
