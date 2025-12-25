/**
 * Register Screen - Halaman registrasi pengguna baru
 * @module screens/Auth/RegisterScreen
 */

import React, { useState } from 'react';
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

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, isLoading, error, clearError } = useAuthStore();
  const { initializeFromAuth, initializeNewUser: initNewUserStats } = useUserStore();
  const { initializeNewUser: initNewUserTrees } = useTreeStore();
  const { initializeNewUser: initNewUserAchievements } = useAchievementStore();

  const updateFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nama minimal 3 karakter';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (formData.phone && !/^[0-9]{10,13}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (formData.password !== formData.confirmPassword) {
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

    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone,
      password: formData.password,
    });

    if (result.success) {
      const authUser = useAuthStore.getState().user;
      initializeFromAuth(authUser);
      
      // Initialize fresh data for new user
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

  const handleBack = () => {
    navigation.goBack();
  };

  const renderInputField = (label, key, placeholder, options = {}) => {
    const { icon, keyboardType, secureTextEntry, showToggle, isSecure } = options;

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputWrapper, errors[key] && styles.inputError]}>
          {icon && <Text style={styles.inputIcon}>{icon}</Text>}
          <Input
            placeholder={placeholder}
            value={formData[key]}
            onChangeText={(text) => updateFormData(key, text)}
            keyboardType={keyboardType || 'default'}
            autoCapitalize={key === 'email' ? 'none' : 'words'}
            secureTextEntry={secureTextEntry}
            style={styles.input}
          />
          {showToggle && (
            <TouchableOpacity
              onPress={() => {
                if (key === 'password') setShowPassword(!showPassword);
                else setShowConfirmPassword(!showConfirmPassword);
              }}
              style={styles.eyeButton}
            >
              <Text style={styles.eyeIcon}>{isSecure ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          )}
        </View>
        {errors[key] && <Text style={styles.fieldError}>{errors[key]}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />

      {/* Header with Gradient */}
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.logoIcon}>🌱</Text>
          <Text style={styles.welcomeText}>Buat Akun Baru</Text>
          <Text style={styles.subtitleText}>Bergabung dalam gerakan hijau</Text>
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

            {/* Name Input */}
            {renderInputField('Nama Lengkap', 'name', 'Masukkan nama lengkap', {
              icon: '👤',
            })}

            {/* Email Input */}
            {renderInputField('Email', 'email', 'Masukkan email', {
              icon: '📧',
              keyboardType: 'email-address',
            })}

            {/* Phone Input */}
            {renderInputField('Nomor Telepon (Opsional)', 'phone', 'Contoh: 081234567890', {
              icon: '📱',
              keyboardType: 'phone-pad',
            })}

            {/* Password Input */}
            {renderInputField('Password', 'password', 'Minimal 6 karakter', {
              icon: '🔒',
              secureTextEntry: !showPassword,
              showToggle: true,
              isSecure: !showPassword,
            })}

            {/* Confirm Password Input */}
            {renderInputField('Konfirmasi Password', 'confirmPassword', 'Ulangi password', {
              icon: '🔐',
              secureTextEntry: !showConfirmPassword,
              showToggle: true,
              isSecure: !showConfirmPassword,
            })}

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                Saya menyetujui{' '}
                <Text style={styles.termsLink}>Syarat & Ketentuan</Text>
                {' '}dan{' '}
                <Text style={styles.termsLink}>Kebijakan Privasi</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && <Text style={styles.fieldError}>{errors.terms}</Text>}

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              style={styles.registerButton}
            >
              <LinearGradient
                colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                style={styles.registerButtonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.registerButtonText}>Daftar Sekarang</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={handleBack}>
                <Text style={styles.loginLink}>Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>Keuntungan Bergabung 🌿</Text>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🌳</Text>
              <Text style={styles.benefitText}>Dokumentasi pohon yang kamu tanam</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🏆</Text>
              <Text style={styles.benefitText}>Kumpulkan poin dan achievements</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>👥</Text>
              <Text style={styles.benefitText}>Bergabung dengan komunitas hijau</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>📊</Text>
              <Text style={styles.benefitText}>Pantau kontribusi CO₂ yang terserap</Text>
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
    paddingBottom: 30,
    paddingHorizontal: SPACING.PADDING.XL,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: SPACING.PADDING.LG,
    zIndex: 10,
    padding: SPACING.PADDING.SM,
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 40,
    marginBottom: SPACING.MARGIN.SM,
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
    marginBottom: SPACING.MARGIN.LG,
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
    marginBottom: SPACING.MARGIN.MD,
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
  inputError: {
    borderColor: COLORS.ERROR,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.MARGIN.LG,
    marginTop: SPACING.MARGIN.SM,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    marginRight: SPACING.MARGIN.SM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  checkmark: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  registerButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.LG,
  },
  registerButtonGradient: {
    paddingVertical: SPACING.PADDING.LG,
    alignItems: 'center',
  },
  registerButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  loginLink: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  benefitsCard: {
    backgroundColor: COLORS.PRIMARY + '10',
    borderRadius: 20,
    padding: SPACING.PADDING.XL,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '20',
  },
  benefitsTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.PRIMARY_DARK,
    marginBottom: SPACING.MARGIN.LG,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.MD,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: SPACING.MARGIN.MD,
  },
  benefitText: {
    flex: 1,
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_PRIMARY,
  },
});

