import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../constants/typography';

export default function TreeIDCard({ treeData }) {
  const {
    id = 'TRE-001',
    type = 'Mahoni',
    scientificName = 'Swietenia mahagoni',
    plantedDate = '2024-08-25',
    planter = 'Ahmad Wijaya',
    location = 'Taman Hasanuddin, Makassar',
    coordinates = { lat: -5.147665, lng: 119.432732 },
    photo = 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Tree',
    qrCode = 'https://via.placeholder.com/100x100/000000/FFFFFF?text=QR',
    co2Absorbed = '21.77 kg/tahun',
    height = '2.5 m',
    age = '15 hari',
  } = treeData || {};

  return (
    <View style={styles.container}>
      {/* Card Header */}
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
        style={styles.cardHeader}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>🌳 AKSI HIJAU</Text>
            <Text style={styles.headerSubtitle}>Tree ID Card</Text>
          </View>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>#{id}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tree Photo */}
      <View style={styles.photoSection}>
        <Image source={{ uri: photo }} style={styles.treePhoto} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)']}
          style={styles.photoOverlay}
        >
          <View style={styles.photoInfo}>
            <Text style={styles.treeName}>{type}</Text>
            <Text style={styles.scientificName}>{scientificName}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Main Info */}
      <View style={styles.mainInfo}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📅</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Ditanam</Text>
              <Text style={styles.infoValue}>{plantedDate}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>👤</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Penanam</Text>
              <Text style={styles.infoValue}>{planter}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Lokasi</Text>
              <Text style={styles.infoValue} numberOfLines={2}>{location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.coordinatesRow}>
          <Text style={styles.coordinatesText}>
            🧭 {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🌍</Text>
          <Text style={styles.statValue}>{co2Absorbed}</Text>
          <Text style={styles.statLabel}>CO₂ Terserap</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📏</Text>
          <Text style={styles.statValue}>{height}</Text>
          <Text style={styles.statLabel}>Tinggi</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statValue}>{age}</Text>
          <Text style={styles.statLabel}>Umur</Text>
        </View>
      </View>

      {/* QR Code Section */}
      <View style={styles.qrSection}>
        <View style={styles.qrContainer}>
          <Image source={{ uri: qrCode }} style={styles.qrCode} />
        </View>
        <View style={styles.qrInfo}>
          <Text style={styles.qrTitle}>Scan untuk Detail</Text>
          <Text style={styles.qrDescription}>
            Scan QR code ini untuk melihat detail lengkap dan riwayat perawatan pohon
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <LinearGradient
          colors={[COLORS.PRIMARY + '10', COLORS.PRIMARY + '05']}
          style={styles.footerGradient}
        >
          <Text style={styles.footerText}>
            🌱 Terverifikasi oleh Aksi Hijau • aksi-hijau.id
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  // Header
  cardHeader: {
    padding: SPACING.PADDING.XL,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.9,
  },
  idBadge: {
    backgroundColor: COLORS.WHITE + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  idText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Photo
  photoSection: {
    height: 200,
    position: 'relative',
  },
  treePhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.PADDING.LG,
  },
  photoInfo: {
    alignItems: 'flex-start',
  },
  treeName: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  scientificName: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    fontStyle: 'italic',
    opacity: 0.9,
  },

  // Main Info
  mainInfo: {
    padding: SPACING.PADDING.XL,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.MARGIN.LG,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: SPACING.MARGIN.SM,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginBottom: SPACING.MARGIN.LG,
  },
  coordinatesRow: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.PADDING.MD,
    borderRadius: 12,
  },
  coordinatesText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
  },

  // Stats
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: SPACING.PADDING.XL,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: SPACING.PADDING.MD,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: SPACING.MARGIN.SM,
  },
  statValue: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
  },

  // QR Code
  qrSection: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: SPACING.PADDING.XL,
    alignItems: 'center',
  },
  qrContainer: {
    backgroundColor: COLORS.WHITE,
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  qrInfo: {
    flex: 1,
    marginLeft: SPACING.MARGIN.LG,
  },
  qrTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  qrDescription: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    lineHeight: 18,
  },

  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  footerGradient: {
    padding: SPACING.PADDING.LG,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    textAlign: 'center',
  },
});

