import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../constants/typography';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: 'Makassar',
    interests: [],
    community: null,
  });

  const scrollViewRef = useRef(null);

  const onboardingSlides = [
    {
      id: 0,
      title: 'Selamat Datang di\nAksi Hijau 🌱',
      description: 'Platform digital untuk berkontribusi pada pelestarian lingkungan melalui penanaman pohon dan aksi hijau',
      illustration: '🌍',
      backgroundColor: COLORS.PRIMARY,
    },
    {
      id: 1,
      title: 'Tanam & Pantau\nPohon Anda 🌳',
      description: 'Dokumentasikan setiap pohon yang Anda tanam dengan GPS, foto, dan tracking pertumbuhan real-time',
      illustration: '📸',
      backgroundColor: COLORS.SUCCESS,
    },
    {
      id: 2,
      title: 'Hitung Jejak\nKarbon Anda 🌍',
      description: 'Ketahui jejak karbon Anda dan berapa pohon yang dibutuhkan untuk menetralkannya',
      illustration: '📊',
      backgroundColor: COLORS.ACCENT,
    },
    {
      id: 3,
      title: 'Bergabung dengan\nKomunitas 👥',
      description: 'Terhubung dengan ribuan eco-warriors di seluruh Indonesia dan ikut aksi penanaman massal',
      illustration: '🤝',
      backgroundColor: COLORS.SECONDARY,
    },
  ];

  const communities = [
    {
      id: 1,
      name: 'Forum Hijau Makassar',
      members: 1250,
      trees: 5640,
      icon: '🏢',
      description: 'Komunitas peduli lingkungan Makassar',
    },
    {
      id: 2,
      name: 'Green Community',
      members: 890,
      trees: 3420,
      icon: '🌱',
      description: 'Gerakan hijau untuk generasi muda',
    },
    {
      id: 3,
      name: 'Mahasiswa Peduli Lingkungan',
      members: 2340,
      trees: 8920,
      icon: '🎓',
      description: 'Komunitas mahasiswa se-Sulawesi',
    },
    {
      id: 4,
      name: 'Belum Ada',
      members: 0,
      trees: 0,
      icon: '✨',
      description: 'Saya ingin mulai sendiri dulu',
    },
  ];

  const interests = [
    { id: 1, label: 'Penanaman Pohon', icon: '🌳' },
    { id: 2, label: 'Daur Ulang', icon: '♻️' },
    { id: 3, label: 'Zero Waste', icon: '🗑️' },
    { id: 4, label: 'Energi Terbarukan', icon: '⚡' },
    { id: 5, label: 'Edukasi Lingkungan', icon: '📚' },
    { id: 6, label: 'Konservasi', icon: '🦜' },
  ];

  const toggleInterest = (interestId) => {
    const newInterests = formData.interests.includes(interestId)
      ? formData.interests.filter(id => id !== interestId)
      : [...formData.interests, interestId];
    setFormData({ ...formData, interests: newInterests });
  };

  const goToNextSlide = () => {
    if (currentStep < onboardingSlides.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ x: width * (currentStep + 1), animated: true });
    } else {
      setCurrentStep(4); // Go to registration
    }
  };

  const goToPrevSlide = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ x: width * (currentStep - 1), animated: true });
    }
  };

  const renderOnboardingSlide = (slide, index) => (
    <View key={slide.id} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
      <View style={styles.slideContent}>
        <Text style={styles.illustration}>{slide.illustration}</Text>
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideDescription}>{slide.description}</Text>
      </View>
    </View>
  );

  const renderRegistrationForm = () => (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Mari Berkenalan! 👋</Text>
        <Text style={styles.formDescription}>
          Lengkapi data Anda untuk memulai perjalanan hijau
        </Text>
      </View>

      {/* Personal Info */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Informasi Pribadi</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nama Lengkap *</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama Anda"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="nama@email.com"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Lokasi</Text>
          <TextInput
            style={styles.input}
            placeholder="Kota Anda"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
        </View>
      </View>

      {/* Interests */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Minat Lingkungan</Text>
        <Text style={styles.sectionDescription}>Pilih topik yang Anda minati</Text>

        <View style={styles.interestsGrid}>
          {interests.map((interest) => (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.interestCard,
                formData.interests.includes(interest.id) && styles.interestCardActive
              ]}
              onPress={() => toggleInterest(interest.id)}
            >
              <Text style={styles.interestIcon}>{interest.icon}</Text>
              <Text style={[
                styles.interestLabel,
                formData.interests.includes(interest.id) && styles.interestLabelActive
              ]}>
                {interest.label}
              </Text>
              {formData.interests.includes(interest.id) && (
                <View style={styles.checkMark}>
                  <Text style={styles.checkMarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Community */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Pilih Komunitas (Opsional)</Text>
        <Text style={styles.sectionDescription}>
          Bergabunglah dengan komunitas untuk aksi bersama
        </Text>

        {communities.map((community) => (
          <TouchableOpacity
            key={community.id}
            style={[
              styles.communityCard,
              formData.community === community.id && styles.communityCardActive
            ]}
            onPress={() => setFormData({ ...formData, community: community.id })}
          >
            <View style={styles.communityIcon}>
              <Text style={styles.communityIconText}>{community.icon}</Text>
            </View>

            <View style={styles.communityInfo}>
              <Text style={styles.communityName}>{community.name}</Text>
              <Text style={styles.communityDescription}>{community.description}</Text>
              {community.members > 0 && (
                <View style={styles.communityStats}>
                  <Text style={styles.communityStatText}>
                    👥 {community.members.toLocaleString()} anggota
                  </Text>
                  <Text style={styles.communityStatDivider}>•</Text>
                  <Text style={styles.communityStatText}>
                    🌳 {community.trees.toLocaleString()} pohon
                  </Text>
                </View>
              )}
            </View>

            {formData.community === community.id && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, (!formData.name || !formData.email) && styles.submitButtonDisabled]}
        onPress={() => navigation.replace('MainTabs')}
        disabled={!formData.name || !formData.email}
      >
        <LinearGradient
          colors={(!formData.name || !formData.email)
            ? [COLORS.GRAY_300, COLORS.GRAY_400]
            : [COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
          style={styles.submitButtonGradient}
        >
          <Text style={styles.submitButtonText}>🚀 Mulai Aksi Hijau</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  const renderIndicators = () => {
    if (currentStep >= 4) return null;

    return (
      <View style={styles.indicators}>
        {onboardingSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentStep && styles.indicatorActive
            ]}
          />
        ))}
      </View>
    );
  };

  if (currentStep >= 4) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />

        {/* Header */}
        <View style={styles.formHeaderContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentStep(3)}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daftar</Text>
          <View style={styles.placeholder} />
        </View>

        {renderRegistrationForm()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={onboardingSlides[currentStep].backgroundColor} />

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.slidesContainer}
      >
        {onboardingSlides.map((slide, index) => renderOnboardingSlide(slide, index))}
      </ScrollView>

      {/* Controls */}
      <View style={styles.controls}>
        {renderIndicators()}

        <View style={styles.buttons}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.skipButton} onPress={() => setCurrentStep(4)}>
              <Text style={styles.skipText}>Lewati</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          <TouchableOpacity style={styles.nextButton} onPress={goToNextSlide}>
            <LinearGradient
              colors={[COLORS.WHITE + '30', COLORS.WHITE + '20']}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === onboardingSlides.length - 1 ? 'Mulai' : 'Lanjut'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Slides
  slidesContainer: {
    flex: 1,
  },
  slide: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.PADDING.XXL,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  illustration: {
    fontSize: 140,
    marginBottom: SPACING.MARGIN.XXL,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  slideTitle: {
    fontSize: 32,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textAlign: 'center',
    marginBottom: SPACING.MARGIN.LG,
    lineHeight: 38,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  slideDescription: {
    fontSize: 15,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  // Controls
  controls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.PADDING.XXL,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.MARGIN.XL,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.WHITE + '25',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.WHITE + '15',
  },
  indicatorActive: {
    width: 32,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.WHITE,
    shadowColor: COLORS.WHITE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipButton: {
    padding: SPACING.PADDING.MD,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  skipText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  nextButton: {
    borderRadius: 28,
    overflow: 'hidden',
    minWidth: 140,
    shadowColor: COLORS.WHITE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.WHITE + '30',
  },
  nextButtonText: {
    fontSize: 15,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    letterSpacing: 0.3,
  },

  // Form
  formHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: SPACING.PADDING.LG,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.PRIMARY + '10',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '20',
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  headerTitle: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 44,
  },

  formContainer: {
    flex: 1,
    backgroundColor: '#FAFFFE',
  },
  formHeader: {
    padding: SPACING.PADDING.XXL,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  formTitle: {
    fontSize: 26,
    color: '#1a1a1a',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 8,
    letterSpacing: -0.6,
  },
  formDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    lineHeight: 21,
  },

  formSection: {
    paddingHorizontal: SPACING.PADDING.XL,
    paddingVertical: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#1a1a1a',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 20,
    lineHeight: 18,
  },

  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    color: '#374151',
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: 10,
    letterSpacing: -0.1,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },

  // Interests
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  interestCard: {
    width: (width - SPACING.PADDING.XL * 2 - 12 * 2) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    margin: 6,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    position: 'relative',
  },
  interestCardActive: {
    borderColor: '#7DB39A',
    backgroundColor: '#F0FBF5',
    borderWidth: 2,
  },
  interestIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  interestLabel: {
    fontSize: 10,
    color: '#4B5563',
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    textAlign: 'center',
    lineHeight: 13,
  },
  interestLabelActive: {
    color: '#1F5F5B',
  },
  checkMark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#549B79',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Community
  communityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    position: 'relative',
  },
  communityCardActive: {
    borderColor: '#7DB39A',
    backgroundColor: '#F0FBF5',
    borderWidth: 2,
  },
  communityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  communityIconText: {
    fontSize: 28,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  communityDescription: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 6,
    lineHeight: 16,
  },
  communityStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityStatText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  communityStatDivider: {
    fontSize: 10,
    color: '#D1D5DB',
    marginHorizontal: 6,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#549B79',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Submit
  submitButton: {
    marginHorizontal: SPACING.PADDING.XL,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    letterSpacing: 0.2,
  },

  bottomSpacing: {
    height: 40,
  },
});

