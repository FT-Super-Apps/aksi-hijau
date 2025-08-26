import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { loadFonts } from '../config/fonts';
import { COLORS, TEXT_STYLES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { Button } from '../components';
import BackgroundIllustration from '../components/common/BackgroundIllustration';

const { width, height } = Dimensions.get('window');

export default function EcoUnityWelcome({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadAppFonts() {
      try {
        const fontsLoaded = await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Error loading fonts:', error);
        setFontsLoaded(true); // Continue with system fonts
      }
    }
    loadAppFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Background - Beautiful illustration with environmental elements */}
      <View style={styles.backgroundContainer}>
        <View style={styles.backgroundGradient} />
        <BackgroundIllustration />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>🌿</Text>
          </View>
          <Text style={styles.logoText}>Aksi Hijau</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Bersama Wujudkan{'\n'}
            <Text style={styles.titleGreen}>Makassar Hijau</Text>{'\n'}
            dan Tangguh Iklim
          </Text>

          <Text style={styles.subtitle}>
            Bergabunglah dalam gerakan kolaboratif untuk meningkatkan Ruang Terbuka Hijau Kota Makassar melalui aksi nyata dan teknologi
          </Text>
        </View>

        {/* Statistics */}
        <View style={styles.statisticsContainer}>
          <View style={styles.statisticCard}>
            <View style={styles.statisticIconContainer}>
              <Text style={styles.statisticIcon}>🌱</Text>
            </View>
            <Text style={styles.statisticTitle}>Pantau RTH{'\n'}Real-Time</Text>
          </View>

          <View style={styles.statisticCard}>
            <View style={styles.statisticIconContainer}>
              <Text style={styles.statisticIcon}>📍</Text>
            </View>
            <Text style={styles.statisticTitle}>Laporkan{'\n'}Aksi Hijau</Text>
          </View>

          <View style={styles.statisticCard}>
            <View style={styles.statisticIconContainer}>
              <Text style={styles.statisticIcon}>🤝</Text>
            </View>
            <Text style={styles.statisticTitle}>Kolaborasi{'\n'}Multi-Pihak</Text>
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaContainer}>
          <Button
            title="Mulai Berkontribusi Sekarang"
            onPress={() => navigation.navigate('MainTabs')}
            variant="primary"
            size="large"
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
            icon={() => <Text style={styles.buttonArrow}>→</Text>}
            iconPosition="right"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.XXL,
    paddingTop: SPACING.XXL,
    paddingBottom: SPACING.LG,
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.CIRCLE,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.MEDIUM,
  },
  logoIconText: {
    fontSize: 20,
  },
  logoText: {
    ...TEXT_STYLES.H4,
    color: COLORS.PRIMARY,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: SPACING.XXL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: SPACING.LG,
  },
  title: {
    ...TEXT_STYLES.H1,
    textAlign: 'center',
    marginBottom: SPACING.XXL,
    color: COLORS.TEXT_PRIMARY,
  },
  titleGreen: {
    color: COLORS.PRIMARY,
  },
  subtitle: {
    ...TEXT_STYLES.BODY_LARGE,
    opacity: 0.8,
    textAlign: 'center',
    maxWidth: 320,
    color: COLORS.TEXT_PRIMARY,
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 60,
    width: '100%',
    maxWidth: 340,
    gap: SPACING.LG,
  },
  statisticCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BORDER_RADIUS.XL,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.XXL,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(84, 155, 121, 0.1)',
    ...SHADOWS.MEDIUM,
  },
  statisticIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(84, 155, 121, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  statisticIcon: {
    fontSize: 28,
  },
  statisticTitle: {
    ...TEXT_STYLES.CAPTION,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    minWidth: 280,
    ...SHADOWS.LARGE,
  },
  primaryButtonText: {
    letterSpacing: -0.2,
  },
  buttonArrow: {
    color: COLORS.TEXT_ON_PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
