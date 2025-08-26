// Font configuration for EcoUnity app
// This file contains font loading logic and fallbacks

import * as Font from 'expo-font';
import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
} from '@expo-google-fonts/sora';
import {
  KulimPark_400Regular,
  KulimPark_600SemiBold,
  KulimPark_700Bold,
} from '@expo-google-fonts/kulim-park';

export const loadFonts = async () => {
  try {
    await Font.loadAsync({
      // Sora fonts for headings
      Sora_400Regular,
      Sora_600SemiBold,
      Sora_700Bold,
      // Kulim Park fonts for body text
      KulimPark_400Regular,
      KulimPark_600SemiBold,
      KulimPark_700Bold,
    });
    return true;
  } catch (error) {
    console.warn('Error loading fonts:', error);
    return false;
  }
};

// Font family constants for easy use throughout the app
export const fonts = {
  title: 'Sora_700Bold', // Sora Bold for main titles
  titleRegular: 'Sora_400Regular', // Sora Regular for secondary titles
  body: 'KulimPark_400Regular', // Kulim Park Regular for body text
  bodySemiBold: 'KulimPark_600SemiBold', // Kulim Park SemiBold for emphasis
};

// Design colors from Figma
export const colors = {
  primary: '#549B79',
  secondary: '#1F5F5B',
  text: '#292B2D',
  background: '#F5F5F5',
  white: '#F5F5F5',
  black: '#292B2D',
  green: '#549B79',
  darkGreen: '#1F5F5B',
};

// Typography styles
export const typography = {
  h1: {
    fontSize: 39,
    fontWeight: 'bold',
    fontFamily: fonts.title,
    color: colors.text,
    lineHeight: 45,
  },
  h2: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: fonts.title,
    color: colors.primary,
  },
  body1: {
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.text,
    lineHeight: 18,
  },
  body2: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.text,
    lineHeight: 20,
  },
  caption: {
    fontSize: 10,
    fontFamily: fonts.body,
    color: colors.text,
    opacity: 0.5,
  },
  button: {
    fontSize: 11,
    fontFamily: fonts.body,
  },
};
