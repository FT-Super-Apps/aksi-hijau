/**
 * Profile Screen - Halaman profil pengguna dengan integrasi store
 * @module screens/MainTabs/ProfileScreen
 */

import React, { useState, useEffect } from 'react';
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
  Switch,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useTreeStore } from '../../store/treeStore';
import { useAchievementStore, ACHIEVEMENTS } from '../../store/achievementStore';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  // Store hooks
  const { user, logout } = useAuthStore();
  const { profile, stats, settings, updateSettings, resetUser } = useUserStore();
  const { myTrees } = useTreeStore();
  const { getAchievementDetails, initializeDailyQuests, getDailyQuestStatus } = useAchievementStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notifications);
  const [darkModeEnabled, setDarkModeEnabled] = useState(settings.darkMode);

  useEffect(() => {
    initializeDailyQuests();
  }, []);

  const achievements = getAchievementDetails();
  const dailyQuests = getDailyQuestStatus();

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Keluar dari Akun',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => {
            logout();
            resetUser();
          },
        },
      ]
    );
  };

  // Handle settings toggle
  const handleNotificationToggle = (value) => {
    setNotificationsEnabled(value);
    updateSettings({ notifications: value });
  };

  const handleDarkModeToggle = (value) => {
    setDarkModeEnabled(value);
    updateSettings({ darkMode: value });
  };

  // Menu items
  const menuItems = [
    {
      id: 1,
      title: 'Pohon Saya',
      subtitle: `${myTrees.length} pohon terdokumentasi`,
      icon: '🌱',
      color: COLORS.PRIMARY,
      onPress: () => navigation.navigate('Statistics'),
    },
    {
      id: 2,
      title: 'Pencapaian & Badge',
      subtitle: `${achievements.filter(a => a.isUnlocked).length}/${achievements.length} diraih`,
      icon: '🏅',
      color: COLORS.ACCENT,
      onPress: () => {},
    },
    {
      id: 3,
      title: 'Undang Teman',
      subtitle: 'Ajak teman bergabung',
      icon: '👥',
      color: COLORS.SUCCESS,
      onPress: () => {},
    },
    {
      id: 4,
      title: 'Lokasi RTH',
      subtitle: 'Lihat peta lokasi',
      icon: '📍',
      color: '#e67e22',
      onPress: () => navigation.navigate('Map'),
    },
    {
      id: 5,
      title: 'Eco Wallet',
      subtitle: `${stats.totalPoints} poin tersedia`,
      icon: '💰',
      color: COLORS.WARNING,
      onPress: () => navigation.navigate('EcoWallet'),
    },
  ];

  const renderAchievement = ({ item }) => (
    <View style={styles.achievementCard}>
      <LinearGradient
        colors={item.isUnlocked ? [COLORS.SUCCESS, COLORS.SUCCESS + 'CC'] : [COLORS.GRAY_200, COLORS.GRAY_100]}
        style={styles.achievementGradient}
      >
        <View style={[styles.achievementIconContainer, { opacity: item.isUnlocked ? 1 : 0.5 }]}>
          <Text style={styles.achievementIcon}>{item.icon}</Text>
        </View>
        <Text style={[styles.achievementTitle, { color: item.isUnlocked ? COLORS.WHITE : COLORS.TEXT_SECONDARY }]}>
          {item.name}
        </Text>
        {!item.isUnlocked && (
          <View style={styles.achievementProgress}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min((item.progress / item.requirement.count) * 100, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {item.progress}/{item.requirement.count}
            </Text>
          </View>
        )}
        {item.isUnlocked && item.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>BARU!</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  const renderDailyQuest = (quest, index) => (
    <View key={quest.id} style={styles.questItem}>
      <View style={styles.questInfo}>
        <Text style={styles.questIcon}>{quest.icon}</Text>
        <View style={styles.questText}>
          <Text style={styles.questTitle}>{quest.name}</Text>
          <Text style={styles.questProgress}>
            {quest.progress}/{quest.requirement.count}
          </Text>
        </View>
      </View>
      <View style={[styles.questStatus, quest.isCompleted && styles.questCompleted]}>
        <Text style={styles.questStatusText}>{quest.isCompleted ? '✓' : `+${quest.points}`}</Text>
      </View>
    </View>
  );

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      activeOpacity={0.7}
      onPress={item.onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
        <Text style={styles.menuIconText}>{item.icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} translucent />

      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK, COLORS.PRIMARY_DARK]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <View style={styles.headerContent}>
            <View style={styles.topBar}>
              <Text style={styles.headerTitle}>Profil Saya</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Image 
                  source={profile.avatar || require('../../../assets/home/avatar.png')} 
                  style={styles.profileImage} 
                />
                <View style={styles.levelBadge}>
                  <Text style={styles.levelNumber}>{stats.level}</Text>
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{profile.name || user?.name || 'Pengguna'}</Text>
                <Text style={styles.userEmail}>{profile.email || user?.email}</Text>
                <View style={styles.levelContainer}>
                  <Text style={styles.userLevel}>{stats.levelName}</Text>
                </View>
                <Text style={styles.location}>📍 {profile.location}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
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
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{stats.totalPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Poin</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🌳</Text>
            <Text style={styles.statValue}>{stats.totalTrees}</Text>
            <Text style={styles.statLabel}>Pohon</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* Impact Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dampak Kontribusi 🌍</Text>
          <View style={styles.impactCard}>
            <LinearGradient
              colors={[COLORS.PRIMARY + '15', COLORS.BACKGROUND]}
              style={styles.impactGradient}
            >
              <View style={styles.impactRow}>
                <View style={styles.impactItem}>
                  <Text style={styles.impactIcon}>🌱</Text>
                  <Text style={styles.impactValue}>{stats.totalTrees}</Text>
                  <Text style={styles.impactLabel}>Pohon Ditanam</Text>
                </View>
                <View style={styles.impactItem}>
                  <Text style={styles.impactIcon}>🌍</Text>
                  <Text style={styles.impactValue}>{stats.co2Absorbed.toFixed(1)}kg</Text>
                  <Text style={styles.impactLabel}>CO₂ Diserap</Text>
                </View>
                <View style={styles.impactItem}>
                  <Text style={styles.impactIcon}>🎯</Text>
                  <Text style={styles.impactValue}>{stats.todayProgress}/{stats.todayTarget}</Text>
                  <Text style={styles.impactLabel}>Target Hari Ini</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Daily Quests */}
        {dailyQuests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Misi Harian 🎯</Text>
            <View style={styles.questCard}>
              {dailyQuests.map(renderDailyQuest)}
            </View>
          </View>
        )}

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pencapaian 🏅</Text>
            <Text style={styles.achievementCount}>
              {achievements.filter(a => a.isUnlocked).length}/{achievements.length}
            </Text>
          </View>
          <FlatList
            data={achievements.slice(0, 6)}
            renderItem={renderAchievement}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsList}
          />
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengaturan ⚙️</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔔</Text>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Notifikasi</Text>
                  <Text style={styles.settingSubtitle}>Terima pemberitahuan</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: COLORS.GRAY_300, true: COLORS.PRIMARY + '50' }}
                thumbColor={notificationsEnabled ? COLORS.PRIMARY : COLORS.GRAY_500}
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🌙</Text>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Mode Gelap</Text>
                  <Text style={styles.settingSubtitle}>Tema gelap (Coming Soon)</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: COLORS.GRAY_300, true: COLORS.PRIMARY + '50' }}
                thumbColor={darkModeEnabled ? COLORS.PRIMARY : COLORS.GRAY_500}
                value={darkModeEnabled}
                onValueChange={handleDarkModeToggle}
              />
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu 📱</Text>
          <View style={styles.menuContainer}>
            {menuItems.map(renderMenuItem)}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <LinearGradient
              colors={[COLORS.ERROR, COLORS.ERROR + 'DD']}
              style={styles.logoutGradient}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Keluar dari Akun</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.WHITE,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.ACCENT,
    borderWidth: 3,
    borderColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    color: COLORS.WHITE,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.8,
    marginBottom: SPACING.MARGIN.SM,
  },
  levelContainer: {
    backgroundColor: COLORS.WHITE + '20',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: SPACING.MARGIN.SM,
  },
  userLevel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  location: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.8,
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
  content: {
    flex: 1,
    marginTop: -20,
  },
  contentContainer: {
    paddingTop: 30,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: 100,
  },
  section: {
    marginBottom: SPACING.MARGIN.XL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.MD,
  },
  achievementCount: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.MARGIN.XL,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.MD,
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: SPACING.MARGIN.XS,
  },
  statValue: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  statLabel: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
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
    padding: SPACING.PADDING.LG,
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
    fontSize: 28,
    marginBottom: SPACING.MARGIN.SM,
  },
  impactValue: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 2,
  },
  impactLabel: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    textAlign: 'center',
  },
  questCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.PADDING.SM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  questInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  questIcon: {
    fontSize: 24,
    marginRight: SPACING.MARGIN.MD,
  },
  questText: {
    flex: 1,
  },
  questTitle: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  questProgress: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  questStatus: {
    backgroundColor: COLORS.PRIMARY + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questCompleted: {
    backgroundColor: COLORS.SUCCESS,
  },
  questStatusText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  achievementsList: {
    paddingRight: SPACING.PADDING.XL,
  },
  achievementCard: {
    width: width * 0.35,
    marginRight: SPACING.MARGIN.MD,
    borderRadius: 16,
    overflow: 'hidden',
  },
  achievementGradient: {
    padding: SPACING.PADDING.MD,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  achievementIconContainer: {
    marginBottom: SPACING.MARGIN.SM,
  },
  achievementIcon: {
    fontSize: 28,
  },
  achievementTitle: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textAlign: 'center',
  },
  achievementProgress: {
    width: '100%',
    marginTop: SPACING.MARGIN.SM,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.WHITE + '30',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 2,
  },
  progressText: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    textAlign: 'center',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 8,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  settingsCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.MD,
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
    fontSize: 20,
    marginRight: SPACING.MARGIN.MD,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: SPACING.MARGIN.XS,
  },
  menuContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
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
    padding: SPACING.PADDING.MD,
    borderRadius: 12,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.MD,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  menuSubtitle: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  menuArrow: {
    fontSize: 20,
    color: COLORS.TEXT_DISABLED,
  },
  logoutButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.PADDING.MD,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: SPACING.MARGIN.SM,
  },
  logoutText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  bottomSpacing: {
    height: 80,
  },
});
