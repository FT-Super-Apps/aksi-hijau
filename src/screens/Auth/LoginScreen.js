/**
 * LoginScreen - Modern Login dengan Glassmorphism & Animations
 * @module screens/Auth/LoginScreen
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
import { COLORS, GRADIENT_COLORS, SHADOWS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useTreeStore } from '../../store/treeStore';
import { useAchievementStore } from '../../store/achievementStore';
import AnimatedPressable from '../../components/atoms/AnimatedPressable';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const formSlide = useRef(new Animated.Value(100)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Store hooks
  const { login, isLoading, error, clearError } = useAuthStore();
  const { initializeFromAuth, initializeWithDemoData, initializeNewUser: initNewUserStats } = useUserStore();
  const { initializeWithDemoData: initDemoTrees, initializeNewUser: initNewUserTrees } = useTreeStore();
  const { initializeWithDemoData: initDemoAchievements, initializeNewUser: initNewUserAchievements } = useAchievementStore();

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
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

    // Floating animation loop
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

    // Clear error when screen focuses
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const result = await login(email, password);

    if (result.success) {
      const authUser = useAuthStore.getState().user;
      initializeFromAuth(authUser);
      
      const isDemoUser = email.toLowerCase() === 'demo@aksihijau.id';
      
      if (isDemoUser) {
        initializeWithDemoData();
        initDemoTrees();
        initDemoAchievements();
      } else {
        initNewUserStats();
        initNewUserTrees();
        initNewUserAchievements();
      }
    } else {
      Alert.alert('Login Gagal', result.error || 'Terjadi kesalahan');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const fillDemoCredentials = () => {
    setEmail('demo@aksihijau.id');
    setPassword('demo123');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#059669', '#047857', '#065F46']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Decorative Elements */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <View style={styles.decorCircle3} />
        
        {/* Floating Leaves */}
        <Animated.Text 
          style={[
            styles.floatingLeaf1, 
            { transform: [{ translateY: floatTranslate }] }
          ]}
        >
          🍃
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.floatingLeaf2, 
            { transform: [{ translateY: Animated.multiply(floatTranslate, -1) }] }
          ]}
        >
          🌿
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
                transform: [
                  { translateY: slideAnim },
                  { scale: logoScale },
                ],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                style={styles.logoBg}
              >
                <Text style={styles.logoIcon}>🌱</Text>
              </LinearGradient>
            </View>
            <Text style={styles.appName}>Aksi Hijau</Text>
            <Text style={styles.tagline}>Tanam, Tag, Tumbuh Bersama Bumi</Text>
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
            {/* Welcome Text */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Selamat Datang! 👋</Text>
              <Text style={styles.welcomeSubtitle}>
                Masuk untuk melanjutkan aksi hijau
              </Text>
            </View>

            {/* Error Message */}
            {error && (
              <Animated.View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'email' && styles.inputContainerFocused,
                errors.email && styles.inputContainerError,
              ]}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput
                  style={styles.input}
                  placeholder="nama@email.com"
                  placeholderTextColor={COLORS.TEXT_DISABLED}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorMessage}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'password' && styles.inputContainerFocused,
                errors.password && styles.inputContainerError,
              ]}>
                <Text style={styles.inputIcon}>🔐</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan password"
                  placeholderTextColor={COLORS.TEXT_DISABLED}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorMessage}>{errors.password}</Text>
              )}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <AnimatedPressable onPress={handleLogin} disabled={isLoading}>
              <LinearGradient
                colors={isLoading ? [COLORS.GRAY_400, COLORS.GRAY_500] : ['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Masuk</Text>
                    <Text style={styles.loginButtonIcon}>→</Text>
                  </>
                )}
              </LinearGradient>
            </AnimatedPressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau masuk dengan</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <View style={styles.socialRow}>
              <AnimatedPressable style={styles.socialButton}>
                <Text style={styles.socialIcon}>🔵</Text>
                <Text style={styles.socialText}>Google</Text>
              </AnimatedPressable>
              <AnimatedPressable style={styles.socialButton}>
                <Text style={styles.socialIcon}>📱</Text>
                <Text style={styles.socialText}>Phone</Text>
              </AnimatedPressable>
            </View>

            {/* Register Link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Belum punya akun? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Daftar Sekarang</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Demo Hint */}
          <AnimatedPressable onPress={fillDemoCredentials}>
            <View style={styles.demoCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                style={styles.demoCardGradient}
              >
                <Text style={styles.demoIcon}>💡</Text>
                <View style={styles.demoTextContainer}>
                  <Text style={styles.demoTitle}>Coba Akun Demo</Text>
                  <Text style={styles.demoCredentials}>Tap untuk auto-fill</Text>
                </View>
                <Text style={styles.demoArrow}>→</Text>
              </LinearGradient>
            </View>
          </AnimatedPressable>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#059669',
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
    top: height * 0.3,
    left: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  decorCircle3: {
    position: 'absolute',
    bottom: 100,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  floatingLeaf1: {
    position: 'absolute',
    top: 120,
    right: 40,
    fontSize: 28,
    opacity: 0.6,
  },
  floatingLeaf2: {
    position: 'absolute',
    top: 200,
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
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoBg: {
    width: 88,
    height: 88,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoIcon: {
    fontSize: 44,
  },
  appName: {
    fontSize: 32,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: 'rgba(255,255,255,0.8)',
  },

  // Form Card
  formCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 28,
    padding: 28,
    ...SHADOWS.EXTRA_LARGE,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
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
  errorIcon: {
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
    marginBottom: 20,
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
    borderColor: '#10B981',
    backgroundColor: '#10B981' + '08',
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

  // Forgot Password
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    color: '#10B981',
  },

  // Login Button
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    marginBottom: 24,
    ...SHADOWS.GLOW_PRIMARY,
  },
  loginButtonText: {
    fontSize: 17,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
  },
  loginButtonIcon: {
    fontSize: 20,
    color: COLORS.WHITE,
    marginLeft: 8,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    color: COLORS.TEXT_TERTIARY,
    marginHorizontal: 16,
  },

  // Social
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: COLORS.GRAY_50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  socialText: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },

  // Register
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
  registerLink: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: '#10B981',
  },

  // Demo Card
  demoCard: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  demoCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  demoIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  demoTextContainer: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    color: COLORS.WHITE,
  },
  demoCredentials: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  demoArrow: {
    fontSize: 20,
    color: COLORS.WHITE,
  },

  bottomSpacing: {
    height: 40,
  },
});
