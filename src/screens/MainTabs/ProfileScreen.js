/**
 * ProfileScreen - Modern Profile dengan Glassmorphism Design
 * @module screens/MainTabs/ProfileScreen
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENT_COLORS, SHADOWS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useTreeStore } from '../../store/treeStore';
import { useAchievementStore, ACHIEVEMENTS } from '../../store/achievementStore';

// Components
import GlassCard from '../../components/atoms/GlassCard';
import AnimatedPressable from '../../components/atoms/AnimatedPressable';
import AnimatedCounter from '../../components/atoms/AnimatedCounter';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;

  // Store hooks
  const { user, logout } = useAuthStore();
  const { profile, stats, settings, updateSettings, resetUser } = useUserStore();
  const { myTrees, clearTrees } = useTreeStore();
  const { getAchievementDetails, initializeDailyQuests, getDailyQuestStatus, resetAchievements } = useAchievementStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notifications);
  const [darkModeEnabled, setDarkModeEnabled] = useState(settings.darkMode);

  useEffect(() => {
    initializeDailyQuests();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Ring animation loop
    Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const achievements = getAchievementDetails();
  const dailyQuests = getDailyQuestStatus();
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  // Calculate level progress
  const levelPoints = [0, 100, 300, 600, 1000, 2000, 5000, 10000];
  const currentLevelMin = levelPoints[stats.level - 1] || 0;
  const nextLevelMin = levelPoints[stats.level] || 10000;
  const levelProgress = ((stats.totalPoints - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;

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
            clearTrees();
            resetAchievements();
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

  // Ring rotation interpolation
  const ringRotate = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Menu items
  const menuItems = [
    {
      id: 1,
      title: 'Pohon Saya',
      subtitle: `${myTrees.length} pohon terdokumentasi`,
      icon: '🌱',
      color: '#10B981',
      onPress: () => navigation.navigate('Statistics'),
    },
    {
      id: 2,
      title: 'Eco Wallet',
      subtitle: `${stats.totalPoints.toLocaleString()} poin tersedia`,
      icon: '💎',
      color: '#8B5CF6',
      onPress: () => navigation.navigate('EcoWallet'),
    },
    {
      id: 3,
      title: 'Lokasi RTH',
      subtitle: 'Lihat peta penghijauan',
      icon: '🗺️',
      color: '#3B82F6',
      onPress: () => navigation.navigate('Map'),
    },
    {
      id: 4,
      title: 'Leaderboard',
      subtitle: 'Peringkat kontributor',
      icon: '🏆',
      color: '#F59E0B',
      onPress: () => navigation.navigate('Leaderboard'),
    },
    {
      id: 5,
      title: 'Undang Teman',
      subtitle: 'Dapat bonus 50 poin',
      icon: '👥',
      color: '#EC4899',
      onPress: () => {},
    },
  ];

  // Render achievement
  const renderAchievement = (item, index) => (
    <AnimatedPressable key={item.id} style={styles.achievementCard}>
      <LinearGradient
        colors={item.isUnlocked 
          ? ['#10B981', '#059669'] 
          : [COLORS.GRAY_200, COLORS.GRAY_300]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.achievementGradient}
      >
        {item.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        <Text style={[styles.achievementIcon, { opacity: item.isUnlocked ? 1 : 0.5 }]}>
          {item.icon}
        </Text>
        <Text style={[
          styles.achievementName,
          { color: item.isUnlocked ? COLORS.WHITE : COLORS.TEXT_SECONDARY }
        ]}>
          {item.name}
        </Text>
        {!item.isUnlocked && (
          <View style={styles.achievementProgressContainer}>
            <View style={styles.achievementProgressBar}>
              <View 
                style={[
                  styles.achievementProgressFill,
                  { width: `${Math.min((item.progress / item.requirement.count) * 100, 100)}%` }
                ]} 
              />
            </View>
          </View>
        )}
        {!item.isUnlocked && (
          <View style={styles.lockOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );

  // Render menu item
  const renderMenuItem = (item) => (
    <AnimatedPressable
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={[styles.menuIconBg, { backgroundColor: item.color + '15' }]}>
        <Text style={styles.menuIcon}>{item.icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </AnimatedPressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={GRADIENT_COLORS.HEADER}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          {/* Decorative Elements */}
          <View style={styles.blob1} />
          <View style={styles.blob2} />

          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Top Bar */}
            <View style={styles.topBar}>
              <Text style={styles.headerTitle}>Profil</Text>
              <AnimatedPressable style={styles.editButton}>
                <Text style={styles.editIcon}>✏️</Text>
              </AnimatedPressable>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
              {/* Avatar with Ring */}
              <View style={styles.avatarWrapper}>
                <Animated.View 
                  style={[
                    styles.avatarRing,
                    { transform: [{ rotate: ringRotate }] }
                  ]}
                >
                  <LinearGradient
                    colors={['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#10B981']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarRingGradient}
                  />
                </Animated.View>
                <View style={styles.avatarContainer}>
                  <Image
                    source={profile.avatar || require('../../../assets/home/avatar.png')}
                    style={styles.avatar}
                  />
                </View>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelNumber}>{stats.level}</Text>
                </View>
              </View>

              {/* Profile Info */}
              <Text style={styles.userName}>{profile.name || user?.name || 'Pengguna'}</Text>
              <Text style={styles.userEmail}>{profile.email || user?.email}</Text>
              
              <View style={styles.levelTag}>
                <Text style={styles.levelTagText}>{stats.levelName}</Text>
              </View>

              {/* Level Progress */}
              <View style={styles.levelProgressContainer}>
                <View style={styles.levelProgressBar}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.levelProgressFill, { width: `${levelProgress}%` }]}
                  />
                </View>
                <Text style={styles.levelProgressText}>
                  {stats.totalPoints - currentLevelMin} / {nextLevelMin - currentLevelMin} ke level berikutnya
                </Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        <View style={styles.curvedBottom} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <GlassCard variant="light" style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <AnimatedCounter
              value={stats.totalPoints}
              textStyle={styles.statValue}
              duration={1200}
            />
            <Text style={styles.statLabel}>Total Poin</Text>
          </GlassCard>

          <GlassCard variant="light" style={styles.statCard}>
            <Text style={styles.statIcon}>🌳</Text>
            <AnimatedCounter
              value={stats.totalTrees}
              textStyle={styles.statValue}
              duration={1200}
              delay={100}
            />
            <Text style={styles.statLabel}>Pohon</Text>
          </GlassCard>

          <GlassCard variant="light" style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <AnimatedCounter
              value={stats.streak}
              textStyle={styles.statValue}
              duration={1200}
              delay={200}
            />
            <Text style={styles.statLabel}>Streak</Text>
          </GlassCard>
        </View>

        {/* Impact Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dampak Kontribusi</Text>
            <Text style={styles.sectionEmoji}>🌍</Text>
          </View>
          <GlassCard variant="primary" padding="lg" style={styles.impactCard}>
            <View style={styles.impactRow}>
              <View style={styles.impactItem}>
                <Text style={styles.impactIcon}>🌱</Text>
                <Text style={styles.impactValue}>{stats.totalTrees}</Text>
                <Text style={styles.impactLabel}>Pohon</Text>
              </View>
              <View style={styles.impactDivider} />
              <View style={styles.impactItem}>
                <Text style={styles.impactIcon}>💨</Text>
                <Text style={styles.impactValue}>{stats.co2Absorbed.toFixed(1)} kg</Text>
                <Text style={styles.impactLabel}>CO₂ Diserap</Text>
              </View>
              <View style={styles.impactDivider} />
              <View style={styles.impactItem}>
                <Text style={styles.impactIcon}>🎯</Text>
                <Text style={styles.impactValue}>{stats.todayProgress}/{stats.todayTarget}</Text>
                <Text style={styles.impactLabel}>Hari Ini</Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pencapaian</Text>
            <View style={styles.achievementCount}>
              <Text style={styles.achievementCountText}>{unlockedCount}/{achievements.length}</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsList}
          >
            {achievements.slice(0, 8).map(renderAchievement)}
          </ScrollView>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Menu</Text>
            <Text style={styles.sectionEmoji}>📱</Text>
          </View>
          <GlassCard variant="light" padding="sm">
            {menuItems.map(renderMenuItem)}
          </GlassCard>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pengaturan</Text>
            <Text style={styles.sectionEmoji}>⚙️</Text>
          </View>
          <GlassCard variant="light" padding="md">
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconBg, { backgroundColor: COLORS.INFO + '15' }]}>
                  <Text style={styles.settingIcon}>🔔</Text>
                </View>
                <View>
                  <Text style={styles.settingTitle}>Notifikasi</Text>
                  <Text style={styles.settingSubtitle}>Terima pemberitahuan</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: COLORS.GRAY_300, true: COLORS.PRIMARY + '50' }}
                thumbColor={notificationsEnabled ? COLORS.PRIMARY : COLORS.GRAY_400}
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIconBg, { backgroundColor: COLORS.SECONDARY + '15' }]}>
                  <Text style={styles.settingIcon}>🌙</Text>
                </View>
                <View>
                  <Text style={styles.settingTitle}>Mode Gelap</Text>
                  <Text style={styles.settingSubtitle}>Coming Soon</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: COLORS.GRAY_300, true: COLORS.PRIMARY + '50' }}
                thumbColor={darkModeEnabled ? COLORS.PRIMARY : COLORS.GRAY_400}
                value={darkModeEnabled}
                onValueChange={handleDarkModeToggle}
                disabled
              />
            </View>
          </GlassCard>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <AnimatedPressable onPress={handleLogout}>
            <LinearGradient
              colors={[COLORS.ERROR, COLORS.ERROR_LIGHT]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Keluar dari Akun</Text>
            </LinearGradient>
          </AnimatedPressable>
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

  // Header
  headerContainer: {
    position: 'relative',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingHorizontal: 20,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  blob2: {
    position: 'absolute',
    bottom: 20,
    left: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerContent: {},
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 18,
  },
  curvedBottom: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarRing: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 112,
    height: 112,
    borderRadius: 56,
    overflow: 'hidden',
  },
  avatarRingGradient: {
    flex: 1,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.WHITE,
    padding: 4,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.ACCENT,
    borderWidth: 4,
    borderColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  userName: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 12,
  },
  levelTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  levelTagText: {
    fontSize: 13,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  levelProgressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  levelProgressBar: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  levelProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelProgressText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Scroll View
  scrollView: {
    flex: 1,
    marginTop: -30,
  },
  scrollContent: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    ...SHADOWS.MEDIUM,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginTop: 4,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    flex: 1,
  },
  sectionEmoji: {
    fontSize: 20,
  },

  // Impact
  impactCard: {
    ...SHADOWS.MEDIUM,
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
    marginBottom: 8,
  },
  impactValue: {
    fontSize: 18,
    color: COLORS.PRIMARY_DARK,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  impactLabel: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginTop: 4,
  },
  impactDivider: {
    width: 1,
    height: '70%',
    backgroundColor: COLORS.PRIMARY + '30',
    alignSelf: 'center',
  },

  // Achievements
  achievementCount: {
    backgroundColor: COLORS.PRIMARY + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  achievementCountText: {
    fontSize: 13,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  achievementsList: {
    paddingRight: 20,
    gap: 12,
  },
  achievementCard: {
    width: 100,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  achievementGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 11,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    textAlign: 'center',
  },
  achievementProgressContainer: {
    width: '100%',
    marginTop: 8,
  },
  achievementProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 2,
  },
  newBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
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
  lockOverlay: {
    position: 'absolute',
    top: 6,
    left: 6,
  },
  lockIcon: {
    fontSize: 14,
  },

  // Menu
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  menuIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },

  // Settings
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingTitle: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER_LIGHT,
    marginVertical: 6,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    ...SHADOWS.MEDIUM,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  bottomSpacing: {
    height: 20,
  },
});
