import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Mock user data
  const userData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@ecounity.com',
    profileImage: 'https://via.placeholder.com/120x120/549B79/FFFFFF?text=SJ',
    level: 'Eco Champion',
    badge: '🏆',
    joinDate: 'Bergabung sejak Januari 2024',
    location: 'Jakarta, Indonesia',
    totalPoints: 2850,
    rank: 15,
    plantsGrown: 47,
    co2Saved: 680,
    wasteRecycled: 28
  };

  const achievements = [
    { id: 1, title: 'Tree Lover', icon: '🌳', description: 'Tanam 50 pohon', progress: 94, earned: true },
    { id: 2, title: 'Eco Warrior', icon: '⚔️', description: 'Complete 100 misi', progress: 75, earned: true },
    { id: 3, title: 'Green Master', icon: '🥇', description: 'Hemat 1000kg CO₂', progress: 68, earned: false },
    { id: 4, title: 'Recycle King', icon: '♻️', description: 'Daur ulang 50kg sampah', progress: 56, earned: false }
  ];

  const menuItems = [
    {
      id: 1,
      title: 'Riwayat Aktivitas',
      subtitle: 'Lihat semua kontribusi Anda',
      icon: '📊',
      color: COLORS.PRIMARY,
      hasArrow: true
    },
    {
      id: 2,
      title: 'Sertifikat & Badge',
      subtitle: 'Koleksi pencapaian Anda',
      icon: '🏅',
      color: COLORS.ACCENT,
      hasArrow: true
    },
    {
      id: 3,
      title: 'Undang Teman',
      subtitle: 'Ajak teman bergabung',
      icon: '👥',
      color: COLORS.SUCCESS,
      hasArrow: true
    },
    {
      id: 4,
      title: 'Pengaturan',
      subtitle: 'Kelola akun dan preferensi',
      icon: '⚙️',
      color: COLORS.SECONDARY,
      hasArrow: true
    }
  ];

  const renderAchievement = (achievement) => (
    <View key={achievement.id} style={styles.achievementCard}>
      <LinearGradient
        colors={achievement.earned ? ['#4CAF50', '#45a049'] : [COLORS.GRAY_200, COLORS.GRAY_100]}
        style={styles.achievementGradient}
      >
        <Text style={[styles.achievementIcon, { opacity: achievement.earned ? 1 : 0.5 }]}>
          {achievement.icon}
        </Text>
        <Text style={[styles.achievementTitle, { color: achievement.earned ? COLORS.WHITE : COLORS.TEXT_SECONDARY }]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, { color: achievement.earned ? COLORS.WHITE : COLORS.TEXT_DISABLED }]}>
          {achievement.description}
        </Text>
        {!achievement.earned && (
          <View style={styles.achievementProgress}>
            <View style={styles.achievementProgressBar}>
              <View style={[styles.achievementProgressFill, { width: `${achievement.progress}%` }]} />
            </View>
            <Text style={styles.achievementProgressText}>{achievement.progress}%</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  const renderMenuItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
        <Text style={styles.menuIconText}>{item.icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      {item.hasArrow && (
        <Text style={styles.menuArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} translucent />

      {/* Enhanced Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK, COLORS.PRIMARY_DARK]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <View style={styles.headerContent}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <Text style={styles.headerTitle}>Profil Saya</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Info */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeIcon}>{userData.badge}</Text>
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{userData.name}</Text>
                <Text style={styles.userEmail}>{userData.email}</Text>
                <View style={styles.levelContainer}>
                  <Text style={styles.userLevel}>{userData.level}</Text>
                </View>
                <Text style={styles.joinDate}>{userData.joinDate}</Text>
                <Text style={styles.location}>📍 {userData.location}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Curved Bottom */}
        <View style={styles.curvedBottom} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData.totalPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Poin</Text>
            <Text style={styles.statIcon}>⭐</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>#{userData.rank}</Text>
            <Text style={styles.statLabel}>Peringkat</Text>
            <Text style={styles.statIcon}>🏆</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userData.plantsGrown}</Text>
            <Text style={styles.statLabel}>Pohon</Text>
            <Text style={styles.statIcon}>🌳</Text>
          </View>
        </View>

        {/* Impact Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dampak Kontribusi 🌍</Text>
          <View style={styles.impactCard}>
            <LinearGradient
              colors={[COLORS.PRIMARY + '10', COLORS.BACKGROUND]}
              style={styles.impactGradient}
            >
              <View style={styles.impactRow}>
                <View style={styles.impactItem}>
                  <Text style={styles.impactIcon}>🌱</Text>
                  <Text style={styles.impactValue}>{userData.plantsGrown}</Text>
                  <Text style={styles.impactLabel}>Pohon Ditanam</Text>
                </View>
                <View style={styles.impactItem}>
                  <Text style={styles.impactIcon}>🌍</Text>
                  <Text style={styles.impactValue}>{userData.co2Saved}kg</Text>
                  <Text style={styles.impactLabel}>CO₂ Diserap</Text>
                </View>
                <View style={styles.impactItem}>
                  <Text style={styles.impactIcon}>♻️</Text>
                  <Text style={styles.impactValue}>{userData.wasteRecycled}kg</Text>
                  <Text style={styles.impactLabel}>Sampah Didaur</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pencapaian 🏅</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsScrollContainer}
          >
            {achievements.map(renderAchievement)}
          </ScrollView>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengaturan ⚙️</Text>

          {/* Toggle Settings */}
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔔</Text>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Notifikasi</Text>
                  <Text style={styles.settingSubtitle}>Terima pemberitahuan aktivitas</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: COLORS.GRAY_300, true: COLORS.PRIMARY + '50' }}
                thumbColor={notificationsEnabled ? COLORS.PRIMARY : COLORS.GRAY_500}
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🌙</Text>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Mode Gelap</Text>
                  <Text style={styles.settingSubtitle}>Tampilan tema gelap</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: COLORS.GRAY_300, true: COLORS.PRIMARY + '50' }}
                thumbColor={darkModeEnabled ? COLORS.PRIMARY : COLORS.GRAY_500}
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
              />
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu 📱</Text>
          <View style={styles.menuContainer}>
            {menuItems.map(renderMenuItem)}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
            <LinearGradient
              colors={[COLORS.ERROR, COLORS.ERROR + 'DD']}
              style={styles.logoutGradient}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Keluar dari Akun</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing for Tab Navigation */}
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

  // Header Styles (similar to HomeScreen)
  headerContainer: {
    position: 'relative',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.WHITE + '10',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.WHITE + '08',
  },
  headerContent: {
    zIndex: 2,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.XL,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  editButton: {
    padding: 8,
    backgroundColor: COLORS.WHITE + '15',
    borderRadius: 12,
  },
  editIcon: {
    fontSize: 18,
  },
  profileSection: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: SPACING.MARGIN.LG,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: COLORS.WHITE,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.ACCENT,
    borderWidth: 3,
    borderColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 18,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: FONT_SIZES.H3,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.8,
    marginBottom: SPACING.MARGIN.SM,
  },
  levelContainer: {
    backgroundColor: COLORS.WHITE + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: SPACING.MARGIN.SM,
  },
  userLevel: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  joinDate: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.7,
    marginBottom: 4,
  },
  location: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.7,
  },
  curvedBottom: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  // Content Styles
  content: {
    flex: 1,
    marginTop: -20,
  },
  contentContainer: {
    paddingTop: 30,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: 100, // Extra space for bottom tab navigation
  },
  section: {
    marginBottom: SPACING.MARGIN.XXXL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  seeAllText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.MARGIN.XXXL,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginBottom: SPACING.MARGIN.SM,
  },
  statIcon: {
    fontSize: 20,
  },

  // Impact Card
  impactCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  impactGradient: {
    padding: SPACING.PADDING.XL,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactItem: {
    alignItems: 'center',
    flex: 1,
  },
  impactIcon: {
    fontSize: 32,
    marginBottom: SPACING.MARGIN.SM,
  },
  impactValue: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    textAlign: 'center',
  },

  // Achievements
  achievementsScrollContainer: {
    paddingRight: SPACING.PADDING.XL,
  },
  achievementCard: {
    width: width * 0.4,
    marginRight: SPACING.MARGIN.LG,
    borderRadius: 16,
    overflow: 'hidden',
  },
  achievementGradient: {
    padding: SPACING.PADDING.LG,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: SPACING.MARGIN.SM,
  },
  achievementTitle: {
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
    marginBottom: SPACING.MARGIN.SM,
  },
  achievementProgress: {
    width: '100%',
    alignItems: 'center',
  },
  achievementProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.WHITE + '30',
    borderRadius: 2,
    marginBottom: 4,
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 2,
  },
  achievementProgressText: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Settings
  settingsCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.PADDING.SM,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: SPACING.MARGIN.LG,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: SPACING.MARGIN.SM,
  },

  // Menu
  menuContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.SM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.PADDING.LG,
    borderRadius: 16,
    marginBottom: SPACING.MARGIN.XS,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.LG,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  menuArrow: {
    fontSize: 20,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Logout Button
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.PADDING.LG,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: SPACING.MARGIN.SM,
  },
  logoutText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  bottomSpacing: {
    height: 80, // Increased spacing for better separation from bottom tabs
  },
});
