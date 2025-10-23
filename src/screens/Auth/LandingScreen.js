import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

import { Image } from 'expo-image';
import LoginSvg from '@assets/login.svg';

const { width, height } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          Sora_400Regular,
          Sora_600SemiBold,
          Sora_700Bold,
          KulimPark_400Regular,
          KulimPark_600SemiBold,
          KulimPark_700Bold,
        });
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Error loading fonts:', error);
        setFontsLoaded(true); // Continue with system fonts
      }
    }
    loadFonts();
  }, []);

  const handleJoinNow = () => {
    navigation.navigate('Onboarding');
  };

  const handleInvitePeople = () => {
    console.log('Invite people');
  };

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Background with gradient - Full screen */}
      <LinearGradient
        colors={['#FFFFFF', '#F0FBF5', '#E8F8F0', '#F5F5F5']}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.backgroundAbsolute}
      />

      {/* Bottom Illustration - Trees and Earth - Extends to bottom */}
      <View style={styles.bottomIllustration}>
        <LoginSvg width="100%" height="100%" />
      </View>

      <View style={styles.contentWrapper}>
        {/* Header - Centered */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🌱</Text>
            <Text style={styles.logoText}>Aksi Hijau</Text>
          </View>
          <Text style={styles.tagline}>Tanam, Tag, Tumbuh Bersama Bumi</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
              Mari Bergabung dalam{'\n'}
              <Text style={styles.heroTitleGreen}>Gerakan Hijau</Text>{'\n'}
              untuk Masa Depan
            </Text>
          </View>

          {/* Statistics Cards - 3 Cards Row */}
          <View style={styles.statisticsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>🌳</Text>
              </View>
              <Text style={styles.statNumber}>50K+</Text>
              <View style={styles.statContent}>
                <Text style={styles.statTitle}>Pohon</Text>
                <Text style={styles.statDescription}>Tertanam</Text>
              </View>
            </View>

            <View style={[styles.statCard, styles.statCardGlass]}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>♻️</Text>
              </View>
              <Text style={[styles.statNumber, styles.statNumberGreen]}>2.5M</Text>
              <View style={styles.statContent}>
                <Text style={styles.statTitle}>Ton CO₂</Text>
                <Text style={styles.statDescription}>Terserap</Text>
              </View>
            </View>

            <View style={[styles.statCard, styles.statCardGlass]}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>👥</Text>
              </View>
              <Text style={[styles.statNumber, styles.statNumberGreen]}>10K+</Text>
              <View style={styles.statContent}>
                <Text style={styles.statTitle}>Pengguna</Text>
                <Text style={styles.statDescription}>Aktif</Text>
              </View>
            </View>
          </View>

          {/* CTA Buttons - Horizontal Row */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleJoinNow}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Mulai Sekarang</Text>
              <Text style={styles.arrowText}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleInvitePeople}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Ajak Teman</Text>
              <Text style={[styles.arrowText, styles.arrowGreen]}>↗</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer for bottom illustration */}
          <View style={{ height: 250 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  backgroundAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  contentWrapper: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  bottomIllustration: {
    position: 'absolute',
    bottom: -50,
    left: 0,
    right: 0,
    width: width,
    height: height * 0.6,
    opacity: 0.9,
  },
  header: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  logoIcon: {
    fontSize: 20,
  },
  logoText: {
    fontSize: 18,
    fontFamily: 'Sora_700Bold',
    color: '#1F5F5B',
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 10,
    fontFamily: 'KulimPark_400Regular',
    color: '#549B79',
    letterSpacing: 0.3,
    opacity: 0.75,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 36,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: 'Sora_700Bold',
    color: '#292B2D',
    textAlign: 'left',
    lineHeight: 38,
    marginBottom: 0,
    letterSpacing: -0.8,
  },
  heroTitleGreen: {
    color: '#549B79',
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'KulimPark_400Regular',
    color: '#292B2D',
    textAlign: 'left',
    opacity: 0.65,
    lineHeight: 22,
    maxWidth: 300,
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 36,
    gap: 10,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 16,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#549B79',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statCardGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(84, 155, 121, 0.12)',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  statIconContainer: {
    marginBottom: 6,
  },
  statIcon: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Sora_700Bold',
    color: '#292B2D',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  statNumberGreen: {
    color: '#549B79',
  },
  statContent: {
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 11,
    fontFamily: 'KulimPark_600SemiBold',
    color: '#292B2D',
    marginBottom: 2,
    textAlign: 'center',
  },
  statDescription: {
    fontSize: 9,
    fontFamily: 'KulimPark_400Regular',
    color: '#292B2D',
    opacity: 0.55,
    textAlign: 'center',
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#549B79',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#549B79',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 12,
    fontFamily: 'Sora_600SemiBold',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#549B79',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    flex: 1,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontFamily: 'Sora_600SemiBold',
    color: '#549B79',
    letterSpacing: 0.1,
  },
  arrowText: {
    fontSize: 14,
    fontFamily: 'Sora_700Bold',
    color: '#FFFFFF',
  },
  arrowGreen: {
    color: '#549B79',
  },
});

export default LandingScreen;
