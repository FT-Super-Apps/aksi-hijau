/**
 * Login Screen - Halaman login pengguna
 * @module screens/Auth/LoginScreen
 */

import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useTreeStore } from '../../store/treeStore';
import { useAchievementStore } from '../../store/achievementStore';
import Input from '../../components/atoms/Input';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, isLoading, error, clearError } = useAuthStore();
  const { initializeFromAuth, initializeWithDemoData, initializeNewUser: initNewUserStats } = useUserStore();
  const { initializeWithDemoData: initDemoTrees, initializeNewUser: initNewUserTrees } = useTreeStore();
  const { initializeWithDemoData: initDemoAchievements, initializeNewUser: initNewUserAchievements } = useAchievementStore();

  useEffect(() => {
    // Clear error when screen focuses
    const unsubscribe = navigation.addListener('focus', () => {
      clearError();
    });
    return unsubscribe;
  }, [navigation]);

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
      
      // Check if demo user (email: demo@aksihijau.id)
      const isDemoUser = email.toLowerCase() === 'demo@aksihijau.id';
      
      if (isDemoUser) {
        // Initialize with demo data
        initializeWithDemoData();
        initDemoTrees();
        initDemoAchievements();
      } else {
        // Check if returning user or new user based on ID
        // For now, treat all non-demo as new users
        initNewUserStats();
        initNewUserTrees();
        initNewUserAchievements();
      }
      // Navigation will be handled by AppNavigator based on auth state
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />

      {/* Header with Gradient */}
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.logoIcon}>🌱</Text>
          <Text style={styles.logoText}>Aksi Hijau</Text>
          <Text style={styles.welcomeText}>Selamat Datang Kembali!</Text>
          <Text style={styles.subtitleText}>Masuk untuk melanjutkan aksi hijau</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📧</Text>
                <Input
                  placeholder="Masukkan email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  error={errors.email}
                />
              </View>
              {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <Input
                  placeholder="Masukkan password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  error={errors.password}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={styles.loginButton}
            >
              <LinearGradient
                colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                style={styles.loginButtonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.loginButtonText}>Masuk</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>🔵</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>📱</Text>
                <Text style={styles.socialText}>Phone</Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Belum punya akun? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Daftar Sekarang</Text>
              </TouchableOpacity>
            </View>

            {/* Demo Hint */}
            <View style={styles.demoHint}>
              <Text style={styles.demoHintText}>
                💡 Demo: demo@aksihijau.id / demo123
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: SPACING.PADDING.XL,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 48,
    marginBottom: SPACING.MARGIN.SM,
  },
  logoText: {
    fontSize: FONT_SIZES.H3,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
    marginBottom: SPACING.MARGIN.MD,
  },
  welcomeText: {
    fontSize: FONT_SIZES.H4,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
    marginBottom: SPACING.MARGIN.XS,
  },
  subtitleText: {
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: SPACING.PADDING.XL,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  errorContainer: {
    backgroundColor: COLORS.ERROR + '15',
    borderRadius: 12,
    padding: SPACING.PADDING.MD,
    marginBottom: SPACING.MARGIN.LG,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: SPACING.MARGIN.LG,
  },
  label: {
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MARGIN.SM,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: SPACING.PADDING.MD,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: SPACING.MARGIN.SM,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  eyeButton: {
    padding: SPACING.PADDING.SM,
  },
  eyeIcon: {
    fontSize: 18,
  },
  fieldError: {
    color: COLORS.ERROR,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: SPACING.MARGIN.XS,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.MARGIN.LG,
  },
  forgotText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  loginButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.LG,
  },
  loginButtonGradient: {
    paddingVertical: SPACING.PADDING.LG,
    alignItems: 'center',
  },
  loginButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.LG,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  dividerText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginHorizontal: SPACING.MARGIN.MD,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.MARGIN.XL,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.GRAY_50,
    borderRadius: 12,
    paddingVertical: SPACING.PADDING.MD,
    marginHorizontal: SPACING.MARGIN.XS,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  socialIcon: {
    fontSize: 18,
    marginRight: SPACING.MARGIN.SM,
  },
  socialText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  registerLink: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  demoHint: {
    marginTop: SPACING.MARGIN.LG,
    backgroundColor: COLORS.PRIMARY + '10',
    borderRadius: 12,
    padding: SPACING.PADDING.MD,
  },
  demoHintText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    textAlign: 'center',
  },
});

