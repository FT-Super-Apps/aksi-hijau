import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../constants/typography';

const { width, height } = Dimensions.get('window');

export default function TreeDetailScreen({ navigation, route }) {
  const [selectedTab, setSelectedTab] = useState('info');

  // Mock tree data - would come from route params in real app
  const treeData = {
    id: 1,
    type: 'Mahoni',
    scientificName: 'Swietenia mahagoni',
    plantedDate: '15 Agustus 2024',
    planter: 'Ahmad Wijaya',
    location: 'Taman Hasanuddin',
    image: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Mahoni+Tree',
    healthStatus: 80,
    lastCareDate: '20 Agustus 2024',
    watering: 'Rutin',
    condition: 'Baik',
    height: '2.3 m',
    age: '12 hari',
    co2Absorbed: '15 kg',
    oxygenProduced: '11 kg'
  };

  const careHistory = [
    {
      id: 1,
      date: '20 Agustus 2024',
      activity: 'Penyiraman',
      notes: 'Disiram dengan 5 liter air',
      user: 'Ahmad Wijaya'
    },
    {
      id: 2,
      date: '18 Agustus 2024',
      activity: 'Pemupukan',
      notes: 'Diberi pupuk organik kompos',
      user: 'Komunitas Hijau'
    },
    {
      id: 3,
      date: '15 Agustus 2024',
      activity: 'Penanaman',
      notes: 'Bibit ditanam di lokasi yang tepat',
      user: 'Ahmad Wijaya'
    }
  ];

  const renderHealthProgress = () => {
    const segments = 10;
    const filledSegments = Math.floor((treeData.healthStatus / 100) * segments);

    return (
      <View style={styles.healthBar}>
        {Array.from({ length: segments }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.healthSegment,
              index < filledSegments ? styles.healthSegmentFilled : styles.healthSegmentEmpty
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} translucent />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Detail Pohon</Text>

          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreIcon}>⋯</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tree Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: treeData.image }} style={styles.treeImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageGradient}
          />
        </View>

        {/* Tree Info */}
        <View style={styles.infoContainer}>
          <View style={styles.basicInfo}>
            <Text style={styles.treeType}>
              {treeData.type} ({treeData.scientificName})
            </Text>
            <Text style={styles.plantedInfo}>
              Ditanam: {treeData.plantedDate}
            </Text>
            <Text style={styles.planterInfo}>
              Oleh: {treeData.planter}
            </Text>
            <Text style={styles.locationInfo}>
              Lokasi: {treeData.location}
            </Text>
          </View>

          {/* Health Status */}
          <View style={styles.healthSection}>
            <Text style={styles.sectionTitle}>Status Pertumbuhan:</Text>
            {renderHealthProgress()}
            <Text style={styles.healthPercentage}>
              {treeData.healthStatus}% Sehat
            </Text>
          </View>

          {/* Care Info */}
          <View style={styles.careSection}>
            <View style={styles.careRow}>
              <Text style={styles.careLabel}>Perawatan Terakhir:</Text>
              <Text style={styles.careValue}>{treeData.lastCareDate}</Text>
            </View>
            <View style={styles.careRow}>
              <Text style={styles.careLabel}>Penyiraman:</Text>
              <Text style={styles.careValue}>{treeData.watering}</Text>
            </View>
            <View style={styles.careRow}>
              <Text style={styles.careLabel}>Kondisi:</Text>
              <Text style={[styles.careValue, { color: COLORS.SUCCESS }]}>
                {treeData.condition}
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{treeData.height}</Text>
              <Text style={styles.statLabel}>Tinggi</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{treeData.age}</Text>
              <Text style={styles.statLabel}>Umur</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{treeData.co2Absorbed}</Text>
              <Text style={styles.statLabel}>CO₂ Diserap</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{treeData.oxygenProduced}</Text>
              <Text style={styles.statLabel}>O₂ Diproduksi</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonIcon}>📊</Text>
                <Text style={styles.actionButtonText}>Lihat Progress</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={[COLORS.ACCENT, COLORS.ACCENT + 'CC']}
                style={styles.actionButtonGradient}
              >
                <Text style={styles.actionButtonIcon}>📝</Text>
                <Text style={styles.actionButtonText}>Tambah Catatan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Care History */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Riwayat Perawatan</Text>

            {careHistory.map((care, index) => (
              <View key={care.id} style={styles.historyItem}>
                <View style={styles.historyDot} />
                <View style={styles.historyContent}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyActivity}>{care.activity}</Text>
                    <Text style={styles.historyDate}>{care.date}</Text>
                  </View>
                  <Text style={styles.historyNotes}>{care.notes}</Text>
                  <Text style={styles.historyUser}>oleh {care.user}</Text>
                </View>
                {index < careHistory.length - 1 && <View style={styles.historyLine} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: SPACING.PADDING.LG,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    flex: 1,
    textAlign: 'center',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  content: {
    flex: 1,
  },

  // Image Styles
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  treeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },

  // Info Styles
  infoContainer: {
    padding: SPACING.PADDING.XL,
  },
  basicInfo: {
    marginBottom: SPACING.MARGIN.XL,
  },
  treeType: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.SM,
  },
  plantedInfo: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 4,
  },
  planterInfo: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 4,
  },
  locationInfo: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },

  // Health Status Styles
  healthSection: {
    marginBottom: SPACING.MARGIN.XL,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.MD,
  },
  healthBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.GRAY_200,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.SM,
  },
  healthSegment: {
    flex: 1,
    marginRight: 1,
  },
  healthSegmentFilled: {
    backgroundColor: COLORS.SUCCESS,
  },
  healthSegmentEmpty: {
    backgroundColor: COLORS.GRAY_200,
  },
  healthPercentage: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.SUCCESS,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Care Section Styles
  careSection: {
    marginBottom: SPACING.MARGIN.XL,
  },
  careRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.PADDING.SM,
  },
  careLabel: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    flex: 1,
  },
  careValue: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    textAlign: 'right',
  },

  // Stats Grid Styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.MARGIN.XL,
    marginHorizontal: -SPACING.MARGIN.SM,
  },
  statCard: {
    width: (width - SPACING.PADDING.XL * 2 - SPACING.MARGIN.SM * 2) / 2,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    margin: SPACING.MARGIN.SM,
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
  },

  // Action Buttons Styles
  actionButtons: {
    flexDirection: 'row',
    marginBottom: SPACING.MARGIN.XL,
    marginHorizontal: -SPACING.MARGIN.SM,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: SPACING.MARGIN.SM,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.PADDING.LG,
    paddingHorizontal: SPACING.PADDING.MD,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.MARGIN.SM,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // History Styles
  historySection: {
    marginBottom: SPACING.MARGIN.XL,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: SPACING.MARGIN.LG,
    position: 'relative',
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.PRIMARY,
    marginRight: SPACING.MARGIN.MD,
    marginTop: 6,
  },
  historyLine: {
    position: 'absolute',
    left: 5,
    top: 20,
    bottom: -SPACING.MARGIN.LG,
    width: 2,
    backgroundColor: COLORS.BORDER,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyActivity: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  historyDate: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  historyNotes: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 4,
  },
  historyUser: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    fontStyle: 'italic',
  },

  bottomSpacing: {
    height: 40,
  },
});
