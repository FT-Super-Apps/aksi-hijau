/**
 * Forgot Password Screen - Halaman reset password
 * @module screens/Auth/ForgotPasswordScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/atoms/Input';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const { forgotPassword, isLoading } = useAuthStore();

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email harus diisi');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format email tidak valid');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateEmail()) return;

    const result = await forgotPassword(email);

    if (result.success) {
      setEmailSent(true);
    } else {
      Alert.alert('Gagal', result.error || 'Terjadi kesalahan');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleResend = () => {
    setEmailSent(false);
    handleSubmit();
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />

        <LinearGradient
          colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
          style={styles.header}
        >
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.successContainer}>
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>📧</Text>
            <Text style={styles.successTitle}>Email Terkirim!</Text>
            <Text style={styles.successText}>
              Kami telah mengirim link reset password ke{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            <Text style={styles.instructionText}>
              Silakan cek inbox email Anda dan ikuti instruksi untuk mereset password.
            </Text>

            <TouchableOpacity onPress={handleBack} style={styles.backToLoginButton}>
              <LinearGradient
                colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Kembali ke Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
              <Text style={styles.resendText}>Tidak menerima email? Kirim ulang</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

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
          <Text style={styles.lockIcon}>🔐</Text>
          <Text style={styles.headerTitle}>Lupa Password?</Text>
          <Text style={styles.headerSubtitle}>
            Masukkan email Anda dan kami akan mengirim link untuk reset password
          </Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <View style={styles.formCard}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
              <Text style={styles.inputIcon}>📧</Text>
              <Input
                placeholder="Masukkan email terdaftar"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            {error ? <Text style={styles.fieldError}>{error}</Text> : null}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.submitButton}
          >
            <LinearGradient
              colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Kirim Link Reset</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity onPress={handleBack} style={styles.backToLogin}>
            <Text style={styles.backToLoginText}>← Kembali ke halaman login</Text>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Butuh Bantuan? 🤔</Text>
          <Text style={styles.helpText}>
            Jika Anda mengalami kesulitan, hubungi tim support kami di:
          </Text>
          <Text style={styles.helpEmail}>support@aksihijau.id</Text>
        </View>
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
    marginTop: SPACING.MARGIN.LG,
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: SPACING.MARGIN.MD,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H4,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
    marginBottom: SPACING.MARGIN.SM,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.WHITE,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.PADDING.MD,
  },
  formContainer: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: SPACING.PADDING.XL,
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
  fieldError: {
    color: COLORS.ERROR,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: SPACING.MARGIN.XS,
  },
  submitButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.LG,
  },
  buttonGradient: {
    paddingVertical: SPACING.PADDING.LG,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  backToLogin: {
    alignItems: 'center',
  },
  backToLoginText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  helpCard: {
    backgroundColor: COLORS.INFO + '10',
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.INFO,
    marginBottom: SPACING.MARGIN.SM,
  },
  helpText: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.MARGIN.SM,
  },
  helpEmail: {
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    color: COLORS.INFO,
  },

  // Success State Styles
  successContainer: {
    flex: 1,
    paddingHorizontal: SPACING.PADDING.XL,
    justifyContent: 'center',
  },
  successCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 24,
    padding: SPACING.PADDING.XL,
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: SPACING.MARGIN.LG,
  },
  successTitle: {
    fontSize: FONT_SIZES.H4,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.SUCCESS,
    marginBottom: SPACING.MARGIN.MD,
  },
  successText: {
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.MARGIN.SM,
  },
  emailText: {
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  instructionText: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.MARGIN.XL,
  },
  backToLoginButton: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.MD,
  },
  resendButton: {
    padding: SPACING.PADDING.SM,
  },
  resendText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
});

