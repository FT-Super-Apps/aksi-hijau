import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../constants/typography';

const { width, height } = Dimensions.get('window');

export default function PhotoPreviewScreen({ route, navigation }) {
  const { photoData, formData } = route.params;
  const [isSaving, setIsSaving] = useState(false);

  const sharePhoto = async () => {
    try {
      const locationText = formData.coordinates
        ? `Lokasi: ${formData.location}\nKoordinat: ${formData.coordinates.latitude.toFixed(6)}, ${formData.coordinates.longitude.toFixed(6)}`
        : 'Lokasi: Tidak tersedia';

      await Share.share({
        message: `🌱 Aksi Hijau - Penanaman Pohon 🌱\n\nJenis Pohon: ${formData.treeType}\n${locationText}\nCatatan: ${formData.notes || 'Tidak ada catatan'}\nWaktu: ${new Date(photoData.timestamp).toLocaleString('id-ID')}\n\n#AksiHijau #PenanamanPohon #Lingkungan`,
        url: photoData.uri,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const uploadToServer = async () => {
    try {
      setIsSaving(true);

      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const locationInfo = formData.coordinates
        ? `\nLokasi: ${formData.location}\nKoordinat: ${formData.coordinates.latitude.toFixed(6)}, ${formData.coordinates.longitude.toFixed(6)}`
        : '\nLokasi: Tidak tersedia';

      Alert.alert(
        'Upload Berhasil!',
        `Foto pohon berhasil diupload ke server!${locationInfo}\nJenis Pohon: ${formData.treeType}\nWaktu: ${new Date(photoData.timestamp).toLocaleString('id-ID')}`,
        [
          {
            text: 'Kembali ke Beranda',
            onPress: () => navigation.navigate('MainTabs')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal mengupload foto');
      console.error('Upload error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const retakePhoto = () => {
    Alert.alert(
      'Ambil Foto Ulang?',
      'Apakah Anda yakin ingin mengambil foto ulang? Foto saat ini akan hilang.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya',
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview Foto</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={sharePhoto}
        >
          <Text style={styles.shareIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Photo Preview */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: photoData.uri }}
            style={styles.previewImage}
            resizeMode="cover"
          />

          {/* Photo Info Overlay */}
          <View style={styles.photoInfoOverlay}>
            <Text style={styles.photoInfoText}>
              📅 {new Date(photoData.timestamp).toLocaleDateString('id-ID')}
            </Text>
            <Text style={styles.photoInfoText}>
              🕐 {new Date(photoData.timestamp).toLocaleTimeString('id-ID')}
            </Text>
          </View>
        </View>

        {/* Verification Details */}
        <View style={styles.verificationSection}>
          <Text style={styles.sectionTitle}>📋 Detail Verifikasi</Text>

          <View style={styles.verificationCard}>
            <View style={styles.verificationItem}>
              <Text style={styles.verificationIcon}>🌳</Text>
              <View style={styles.verificationContent}>
                <Text style={styles.verificationLabel}>Jenis Pohon</Text>
                <Text style={styles.verificationValue}>{formData.treeType}</Text>
              </View>
            </View>

            <View style={styles.verificationItem}>
              <Text style={styles.verificationIcon}>📍</Text>
              <View style={styles.verificationContent}>
                <Text style={styles.verificationLabel}>Lokasi</Text>
                <Text style={styles.verificationValue}>{formData.location}</Text>
                {formData.coordinates && (
                  <Text style={styles.coordinatesText}>
                    Lat: {formData.coordinates.latitude.toFixed(6)}, Lng: {formData.coordinates.longitude.toFixed(6)}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.verificationItem}>
              <Text style={styles.verificationIcon}>
                {formData.coordinates ? '✅' : '❌'}
              </Text>
              <View style={styles.verificationContent}>
                <Text style={styles.verificationLabel}>Status GPS</Text>
                <Text style={[
                  styles.verificationValue,
                  { color: formData.coordinates ? COLORS.SUCCESS : COLORS.ERROR }
                ]}>
                  {formData.coordinates ? 'Terverifikasi' : 'Tidak Tersedia'}
                </Text>
              </View>
            </View>

            {formData.notes && (
              <View style={styles.verificationItem}>
                <Text style={styles.verificationIcon}>📝</Text>
                <View style={styles.verificationContent}>
                  <Text style={styles.verificationLabel}>Catatan</Text>
                  <Text style={styles.verificationValue}>{formData.notes}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Photo Metadata */}
        <View style={styles.metadataSection}>
          <Text style={styles.sectionTitle}>🔍 Metadata Foto</Text>

          <View style={styles.metadataCard}>
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Resolusi:</Text>
              <Text style={styles.metadataValue}>
                {photoData.width} x {photoData.height}
              </Text>
            </View>

            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Ukuran File:</Text>
              <Text style={styles.metadataValue}>
                {photoData.exif && photoData.exif.FileSize
                  ? `${(photoData.exif.FileSize / 1024 / 1024).toFixed(2)} MB`
                  : 'Tidak tersedia'
                }
              </Text>
            </View>

            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Timestamp:</Text>
              <Text style={styles.metadataValue}>
                {new Date(photoData.timestamp).toISOString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.secondaryButton]}
          onPress={retakePhoto}
          disabled={isSaving}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.secondaryButtonIcon}>�</Text>
            <Text style={styles.secondaryButtonText}>Ambil Ulang</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, isSaving && styles.primaryButtonDisabled]}
          onPress={uploadToServer}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isSaving
              ? [COLORS.GRAY_300, COLORS.GRAY_400]
              : [COLORS.PRIMARY, COLORS.PRIMARY_DARK]
            }
            style={styles.primaryButtonGradient}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.primaryButtonIcon}>
                {isSaving ? '⏳' : '🚀'}
              </Text>
              <Text style={[styles.primaryButtonText, isSaving && styles.primaryButtonTextDisabled]}>
                {isSaving ? 'Mengupload...' : 'Selesai'}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: SPACING.PADDING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY_200,
  },
  backButton: {
    padding: SPACING.PADDING.SM,
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.PRIMARY,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    flex: 1,
    textAlign: 'center',
  },
  shareButton: {
    padding: SPACING.PADDING.SM,
  },
  shareIcon: {
    fontSize: 20,
  },

  scrollContainer: {
    flex: 1,
  },

  // Photo Preview Styles
  photoContainer: {
    position: 'relative',
    margin: SPACING.MARGIN.LG,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewImage: {
    width: '100%',
    height: 300,
  },
  photoInfoOverlay: {
    position: 'absolute',
    top: SPACING.PADDING.MD,
    right: SPACING.PADDING.MD,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: SPACING.PADDING.SM,
    paddingVertical: SPACING.PADDING.XS,
  },
  photoInfoText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
  },

  // Section Styles
  verificationSection: {
    marginHorizontal: SPACING.MARGIN.LG,
    marginBottom: SPACING.MARGIN.LG,
  },
  metadataSection: {
    marginHorizontal: SPACING.MARGIN.LG,
    marginBottom: SPACING.MARGIN.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H6,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.MD,
  },

  // Verification Card Styles
  verificationCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.PADDING.LG,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.MARGIN.MD,
  },
  verificationIcon: {
    fontSize: 20,
    marginRight: SPACING.MARGIN.MD,
    marginTop: 2,
  },
  verificationContent: {
    flex: 1,
  },
  verificationLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    marginBottom: 2,
  },
  verificationValue: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  coordinatesText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    marginTop: 2,
  },

  // Metadata Card Styles
  metadataCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.PADDING.LG,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.SM,
  },
  metadataLabel: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
  },
  metadataValue: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Action Buttons Styles
  actionButtonsContainer: {
    padding: SPACING.PADDING.XL,
    paddingTop: SPACING.PADDING.LG,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_100,
    gap: SPACING.MARGIN.MD,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: COLORS.GRAY_50,
    borderRadius: 16,
    paddingVertical: SPACING.PADDING.LG,
    paddingHorizontal: SPACING.PADDING.LG,
    borderWidth: 1.5,
    borderColor: COLORS.GRAY_200,
    marginBottom: SPACING.MARGIN.MD,
    minHeight: 58,
  },
  secondaryButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.MARGIN.SM,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    letterSpacing: 0.3,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  primaryButtonDisabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryButtonGradient: {
    paddingVertical: SPACING.PADDING.XL,
    paddingHorizontal: SPACING.PADDING.LG,
    minHeight: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.MARGIN.SM,
  },
  primaryButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    letterSpacing: 0.5,
  },
  primaryButtonTextDisabled: {
    opacity: 0.8,
  },
});
