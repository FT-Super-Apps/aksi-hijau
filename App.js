import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { loadFonts } from './src/config/fonts';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepareFonts() {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Fonts failed to load, using fallback:', error);
        setFontsLoaded(true); // Still proceed with fallback fonts
      }
    }
    prepareFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
