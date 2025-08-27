import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { loadFonts } from './src/config/fonts';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      try {
        // Load fonts
        await loadFonts();
        setFontsLoaded(true);

        // Request permissions
        await requestPermissions();

      } catch (error) {
        console.warn('Initialization failed:', error);
        setFontsLoaded(true);
        setPermissionsGranted(true); // Proceed even if permissions fail
      }
    }
    initializeApp();
  }, []);

  const requestPermissions = async () => {
    try {
      // Show initial permission alert
      Alert.alert(
        "Izin Aplikasi Aksi Hijau",
        "Aplikasi ini memerlukan akses ke kamera dan lokasi untuk dokumentasi penanaman pohon. Silakan berikan izin yang diperlukan.",
        [
          {
            text: "Batalkan",
            style: "cancel",
            onPress: () => setPermissionsGranted(false)
          },
          {
            text: "Berikan Izin",
            onPress: async () => {
              await handlePermissions();
            }
          }
        ]
      );
    } catch (error) {
      console.warn('Permission request failed:', error);
      setPermissionsGranted(true);
    }
  };

  const handlePermissions = async () => {
    try {
      // Request camera permission
      const cameraPermission = await Camera.requestCameraPermissionsAsync();

      // Request location permission
      const locationPermission = await Location.requestForegroundPermissionsAsync();

      if (cameraPermission.status === 'granted' && locationPermission.status === 'granted') {
        Alert.alert(
          "Berhasil!",
          "Semua izin telah diberikan. Anda dapat menggunakan aplikasi dengan fitur lengkap.",
          [{ text: "OK", onPress: () => setPermissionsGranted(true) }]
        );
      } else {
        Alert.alert(
          "Peringatan",
          "Beberapa izin tidak diberikan. Fitur aplikasi mungkin terbatas.",
          [
            {
              text: "Coba Lagi",
              onPress: () => handlePermissions()
            },
            {
              text: "Lanjutkan",
              onPress: () => setPermissionsGranted(true)
            }
          ]
        );
      }
    } catch (error) {
      console.warn('Permission handling failed:', error);
      setPermissionsGranted(true);
    }
  };

  if (!fontsLoaded || !permissionsGranted) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {!fontsLoaded ? 'Memuat font...' : 'Mengatur izin aplikasi...'}
        </Text>
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
