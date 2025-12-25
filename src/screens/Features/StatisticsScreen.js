/**
 * Statistics Screen - Tampilkan statistik dan daftar pohon pengguna
 * @module screens/Features/StatisticsScreen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useTreeStore, TREE_TYPES } from '../../store/treeStore';
import { useUserStore } from '../../store/userStore';

const { width } = Dimensions.get('window');

export default function StatisticsScreen({ navigation }) {
  const { myTrees, calculateTotalCO2 } = useTreeStore();
  const { stats } = useUserStore();

  const totalCO2 = calculateTotalCO2();

  const getTreeTypeInfo = (typeId) => {
    return TREE_TYPES.find(t => t.id === typeId) || TREE_TYPES.find(t => t.id === 'other');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return formatDate(dateString);
  };

  // Group trees by type for chart
  const treesByType = TREE_TYPES.map(type => ({
    ...type,
    count: myTrees.filter(t => t.type === type.id).length,
  })).filter(t => t.count > 0);

  const renderTreeCard = ({ item }) => {
    const treeType = getTreeTypeInfo(item.type);

    return (
      <TouchableOpacity
        style={styles.treeCard}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('TreeDetail', { treeId: item.id })}
      >
        <View style={styles.treeCardContent}>
          {item.photos && item.photos.length > 0 ? (
            <Image 
              source={{ uri: item.photos[0].uri }} 
              style={styles.treeImage}
            />
          ) : (
            <View style={styles.treeImagePlaceholder}>
              <Text style={styles.treePlaceholderIcon}>{treeType?.icon || '🌳'}</Text>
            </View>
          )}

          <View style={styles.treeInfo}>
            <View style={styles.treeHeader}>
              <Text style={styles.treeName}>{item.typeName || treeType?.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
              </View>
            </View>

            <Text style={styles.treeLocation}>📍 {item.location?.name || 'Lokasi tidak diketahui'}</Text>
            <Text style={styles.treeDate}>🗓️ {formatTimeAgo(item.createdAt)}</Text>

            <View style={styles.treeStats}>
              <View style={styles.treeStat}>
                <Text style={styles.treeStatIcon}>📸</Text>
                <Text style={styles.treeStatValue}>{item.photos?.length || 0}</Text>
              </View>
              <View style={styles.treeStat}>
                <Text style={styles.treeStatIcon}>🌍</Text>
                <Text style={styles.treeStatValue}>{treeType?.co2PerYear || 21} kg/thn</Text>
              </View>
            </View>
          </View>

          <Text style={styles.treeArrow}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return COLORS.SUCCESS + '20';
      case 'needs_care':
        return COLORS.WARNING + '20';
      case 'growing':
        return COLORS.INFO + '20';
      default:
        return COLORS.GRAY_200;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'healthy':
        return '🌿 Sehat';
      case 'needs_care':
        return '💧 Perlu Siram';
      case 'growing':
        return '🌱 Tumbuh';
      default:
        return '🌳';
    }
  };

  const renderTreeTypeBar = (item, maxCount) => (
    <View key={item.id} style={styles.chartBar}>
      <View style={styles.chartBarLabel}>
        <Text style={styles.chartIcon}>{item.icon}</Text>
        <Text style={styles.chartName}>{item.name}</Text>
      </View>
      <View style={styles.chartBarContainer}>
        <View 
          style={[
            styles.chartBarFill, 
            { width: `${(item.count / maxCount) * 100}%` }
          ]} 
        />
        <Text style={styles.chartBarCount}>{item.count}</Text>
      </View>
    </View>
  );

  const maxTreeCount = Math.max(...treesByType.map(t => t.count), 1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistik Saya</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <LinearGradient
              colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
              style={styles.summaryGradient}
            >
              <Text style={styles.summaryIcon}>🌳</Text>
              <Text style={styles.summaryValue}>{stats.totalTrees}</Text>
              <Text style={styles.summaryLabel}>Total Pohon</Text>
            </LinearGradient>
          </View>

          <View style={styles.summaryCard}>
            <LinearGradient
              colors={[COLORS.SUCCESS, COLORS.SUCCESS + 'CC']}
              style={styles.summaryGradient}
            >
              <Text style={styles.summaryIcon}>🌍</Text>
              <Text style={styles.summaryValue}>{totalCO2.toFixed(1)}</Text>
              <Text style={styles.summaryLabel}>kg CO₂ Diserap</Text>
            </LinearGradient>
          </View>

          <View style={styles.summaryCard}>
            <LinearGradient
              colors={[COLORS.ACCENT, COLORS.ACCENT + 'CC']}
              style={styles.summaryGradient}
            >
              <Text style={styles.summaryIcon}>⭐</Text>
              <Text style={styles.summaryValue}>{stats.totalPoints}</Text>
              <Text style={styles.summaryLabel}>Total Poin</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Trees by Type Chart */}
        {treesByType.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jenis Pohon 📊</Text>
            <View style={styles.chartCard}>
              {treesByType.map(item => renderTreeTypeBar(item, maxTreeCount))}
            </View>
          </View>
        )}

        {/* My Trees List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pohon Saya 🌱</Text>
            <Text style={styles.treeCount}>{myTrees.length} pohon</Text>
          </View>

          {myTrees.length > 0 ? (
            myTrees.map((tree) => renderTreeCard({ item: tree }))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🌱</Text>
              <Text style={styles.emptyTitle}>Belum Ada Pohon</Text>
              <Text style={styles.emptyText}>
                Mulai dokumentasikan pohon yang Anda tanam untuk melacak kontribusi Anda
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('Camera')}
              >
                <LinearGradient
                  colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                  style={styles.addButtonGradient}
                >
                  <Text style={styles.addButtonText}>📷 Tambah Pohon</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Impact Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dampak Lingkungan 🌍</Text>
          <View style={styles.impactCard}>
            <View style={styles.impactItem}>
              <View style={styles.impactIconContainer}>
                <Text style={styles.impactIcon}>🌳</Text>
              </View>
              <View style={styles.impactInfo}>
                <Text style={styles.impactValue}>{stats.totalTrees} pohon</Text>
                <Text style={styles.impactLabel}>telah Anda tanam</Text>
              </View>
            </View>

            <View style={styles.impactDivider} />

            <View style={styles.impactItem}>
              <View style={styles.impactIconContainer}>
                <Text style={styles.impactIcon}>💨</Text>
              </View>
              <View style={styles.impactInfo}>
                <Text style={styles.impactValue}>{totalCO2.toFixed(1)} kg CO₂</Text>
                <Text style={styles.impactLabel}>akan terserap per tahun</Text>
              </View>
            </View>

            <View style={styles.impactDivider} />

            <View style={styles.impactItem}>
              <View style={styles.impactIconContainer}>
                <Text style={styles.impactIcon}>🚗</Text>
              </View>
              <View style={styles.impactInfo}>
                <Text style={styles.impactValue}>{(totalCO2 / 0.21).toFixed(0)} km</Text>
                <Text style={styles.impactLabel}>setara emisi berkendara</Text>
              </View>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: SPACING.PADDING.LG,
    paddingHorizontal: SPACING.PADDING.LG,
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
    fontSize: 20,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H5,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.PADDING.LG,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginTop: SPACING.MARGIN.LG,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: SPACING.PADDING.MD,
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: SPACING.MARGIN.XS,
  },
  summaryValue: {
    fontSize: FONT_SIZES.H5,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.TINY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    color: COLORS.WHITE,
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    marginTop: SPACING.MARGIN.XL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MARGIN.MD,
  },
  treeCount: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },
  chartCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chartBar: {
    marginBottom: SPACING.MARGIN.MD,
  },
  chartBarLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.XS,
  },
  chartIcon: {
    fontSize: 18,
    marginRight: SPACING.MARGIN.SM,
  },
  chartName: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },
  chartBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    backgroundColor: COLORS.GRAY_100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
  },
  chartBarCount: {
    position: 'absolute',
    right: 12,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  treeCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    marginBottom: SPACING.MARGIN.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  treeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.PADDING.MD,
  },
  treeImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  treeImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  treePlaceholderIcon: {
    fontSize: 32,
  },
  treeInfo: {
    flex: 1,
    marginLeft: SPACING.MARGIN.MD,
  },
  treeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  treeName: {
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: FONT_SIZES.TINY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  treeLocation: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  treeDate: {
    fontSize: FONT_SIZES.TINY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_DISABLED,
    marginBottom: SPACING.MARGIN.SM,
  },
  treeStats: {
    flexDirection: 'row',
    gap: SPACING.MARGIN.MD,
  },
  treeStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  treeStatIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  treeStatValue: {
    fontSize: FONT_SIZES.TINY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },
  treeArrow: {
    fontSize: 24,
    color: COLORS.TEXT_DISABLED,
  },
  emptyState: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.XL,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: SPACING.MARGIN.LG,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.H5,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MARGIN.SM,
  },
  emptyText: {
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.MARGIN.XL,
    lineHeight: 22,
  },
  addButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: SPACING.PADDING.MD,
    paddingHorizontal: SPACING.PADDING.XL,
  },
  addButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
  },
  impactCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.PADDING.SM,
  },
  impactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.LG,
  },
  impactIcon: {
    fontSize: 24,
  },
  impactInfo: {
    flex: 1,
  },
  impactValue: {
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.PRIMARY,
  },
  impactLabel: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
  impactDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: SPACING.MARGIN.SM,
  },
  bottomSpacing: {
    height: 40,
  },
});
