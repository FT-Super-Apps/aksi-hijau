/**
 * Photo Preview Screen - Preview dan simpan foto pohon yang diambil
 * @module screens/Features/PhotoPreviewScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useTreeStore, TREE_TYPES } from '../../store/treeStore';
import { useUserStore } from '../../store/userStore';
import { useAchievementStore } from '../../store/achievementStore';

export default function PhotoPreviewScreen({ navigation, route }) {
  const { photoData, formData } = route.params || {};
  const [isUploading, setIsUploading] = useState(false);

  const { addTree } = useTreeStore();
  const { incrementTrees, stats } = useUserStore();
  const { checkAchievements, incrementPhotos, updateDailyQuestProgress } = useAchievementStore();

  const getTreeTypeInfo = () => {
    const type = TREE_TYPES.find(t => 
      t.name.toLowerCase() === formData?.treeType?.toLowerCase()
    );
    return type || TREE_TYPES.find(t => t.id === 'other');
  };

  const handleUpload = async () => {
    setIsUploading(true);

    try {
      // Simulasi upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const treeType = getTreeTypeInfo();

      // Simpan pohon ke store
      const newTree = addTree({
        type: treeType.id,
        typeName: formData?.treeType || 'Lainnya',
        location: {
          latitude: photoData?.location?.latitude || 0,
          longitude: photoData?.location?.longitude || 0,
          name: photoData?.address || 'Lokasi tidak diketahui',
        },
        photo: photoData?.uri,
        notes: formData?.notes || '',
        userId: 'current-user', // Akan diganti dengan user ID dari auth store
      });

      // Update statistik user
      incrementTrees(1);
      incrementPhotos();

      // Update progress quest harian
      updateDailyQuestProgress('daily_trees', 1);
      updateDailyQuestProgress('daily_photos', 1);

      // Cek achievements baru
      const newStats = useUserStore.getState().stats;
      const newAchievements = checkAchievements(newStats);

      setIsUploading(false);

      // Tampilkan alert sukses
      if (newAchievements.length > 0) {
        Alert.alert(
          '🎉 Selamat!',
          `Pohon berhasil didokumentasikan!\n\nAnda mendapatkan achievement baru:\n${newAchievements.map(a => `${a.icon} ${a.name}`).join('\n')}\n\n+50 Poin!`,
          [
            {
              text: 'Lihat Pohon Saya',
              onPress: () => navigation.navigate('Profile'),
            },
            {
              text: 'Kembali',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      } else {
        Alert.alert(
          '✅ Berhasil!',
          `Pohon ${formData?.treeType || ''} berhasil didokumentasikan!\n\n+50 Poin`,
          [
            {
              text: 'Tambah Lagi',
              onPress: () => navigation.navigate('Camera'),
            },
            {
              text: 'Kembali',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      }
    } catch (error) {
      setIsUploading(false);
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan. Silakan coba lagi.');
    }
  };

  const handleRetake = () => {
    navigation.goBack();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const treeType = getTreeTypeInfo();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleRetake} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Preview Foto</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Preview */}
        <View style={styles.photoContainer}>
          {photoData?.uri ? (
            <Image source={{ uri: photoData.uri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.placeholderText}>📷</Text>
            </View>
          )}

          {/* Overlay Info */}
          <View style={styles.photoOverlay}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradientOverlay}
            >
              <View style={styles.overlayContent}>
                <Text style={styles.overlayIcon}>{treeType?.icon || '🌳'}</Text>
                <Text style={styles.overlayTitle}>{formData?.treeType || 'Pohon'}</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Verification Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>✅ Data Terverifikasi</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Text>🌳</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Jenis Pohon</Text>
              <Text style={styles.infoValue}>{formData?.treeType || '-'}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Text>📍</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Lokasi</Text>
              <Text style={styles.infoValue}>{photoData?.address || '-'}</Text>
              {photoData?.location && (
                <Text style={styles.coordinates}>
                  {photoData.location.latitude?.toFixed(6)}, {photoData.location.longitude?.toFixed(6)}
                </Text>
              )}
            </View>
            <View style={[styles.verifiedBadge, photoData?.location ? {} : styles.warningBadge]}>
              <Text style={styles.verifiedText}>{photoData?.location ? '✓' : '!'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Text>🕐</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Waktu Pengambilan</Text>
              <Text style={styles.infoValue}>{formatDate(photoData?.timestamp || new Date())}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          </View>

          {formData?.notes && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Text>📝</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Catatan</Text>
                  <Text style={styles.infoValue}>{formData.notes}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Points Preview Card */}
        <View style={styles.pointsCard}>
          <LinearGradient
            colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
            style={styles.pointsGradient}
          >
            <View style={styles.pointsContent}>
              <Text style={styles.pointsIcon}>⭐</Text>
              <View>
                <Text style={styles.pointsTitle}>Poin yang akan didapat</Text>
                <Text style={styles.pointsValue}>+50 Poin</Text>
              </View>
            </View>
            <View style={styles.co2Info}>
              <Text style={styles.co2Text}>
                🌍 Estimasi CO₂ terserap: {treeType?.co2PerYear || 21.77} kg/tahun
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Current Stats */}
        <View style={styles.statsPreview}>
          <Text style={styles.statsTitle}>Statistik Anda Setelah Upload</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalTrees + 1}</Text>
              <Text style={styles.statLabel}>Total Pohon</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalPoints + 50}</Text>
              <Text style={styles.statLabel}>Total Poin</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{(stats.co2Absorbed + (treeType?.co2PerYear || 21.77) * 0.1).toFixed(1)}</Text>
              <Text style={styles.statLabel}>kg CO₂</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={handleRetake} 
          style={styles.retakeButton}
          disabled={isUploading}
        >
          <Text style={styles.retakeText}>📷 Foto Ulang</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUpload}
          style={styles.uploadButton}
          disabled={isUploading}
        >
          <LinearGradient
            colors={isUploading ? [COLORS.GRAY_400, COLORS.GRAY_500] : [COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
            style={styles.uploadGradient}
          >
            {isUploading ? (
              <ActivityIndicator color={COLORS.WHITE} />
            ) : (
              <>
                <Text style={styles.uploadIcon}>✅</Text>
                <Text style={styles.uploadText}>Simpan</Text>
              </>
            )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING.PADDING.LG,
    paddingBottom: SPACING.PADDING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  title: {
    fontSize: FONT_SIZES.H5,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  photoContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.GRAY_200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 60,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradientOverlay: {
    padding: SPACING.PADDING.LG,
  },
  overlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayIcon: {
    fontSize: 32,
    marginRight: SPACING.MARGIN.MD,
  },
  overlayTitle: {
    fontSize: FONT_SIZES.H4,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
  },
  infoCard: {
    backgroundColor: COLORS.WHITE,
    margin: SPACING.MARGIN.LG,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.SUCCESS,
    marginBottom: SPACING.MARGIN.LG,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.PADDING.SM,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.MD,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  coordinates: {
    fontSize: FONT_SIZES.TINY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBadge: {
    backgroundColor: COLORS.WARNING,
  },
  verifiedText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: SPACING.MARGIN.SM,
  },
  pointsCard: {
    marginHorizontal: SPACING.MARGIN.LG,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.LG,
  },
  pointsGradient: {
    padding: SPACING.PADDING.LG,
  },
  pointsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIcon: {
    fontSize: 40,
    marginRight: SPACING.MARGIN.MD,
  },
  pointsTitle: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  pointsValue: {
    fontSize: FONT_SIZES.H4,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
  },
  co2Info: {
    marginTop: SPACING.MARGIN.MD,
    paddingTop: SPACING.PADDING.MD,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  co2Text: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  statsPreview: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SPACING.MARGIN.LG,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.LG,
  },
  statsTitle: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MARGIN.MD,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.H4,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.PRIMARY,
  },
  statLabel: {
    fontSize: FONT_SIZES.TINY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
  bottomSpacing: {
    height: 100,
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: SPACING.PADDING.LG,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.PADDING.LG,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    gap: SPACING.MARGIN.MD,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: COLORS.GRAY_100,
    borderRadius: 14,
    paddingVertical: SPACING.PADDING.MD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  uploadButton: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.PADDING.MD,
    gap: SPACING.MARGIN.SM,
  },
  uploadIcon: {
    fontSize: 18,
  },
  uploadText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
  },
});
