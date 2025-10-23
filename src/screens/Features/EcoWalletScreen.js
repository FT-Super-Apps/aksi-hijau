import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../constants/typography';

const { width, height } = Dimensions.get('window');

export default function EcoWalletScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('rewards');

  const walletData = {
    totalPoints: 3247,
    pointsThisMonth: 580,
    level: 'Eco Champion',
    nextLevel: 'Green Master',
    pointsToNextLevel: 753,
  };

  const pointsHistory = [
    {
      id: 1,
      title: 'Tanam Mahoni di Taman Hasanuddin',
      points: 50,
      type: 'earn',
      date: '2024-08-25',
      icon: '🌱',
    },
    {
      id: 2,
      title: 'Selesaikan Challenge: Zero Waste Weekend',
      points: 300,
      type: 'earn',
      date: '2024-08-24',
      icon: '♻️',
    },
    {
      id: 3,
      title: 'Tukar Voucher Grab',
      points: -500,
      type: 'spend',
      date: '2024-08-23',
      icon: '🎫',
    },
    {
      id: 4,
      title: 'Ajak 3 teman bergabung',
      points: 150,
      type: 'earn',
      date: '2024-08-22',
      icon: '👥',
    },
    {
      id: 5,
      title: 'Selesaikan Quiz: Jejak Karbon',
      points: 100,
      type: 'earn',
      date: '2024-08-21',
      icon: '📝',
    },
  ];

  const rewards = [
    {
      id: 1,
      title: 'Voucher Grab Rp 50.000',
      points: 500,
      stock: 25,
      category: 'Transport',
      image: 'https://via.placeholder.com/120x120/00A550/FFFFFF?text=Grab',
      partner: 'Grab',
    },
    {
      id: 2,
      title: '10 Bibit Pohon Gratis',
      points: 800,
      stock: 15,
      category: 'Planting',
      image: 'https://via.placeholder.com/120x120/4CAF50/FFFFFF?text=Bibit',
      partner: 'Kebun Bibit',
    },
    {
      id: 3,
      title: 'E-Voucher Tokopedia Rp 100.000',
      points: 1000,
      stock: 10,
      category: 'Shopping',
      image: 'https://via.placeholder.com/120x120/42B549/FFFFFF?text=Tokped',
      partner: 'Tokopedia',
    },
    {
      id: 4,
      title: 'Tumbler Eksklusif Aksi Hijau',
      points: 600,
      stock: 30,
      category: 'Merchandise',
      image: 'https://via.placeholder.com/120x120/2196F3/FFFFFF?text=Tumbler',
      partner: 'Aksi Hijau',
    },
    {
      id: 5,
      title: 'Sertifikat Digital Kontributor',
      points: 200,
      stock: 999,
      category: 'Certificate',
      image: 'https://via.placeholder.com/120x120/FF9800/FFFFFF?text=Cert',
      partner: 'Aksi Hijau',
    },
    {
      id: 6,
      title: 'Kaos Eco-Friendly Limited Edition',
      points: 750,
      stock: 20,
      category: 'Merchandise',
      image: 'https://via.placeholder.com/120x120/9C27B0/FFFFFF?text=Shirt',
      partner: 'Aksi Hijau',
    },
  ];

  const badges = [
    { id: 1, name: 'Tree Planter', icon: '🌱', earned: true },
    { id: 2, name: 'Eco Warrior', icon: '⚔️', earned: true },
    { id: 3, name: 'Green Master', icon: '🥇', earned: false },
    { id: 4, name: 'Carbon Saver', icon: '🌍', earned: true },
    { id: 5, name: 'Waste Fighter', icon: '♻️', earned: true },
    { id: 6, name: 'Community Leader', icon: '👑', earned: false },
  ];

  const renderRewardCard = (reward) => (
    <TouchableOpacity key={reward.id} style={styles.rewardCard} activeOpacity={0.8}>
      <Image source={{ uri: reward.image }} style={styles.rewardImage} />

      <View style={styles.rewardContent}>
        <Text style={styles.rewardCategory}>{reward.category}</Text>
        <Text style={styles.rewardTitle}>{reward.title}</Text>
        <Text style={styles.rewardPartner}>by {reward.partner}</Text>

        <View style={styles.rewardFooter}>
          <View style={styles.rewardPoints}>
            <Text style={styles.rewardPointsIcon}>⭐</Text>
            <Text style={styles.rewardPointsText}>{reward.points} poin</Text>
          </View>
          <Text style={styles.rewardStock}>Stok: {reward.stock}</Text>
        </View>
      </View>

      <View style={styles.redeemButton}>
        <LinearGradient
          colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
          style={styles.redeemButtonGradient}
        >
          <Text style={styles.redeemButtonText}>Tukar</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const renderHistoryItem = (item) => (
    <View key={item.id} style={styles.historyItem}>
      <View style={styles.historyIconContainer}>
        <Text style={styles.historyIcon}>{item.icon}</Text>
      </View>

      <View style={styles.historyContent}>
        <Text style={styles.historyTitle}>{item.title}</Text>
        <Text style={styles.historyDate}>{item.date}</Text>
      </View>

      <Text style={[
        styles.historyPoints,
        { color: item.type === 'earn' ? COLORS.SUCCESS : COLORS.ERROR }
      ]}>
        {item.type === 'earn' ? '+' : ''}{item.points}
      </Text>
    </View>
  );

  const renderRewards = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Tukar Poin Anda 🎁</Text>
      {rewards.map(renderRewardCard)}
    </View>
  );

  const renderHistory = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Riwayat Poin</Text>
      <View style={styles.historyList}>
        {pointsHistory.map(renderHistoryItem)}
      </View>
    </View>
  );

  const renderBadges = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Koleksi Badge</Text>
      <View style={styles.badgesGrid}>
        {badges.map((badge) => (
          <View
            key={badge.id}
            style={[styles.badgeCard, !badge.earned && styles.badgeCardLocked]}
          >
            <LinearGradient
              colors={badge.earned ? [COLORS.PRIMARY, COLORS.PRIMARY_DARK] : [COLORS.GRAY_300, COLORS.GRAY_400]}
              style={styles.badgeGradient}
            >
              <Text style={[styles.badgeIcon, !badge.earned && styles.badgeIconLocked]}>
                {badge.icon}
              </Text>
              <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]}>
                {badge.name}
              </Text>
              {!badge.earned && (
                <View style={styles.lockOverlay}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              )}
            </LinearGradient>
          </View>
        ))}
      </View>
    </View>
  );

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

          <Text style={styles.headerTitle}>Eco Wallet</Text>

          <TouchableOpacity style={styles.historyButton}>
            <Text style={styles.historyIcon}>📊</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View>
              <Text style={styles.walletLabel}>Total Poin</Text>
              <Text style={styles.walletPoints}>{walletData.totalPoints.toLocaleString()}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{walletData.level}</Text>
            </View>
          </View>

          <View style={styles.walletDivider} />

          <View style={styles.walletStats}>
            <View style={styles.walletStat}>
              <Text style={styles.walletStatLabel}>Bulan Ini</Text>
              <Text style={styles.walletStatValue}>+{walletData.pointsThisMonth}</Text>
            </View>
            <View style={styles.walletStatDivider} />
            <View style={styles.walletStat}>
              <Text style={styles.walletStatLabel}>Level Berikutnya</Text>
              <Text style={styles.walletStatValue}>{walletData.nextLevel}</Text>
            </View>
          </View>

          <View style={styles.levelProgress}>
            <View style={styles.levelProgressBar}>
              <View style={[styles.levelProgressFill, { width: '67%' }]} />
            </View>
            <Text style={styles.levelProgressText}>
              {walletData.pointsToNextLevel} poin lagi untuk level berikutnya
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'rewards' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('rewards')}
        >
          <Text style={[styles.tabButtonText, selectedTab === 'rewards' && styles.tabButtonTextActive]}>
            🎁 Rewards
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'history' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('history')}
        >
          <Text style={[styles.tabButtonText, selectedTab === 'history' && styles.tabButtonTextActive]}>
            📜 Riwayat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'badges' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('badges')}
        >
          <Text style={[styles.tabButtonText, selectedTab === 'badges' && styles.tabButtonTextActive]}>
            🏅 Badge
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {selectedTab === 'rewards' && renderRewards()}
        {selectedTab === 'history' && renderHistory()}
        {selectedTab === 'badges' && renderBadges()}

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
    marginBottom: SPACING.MARGIN.LG,
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
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyIcon: {
    fontSize: 20,
  },

  // Wallet Card
  walletCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.XL,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.LG,
  },
  walletLabel: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 4,
  },
  walletPoints: {
    fontSize: 48,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  levelBadge: {
    backgroundColor: COLORS.PRIMARY + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelBadgeText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  walletDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginBottom: SPACING.MARGIN.LG,
  },
  walletStats: {
    flexDirection: 'row',
    marginBottom: SPACING.MARGIN.LG,
  },
  walletStat: {
    flex: 1,
  },
  walletStatLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 4,
  },
  walletStatValue: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  walletStatDivider: {
    width: 1,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: SPACING.MARGIN.LG,
  },
  levelProgress: {
    marginTop: SPACING.MARGIN.MD,
  },
  levelProgressBar: {
    height: 8,
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 4,
    marginBottom: SPACING.MARGIN.SM,
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
  },
  levelProgressText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
  },

  // Tab Selector
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingVertical: SPACING.PADDING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: COLORS.PRIMARY,
  },
  tabButtonText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  tabButtonTextActive: {
    color: COLORS.PRIMARY,
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.PADDING.XL,
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.LG,
  },

  // Reward Card
  rewardCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.MD,
    marginBottom: SPACING.MARGIN.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  rewardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: SPACING.MARGIN.MD,
  },
  rewardContent: {
    flex: 1,
  },
  rewardCategory: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: 4,
  },
  rewardTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  rewardPartner: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: SPACING.MARGIN.SM,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardPoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardPointsIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  rewardPointsText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  rewardStock: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  redeemButton: {
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  redeemButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  redeemButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // History
  historyList: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.SM,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.PADDING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.MD,
  },
  historyIcon: {
    fontSize: 20,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  historyPoints: {
    fontSize: FONT_SIZES.H5,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Badges
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.MARGIN.SM,
  },
  badgeCard: {
    width: (width - SPACING.PADDING.XL * 2 - SPACING.MARGIN.SM * 4) / 3,
    margin: SPACING.MARGIN.SM,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeGradient: {
    padding: SPACING.PADDING.LG,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
    position: 'relative',
  },
  badgeIcon: {
    fontSize: 40,
    marginBottom: SPACING.MARGIN.SM,
  },
  badgeIconLocked: {
    opacity: 0.5,
  },
  badgeName: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: COLORS.TEXT_DISABLED,
  },
  lockOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  lockIcon: {
    fontSize: 16,
  },

  bottomSpacing: {
    height: 80,
  },
});

