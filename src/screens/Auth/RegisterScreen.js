/**
 * RegisterScreen - Modern Register dengan Glassmorphism & Animations
 * @module screens/Auth/RegisterScreen
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../constants/colors';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useTreeStore } from '../../store/treeStore';
import { useAchievementStore } from '../../store/achievementStore';
import AnimatedPressable from '../../components/atoms/AnimatedPressable';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const formSlide = useRef(new Animated.Value(100)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Store hooks
  const { register, isLoading, error, clearError } = useAuthStore();
  const { initializeFromAuth, initializeNewUser: initNewUserStats } = useUserStore();
  const { initializeNewUser: initNewUserTrees } = useTreeStore();
  const { initializeNewUser: initNewUserAchievements } = useAchievementStore();

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(formSlide, {
        toValue: 0,
        tension: 40,
        friction: 8,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const unsubscribe = navigation.addListener('focus', () => {
      clearError();
    });
    return unsubscribe;
  }, [navigation]);

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Nama harus diisi';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }

    if (!email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!password) {
      newErrors.password = 'Password harus diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Anda harus menyetujui syarat dan ketentuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    };

    const result = await register(userData);

    if (result.success) {
      const authUser = useAuthStore.getState().user;
      initializeFromAuth(authUser);
      initNewUserStats();
      initNewUserTrees();
      initNewUserAchievements();
      
      Alert.alert(
        'Registrasi Berhasil! 🎉',
        'Selamat bergabung di Aksi Hijau. Mari mulai berkontribusi untuk bumi yang lebih hijau!',
        [{ text: 'Mulai', onPress: () => {} }]
      );
    } else {
      Alert.alert('Registrasi Gagal', result.error || 'Terjadi kesalahan');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const renderInput = (config) => {
    const { 
      label, 
      icon, 
      value, 
      setValue, 
      placeholder, 
      field,
      isPassword,
      showPasswordState,
      setShowPasswordState,
      keyboardType = 'default',
    } = config;

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[
          styles.inputContainer,
          focusedInput === field && styles.inputContainerFocused,
          errors[field] && styles.inputContainerError,
        ]}>
          <Text style={styles.inputIcon}>{icon}</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.TEXT_DISABLED}
            value={value}
            onChangeText={(text) => {
              setValue(text);
              if (errors[field]) setErrors({ ...errors, [field]: null });
            }}
            keyboardType={keyboardType}
            autoCapitalize={field === 'email' ? 'none' : 'words'}
            secureTextEntry={isPassword && !showPasswordState}
            onFocus={() => setFocusedInput(field)}
            onBlur={() => setFocusedInput(null)}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPasswordState(!showPasswordState)}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeIcon}>{showPasswordState ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          )}
        </View>
        {errors[field] && (
          <Text style={styles.errorMessage}>{errors[field]}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <View style={styles.decorCircle3} />
        
        <Animated.Text 
          style={[styles.floatingEmoji1, { transform: [{ translateY: floatTranslate }] }]}
        >
          🌿
        </Animated.Text>
        <Animated.Text 
          style={[styles.floatingEmoji2, { transform: [{ translateY: Animated.multiply(floatTranslate, -1) }] }]}
        >
          🌱
        </Animated.Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Buat Akun 🌍</Text>
              <Text style={styles.headerSubtitle}>
                Bergabunglah dengan ribuan pahlawan bumi lainnya
              </Text>
            </View>
          </Animated.View>

          {/* Form Card */}
          <Animated.View 
            style={[
              styles.formCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: formSlide }],
              },
            ]}
          >
            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorTextIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Name Input */}
            {renderInput({
              label: 'Nama Lengkap',
              icon: '👤',
              value: name,
              setValue: setName,
              placeholder: 'Masukkan nama lengkap',
              field: 'name',
            })}

            {/* Email Input */}
            {renderInput({
              label: 'Email',
              icon: '📧',
              value: email,
              setValue: setEmail,
              placeholder: 'nama@email.com',
              field: 'email',
              keyboardType: 'email-address',
            })}

            {/* Password Input */}
            {renderInput({
              label: 'Password',
              icon: '🔐',
              value: password,
              setValue: setPassword,
              placeholder: 'Minimal 6 karakter',
              field: 'password',
              isPassword: true,
              showPasswordState: showPassword,
              setShowPasswordState: setShowPassword,
            })}

            {/* Confirm Password Input */}
            {renderInput({
              label: 'Konfirmasi Password',
              icon: '🔐',
              value: confirmPassword,
              setValue: setConfirmPassword,
              placeholder: 'Ketik ulang password',
              field: 'confirmPassword',
              isPassword: true,
              showPasswordState: showConfirmPassword,
              setShowPasswordState: setShowConfirmPassword,
            })}

            {/* Terms Checkbox */}
            <TouchableOpacity 
              style={styles.termsRow}
              onPress={() => {
                setAgreeTerms(!agreeTerms);
                if (errors.terms) setErrors({ ...errors, terms: null });
              }}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                Saya setuju dengan{' '}
                <Text style={styles.termsLink}>Syarat & Ketentuan</Text>
                {' '}dan{' '}
                <Text style={styles.termsLink}>Kebijakan Privasi</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && (
              <Text style={styles.errorMessage}>{errors.terms}</Text>
            )}

            {/* Register Button */}
            <AnimatedPressable onPress={handleRegister} disabled={isLoading}>
              <LinearGradient
                colors={isLoading ? [COLORS.GRAY_400, COLORS.GRAY_500] : ['#8B5CF6', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.registerButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.registerButtonText}>Daftar Sekarang</Text>
                    <Text style={styles.registerButtonIcon}>→</Text>
                  </>
                )}
              </LinearGradient>
            </AnimatedPressable>

            {/* Login Link */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Masuk</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B5CF6',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorCircle1: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorCircle2: {
    position: 'absolute',
    top: height * 0.4,
    left: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decorCircle3: {
    position: 'absolute',
    bottom: 150,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  floatingEmoji1: {
    position: 'absolute',
    top: 140,
    right: 40,
    fontSize: 28,
    opacity: 0.6,
  },
  floatingEmoji2: {
    position: 'absolute',
    top: 220,
    left: 30,
    fontSize: 24,
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
  },

  // Header
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  headerContent: {},
  headerTitle: {
    fontSize: 28,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: 'rgba(255,255,255,0.8)',
  },

  // Form Card
  formCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 28,
    padding: 24,
    ...SHADOWS.EXTRA_LARGE,
  },

  // Error
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ERROR + '12',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.ERROR + '30',
  },
  errorTextIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    color: COLORS.ERROR,
  },

  // Input
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_50,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    height: 56,
  },
  inputContainerFocused: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF6' + '08',
  },
  inputContainerError: {
    borderColor: COLORS.ERROR,
    backgroundColor: COLORS.ERROR + '08',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_PRIMARY,
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorMessage: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    color: COLORS.ERROR,
    marginTop: 6,
    marginLeft: 4,
  },

  // Terms
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.BORDER_DARK,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  checkmark: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  termsLink: {
    color: '#8B5CF6',
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Register Button
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    marginBottom: 24,
    ...SHADOWS.MEDIUM,
  },
  registerButtonText: {
    fontSize: 17,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
  },
  registerButtonIcon: {
    fontSize: 20,
    color: COLORS.WHITE,
    marginLeft: 8,
  },

  // Login Link
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: '#8B5CF6',
  },

  bottomSpacing: {
    height: 40,
  },
});
