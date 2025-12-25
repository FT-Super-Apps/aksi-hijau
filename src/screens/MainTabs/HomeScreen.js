import React, { useEffect, useRef, useState } from 'react';
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
  Animated,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useTreeStore } from '../../store/treeStore';
import { useAchievementStore } from '../../store/achievementStore';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const floatingAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  // Store hooks
  const { user } = useAuthStore();
  const { profile, stats } = useUserStore();
  const { myTrees, communityTrees, loadCommunityTrees } = useTreeStore();
  const { initializeDailyQuests, checkAchievements } = useAchievementStore();

  useEffect(() => {
    // Initialize stores
    initializeDailyQuests();
    loadCommunityTrees();
    checkAchievements(stats);
    // Floating animation for the eco elements
    const floatingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle scale animation for the earth
    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    floatingLoop.start();
    scaleLoop.start();

    return () => {
      floatingLoop.stop();
      scaleLoop.stop();
    };
  }, []);

  const floatingTransform = floatingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  // User data from store (with fallbacks)
  const userData = {
    name: profile.name || user?.name || 'Pengguna',
    profileImage: profile.avatar || require('../../../assets/home/avatar.png'),
    level: stats.levelName || 'Eco Beginner 🌱',
    points: stats.totalPoints || 0,
    streak: stats.streak || 0,
    location: profile.location || 'Makassar',
    temperature: '27°C',
    todayTarget: stats.todayTarget || 5
  };

  // Calculate progress
  const treeProgress = Math.min(Math.round((stats.totalTrees / 50) * 100), 100);
  const communityCount = myTrees.length + communityTrees.length;

  const statsData = [
    {
      id: 1,
      title: 'Pohon Saya',
      value: String(stats.totalTrees || 0),
      subtitle: 'pohon',
      icon: '🌱',
      color: COLORS.PRIMARY,
      progress: treeProgress,
      target: '50'
    },
    {
      id: 2,
      title: 'Komunitas Pohon',
      value: String(communityCount),
      subtitle: 'pohon',
      icon: '🌳',
      color: COLORS.ACCENT,
      progress: Math.min(Math.round((communityCount / 200) * 100), 100),
      target: '200'
    },
    {
      id: 3,
      title: 'RTH Makassar',
      value: '11.47',
      subtitle: '%',
      icon: '🏞️',
      color: COLORS.SUCCESS,
      progress: 11,
      target: '100'
    },
    {
      id: 4,
      title: 'CO₂ Diserap',
      value: ((stats.co2Absorbed || 0) / 1000).toFixed(2),
      subtitle: 'ton',
      icon: '🌍',
      color: COLORS.SECONDARY,
      progress: Math.min(Math.round(((stats.co2Absorbed || 0) / 10000) * 100), 100),
      target: '10'
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Tanam Pohon Baru',
      subtitle: '📷',
      icon: '🌱',
      color: COLORS.PRIMARY,
      gradient: [COLORS.PRIMARY, COLORS.PRIMARY_DARK],
      onPress: () => navigation.navigate('Camera')
    },
    {
      id: 2,
      title: 'Jejak Karbon',
      subtitle: '🌍',
      icon: '📊',
      color: COLORS.ACCENT,
      gradient: [COLORS.ACCENT, COLORS.ACCENT_DARK],
      onPress: () => navigation.navigate('CarbonCalculator')
    },
    {
      id: 3,
      title: 'Belajar & Tantangan',
      subtitle: '📚',
      icon: '🎯',
      color: COLORS.SUCCESS,
      gradient: [COLORS.SUCCESS, COLORS.SUCCESS + 'CC'],
      onPress: () => navigation.navigate('LearnChallenge')
    },
    {
      id: 4,
      title: 'Eco Wallet',
      subtitle: '💰',
      icon: '⭐',
      color: COLORS.WARNING,
      gradient: [COLORS.WARNING, COLORS.WARNING + 'DD'],
      onPress: () => navigation.navigate('EcoWallet')
    },
    {
      id: 5,
      title: 'Feed Komunitas',
      subtitle: '👥',
      icon: '💬',
      color: COLORS.INFO,
      gradient: [COLORS.INFO, COLORS.INFO + 'DD'],
      onPress: () => navigation.navigate('CommunityFeed')
    },
    {
      id: 6,
      title: 'Leaderboard',
      subtitle: '🏆',
      icon: '🥇',
      color: COLORS.SECONDARY,
      gradient: [COLORS.SECONDARY, COLORS.SECONDARY_DARK],
      onPress: () => navigation.navigate('Leaderboard')
    }
  ];

  const achievements = [
    { id: 1, title: 'Tree Planter', icon: '🌱', earned: true },
    { id: 2, title: 'Eco Warrior', icon: '⚔️', earned: true },
    { id: 3, title: 'Green Master', icon: '🥇', earned: false },
  ];

  const renderStatCard = (stat) => (
    <TouchableOpacity
      key={stat.id}
      style={styles.statCard}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[stat.color + '15', stat.color + '05']}
        style={styles.statCardGradient}
      >
        <View style={styles.statCardHeader}>
          <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
          </View>
          <View style={styles.statProgress}>
            <View style={[styles.progressDot, { backgroundColor: stat.color }]} />
            <Text style={styles.progressValue}>{stat.progress}%</Text>
          </View>
        </View>

        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statTitle}>{stat.title}</Text>
        <Text style={styles.statSubtitle}>dari {stat.target} {stat.subtitle}</Text>

        <View style={styles.miniProgressBar}>
          <View
            style={[
              styles.miniProgressFill,
              {
                width: `${stat.progress}%`,
                backgroundColor: stat.color
              }
            ]}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderQuickAction = (action) => (
    <TouchableOpacity
      key={action.id}
      style={styles.quickActionCard}
      activeOpacity={0.8}
      onPress={action.onPress}
    >
      <LinearGradient
        colors={action.gradient}
        style={styles.quickActionGradient}
      >
        <Text style={styles.quickActionIcon}>{action.icon}</Text>
        <Text style={styles.quickActionTitle}>{action.title}</Text>
        <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} translucent />

      {/* Enhanced Header with Curved Design */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK, COLORS.PRIMARY_DARK]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative Background Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <View style={styles.headerContent}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>Selasa, 27 Agustus</Text>
                <Text style={styles.timeText}>14:30 WIB</Text>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <View style={styles.notificationDot} />
                <Text style={styles.notificationIcon}>🔔</Text>
              </TouchableOpacity>
            </View>

            {/* Enhanced Profile Section with Illustration */}
            <View style={styles.profileSection}>
              {/* Profile Info on the Right */}
              <View style={styles.profileInfoContainer}>
                <View style={styles.profileImageContainer}>
                  <Image source={userData.profileImage} style={styles.profileImage} />
                  <View style={styles.statusIndicator} />
                </View>

                <View style={styles.profileInfo}>
                  <Text style={styles.greeting}>🌱 Selamat pagi, {userData.name.split(' ')[0]}!</Text>
                  <Text style={styles.locationWeather}>{userData.location}, {userData.temperature} ☀️</Text>
                  <Text style={styles.dailyTarget}>Target hari ini: {userData.todayTarget} pohon</Text>

                  <View style={styles.userStats}>
                    <View style={styles.levelBadge}>
                      <Text style={styles.userLevel}>{userData.level}</Text>
                    </View>
                    <View style={styles.streakContainer}>
                      <Text style={styles.streakIcon}>🔥</Text>
                      <Text style={styles.streakText}>{userData.streak} hari</Text>
                    </View>
                  </View>

                  <View style={styles.pointsContainer}>
                    <Text style={styles.pointsLabel}>Total Poin</Text>
                    <Text style={styles.points}>⭐ {userData.points.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Curved Bottom Design */}
        <View style={styles.curvedBottom} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aksi Cepat ⚡</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Modern Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progres Kontribusi 📈</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('Statistics')}
            >
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScrollContainer}
          >
            {statsData.map(renderStatCard)}
          </ScrollView>
        </View>

        {/* Floating Achievement Card */}
        <View style={styles.floatingCard}>
          <LinearGradient
            colors={['#FFD700', '#FFA500', '#FF8C00']}
            style={styles.achievementCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.achievementHeader}>
              <Text style={styles.achievementBigIcon}>🏆</Text>
              <View style={styles.achievementTextContainer}>
                <Text style={styles.achievementTitle}>Level Baru Terbuka!</Text>
                <Text style={styles.achievementSubtitle}>Selamat! Anda naik ke "Eco Champion"</Text>
              </View>
            </View>
            <View style={styles.achievementBadges}>
              {achievements.map(achievement => (
                <View key={achievement.id} style={[
                  styles.achievementBadge,
                  { opacity: achievement.earned ? 1 : 0.4 }
                ]}>
                  <Text style={styles.badgeIcon}>{achievement.icon}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Interactive Daily Challenge */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Misi Harian 🎯</Text>
          <View style={styles.challengeCard}>
            <LinearGradient
              colors={[COLORS.BACKGROUND, COLORS.WHITE]}
              style={styles.challengeGradient}
            >
              <View style={styles.challengeHeader}>
                <View style={styles.challengeIconContainer}>
                  <Text style={styles.challengeIcon}>🌱</Text>
                </View>
                <View style={styles.challengeInfo}>
                  <Text style={styles.challengeTitle}>Tanam Bibit Hari Ini</Text>
                  <Text style={styles.challengeDescription}>
                    Berkontribusi untuk bumi yang lebih hijau
                  </Text>
                  <View style={styles.challengeReward}>
                    <Text style={styles.rewardText}>+50 poin • +1 bibit</Text>
                  </View>
                </View>
              </View>

              <View style={styles.challengeProgress}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressPercentage}>3/5 selesai</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                      style={[styles.progressFill, { width: '60%' }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.challengeButton}>
                  <LinearGradient
                    colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                    style={styles.challengeButtonGradient}
                  >
                    <Text style={styles.challengeButtonText}>Lanjutkan Misi</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Recent Activity - Updated for Sedekah Hijau */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru 📋</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text>📸</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Budi menanam Mahoni</Text>
                <Text style={styles.activityTime}>Taman Kota, 2 jam lalu</Text>
              </View>
              <Text style={styles.activityPoints}>🌱</Text>
            </View>

            <View style={styles.activityDivider} />

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text>📸</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Sari menanam Mangga</Text>
                <Text style={styles.activityTime}>Jl. Perintis, 4 jam lalu</Text>
              </View>
              <Text style={styles.activityPoints}>🌳</Text>
            </View>

            <View style={styles.activityDivider} />

            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text>🏆</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Anda mencapai target minggu!</Text>
                <Text style={styles.activityTime}>5 pohon telah ditanam</Text>
              </View>
              <Text style={styles.activityPoints}>⭐</Text>
            </View>
          </View>
        </View>

        {/* Mini Map Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Peta RTH Terdekat 🗺️</Text>
          <View style={styles.mapCard}>
            <View style={styles.miniMap}>
              <Text style={styles.mapPlaceholder}>🗺️ MAP VIEW</Text>
              <View style={styles.mapPins}>
                <Text style={styles.mapPin}>📍</Text>
                <Text style={styles.mapPin}>📍</Text>
                <Text style={styles.mapPin}>📍</Text>
                <Text style={styles.mapPin}>📍</Text>
                <Text style={styles.mapPin}>📍</Text>
              </View>
            </View>
            <Text style={styles.mapInfo}>12 lokasi RTH dalam radius 5km</Text>
            <TouchableOpacity
              style={styles.viewMapButton}
              onPress={() => navigation.navigate('Map')}
            >
              <Text style={styles.viewMapText}>Lihat Peta Lengkap</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
} const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Enhanced Header Styles
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
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    opacity: 0.9,
  },
  timeText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.7,
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: COLORS.WHITE + '15',
    borderRadius: 12,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ACCENT,
    zIndex: 1,
  },
  notificationIcon: {
    fontSize: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.MARGIN.LG,
  },

  // Eco Illustration Styles
  illustrationContainer: {
    width: width * 0.35,
    height: 120,
    marginRight: SPACING.MARGIN.LG,
  },
  ecoIllustration: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earthContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  earthEmoji: {
    fontSize: 60,
    textAlign: 'center',
  },
  peopleAroundEarth: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personEmoji1: {
    position: 'absolute',
    top: -15,
    left: 20,
    fontSize: 16,
    transform: [{ rotate: '-15deg' }],
  },
  personEmoji2: {
    position: 'absolute',
    top: 10,
    right: -10,
    fontSize: 16,
    transform: [{ rotate: '30deg' }],
  },
  personEmoji3: {
    position: 'absolute',
    bottom: -10,
    left: 15,
    fontSize: 16,
    transform: [{ rotate: '-30deg' }],
  },
  personEmoji4: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    fontSize: 16,
    transform: [{ rotate: '15deg' }],
  },
  personEmoji5: {
    position: 'absolute',
    top: 5,
    left: -5,
    fontSize: 16,
    transform: [{ rotate: '-45deg' }],
  },
  floatingElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingLeaf1: {
    position: 'absolute',
    top: 10,
    right: 20,
    fontSize: 20,
    opacity: 0.8,
    transform: [{ rotate: '15deg' }],
  },
  floatingLeaf2: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    fontSize: 18,
    opacity: 0.7,
    transform: [{ rotate: '-20deg' }],
  },
  floatingLeaf3: {
    position: 'absolute',
    top: 30,
    left: -5,
    fontSize: 16,
    opacity: 0.6,
    transform: [{ rotate: '45deg' }],
  },

  // Updated Profile Info Styles
  profileInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: SPACING.MARGIN.MD,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: COLORS.WHITE,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  locationWeather: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.9,
    marginBottom: 4,
  },
  dailyTarget: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: SPACING.MARGIN.SM,
  },
  userName: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.SM,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.SM,
  },
  levelBadge: {
    backgroundColor: COLORS.WHITE + '25',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: SPACING.MARGIN.SM,
  },
  userLevel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  streakText: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.8,
  },
  points: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginLeft: SPACING.MARGIN.SM,
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
  seeAllButton: {
    padding: 8,
  },
  seeAllText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Enhanced Stats Styles
  statsScrollContainer: {
    paddingRight: SPACING.PADDING.XL,
  },
  statCard: {
    width: width * 0.4,
    marginRight: SPACING.MARGIN.LG,
  },
  statCardGradient: {
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.MD,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
  },
  statProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  progressValue: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  statValue: {
    fontSize: FONT_SIZES.H3,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: SPACING.MARGIN.SM,
  },
  miniProgressBar: {
    height: 4,
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 2,
    marginTop: SPACING.MARGIN.SM,
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Enhanced Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - SPACING.PADDING.XL * 2 - SPACING.MARGIN.MD) / 2,
    marginBottom: SPACING.MARGIN.MD,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionGradient: {
    padding: SPACING.PADDING.LG,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: SPACING.MARGIN.SM,
  },
  quickActionTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
    opacity: 0.9,
  },

  // Floating Achievement Card
  floatingCard: {
    marginBottom: SPACING.MARGIN.XXXL,
  },
  achievementCard: {
    borderRadius: 24,
    padding: SPACING.PADDING.XL,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.LG,
  },
  achievementBigIcon: {
    fontSize: 48,
    marginRight: SPACING.MARGIN.LG,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.9,
  },
  achievementBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  achievementBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.WHITE + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.MARGIN.SM,
  },
  badgeIcon: {
    fontSize: 24,
  },

  // Enhanced Challenge Card
  challengeCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  challengeGradient: {
    padding: SPACING.PADDING.XL,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.XL,
  },
  challengeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.LG,
  },
  challengeIcon: {
    fontSize: 30,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 6,
  },
  challengeDescription: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: SPACING.MARGIN.SM,
  },
  challengeReward: {
    backgroundColor: COLORS.PRIMARY + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  rewardText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  challengeProgress: {
    alignItems: 'stretch',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.SM,
  },
  progressLabel: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  progressPercentage: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  progressBarContainer: {
    marginBottom: SPACING.MARGIN.LG,
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  challengeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  challengeButtonGradient: {
    paddingVertical: SPACING.PADDING.LG,
    alignItems: 'center',
  },
  challengeButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Activity Card
  activityCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.PADDING.SM,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.LG,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  activityPoints: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  activityDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: SPACING.MARGIN.SM,
  },

  // Map Section Styles
  mapCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  miniMap: {
    height: 120,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: SPACING.MARGIN.MD,
  },
  mapPlaceholder: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  mapPins: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '80%',
    height: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mapPin: {
    fontSize: 16,
  },
  mapInfo: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
    marginBottom: SPACING.MARGIN.MD,
  },
  viewMapButton: {
    backgroundColor: COLORS.PRIMARY + '15',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewMapText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  bottomSpacing: {
    height: 80, // Increased spacing for better separation from bottom tabs
  },

  // Mini Map Styles
  mapCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  miniMap: {
    height: 120,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.MD,
    position: 'relative',
    overflow: 'hidden',
  },
  mapPlaceholder: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.SM,
  },
  mapPins: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPin: {
    position: 'absolute',
    fontSize: 20,
  },
  mapInfo: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
    marginBottom: SPACING.MARGIN.MD,
  },
  viewMapButton: {
    backgroundColor: COLORS.PRIMARY + '15',
    borderRadius: 12,
    paddingVertical: SPACING.PADDING.SM,
    alignItems: 'center',
  },
  viewMapText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
});
