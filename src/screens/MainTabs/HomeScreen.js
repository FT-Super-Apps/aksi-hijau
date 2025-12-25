/**
 * HomeScreen - Modern Dashboard dengan Glassmorphism Design
 * @module screens/MainTabs/HomeScreen
 */

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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENT_COLORS, SHADOWS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useTreeStore } from '../../store/treeStore';
import { useAchievementStore } from '../../store/achievementStore';

// Components
import GlassCard from '../../components/atoms/GlassCard';
import AnimatedPressable from '../../components/atoms/AnimatedPressable';
import AnimatedCounter from '../../components/atoms/AnimatedCounter';
import IconBadge from '../../components/atoms/IconBadge';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const staggerAnims = useRef([...Array(6)].map(() => new Animated.Value(0))).current;
  
  // Store hooks
  const { user } = useAuthStore();
  const { profile, stats } = useUserStore();
  const { myTrees, communityTrees, loadCommunityTrees } = useTreeStore();
  const { initializeDailyQuests, checkAchievements, getDailyQuestStatus } = useAchievementStore();

  const dailyQuests = getDailyQuestStatus();

  useEffect(() => {
    initializeDailyQuests();
    loadCommunityTrees();
    checkAchievements(stats);

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

    // Staggered animation for quick actions
    const staggerAnimations = staggerAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      })
    );
    Animated.stagger(80, staggerAnimations).start();
  }, []);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Selamat Pagi', icon: '🌅' };
    if (hour < 17) return { text: 'Selamat Siang', icon: '☀️' };
    if (hour < 20) return { text: 'Selamat Sore', icon: '🌆' };
    return { text: 'Selamat Malam', icon: '🌙' };
  };

  const greeting = getGreeting();

  // User data
  const userData = {
    name: profile.name || user?.name || 'Pengguna',
    profileImage: profile.avatar || require('../../../assets/home/avatar.png'),
    level: stats.levelName || 'Eco Beginner 🌱',
    points: stats.totalPoints || 0,
    streak: stats.streak || 0,
    location: profile.location || 'Makassar',
  };

  // Stats data
  const statsData = [
    {
      id: 1,
      title: 'Pohon',
      value: stats.totalTrees || 0,
      icon: '🌱',
      color: COLORS.PRIMARY,
      gradient: GRADIENT_COLORS.PRIMARY,
    },
    {
      id: 2,
      title: 'Poin',
      value: stats.totalPoints || 0,
      icon: '⭐',
      color: COLORS.ACCENT,
      gradient: GRADIENT_COLORS.SUNRISE,
    },
    {
      id: 3,
      title: 'Streak',
      value: stats.streak || 0,
      suffix: ' hari',
      icon: '🔥',
      color: COLORS.ERROR,
      gradient: GRADIENT_COLORS.SUNSET,
    },
  ];

  // Quick actions
  const quickActions = [
    {
      id: 1,
      title: 'Tanam Pohon',
      icon: '🌱',
      gradient: ['#10B981', '#059669'],
      onPress: () => navigation.navigate('Camera'),
    },
    {
      id: 2,
      title: 'Jejak Karbon',
      icon: '🌍',
      gradient: ['#3B82F6', '#1D4ED8'],
      onPress: () => navigation.navigate('CarbonCalculator'),
    },
    {
      id: 3,
      title: 'Tantangan',
      icon: '🎯',
      gradient: ['#F59E0B', '#D97706'],
      onPress: () => navigation.navigate('LearnChallenge'),
    },
    {
      id: 4,
      title: 'Eco Wallet',
      icon: '💎',
      gradient: ['#8B5CF6', '#6D28D9'],
      onPress: () => navigation.navigate('EcoWallet'),
    },
    {
      id: 5,
      title: 'Komunitas',
      icon: '👥',
      gradient: ['#EC4899', '#BE185D'],
      onPress: () => navigation.navigate('CommunityFeed'),
    },
    {
      id: 6,
      title: 'Leaderboard',
      icon: '🏆',
      gradient: ['#F97316', '#C2410C'],
      onPress: () => navigation.navigate('Leaderboard'),
    },
  ];

  // Header parallax
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [280, 180],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  // Render stat card
  const renderStatCard = (stat, index) => (
    <AnimatedPressable 
      key={stat.id} 
      style={styles.statCard}
      onPress={() => navigation.navigate('Statistics')}
    >
      <LinearGradient
        colors={[COLORS.WHITE, COLORS.GRAY_50]}
        style={styles.statCardGradient}
      >
        <View style={[styles.statIconBg, { backgroundColor: stat.color + '15' }]}>
          <Text style={styles.statIcon}>{stat.icon}</Text>
        </View>
        <AnimatedCounter
          value={stat.value}
          suffix={stat.suffix || ''}
          textStyle={styles.statValue}
          duration={1200}
          delay={index * 200}
        />
        <Text style={styles.statTitle}>{stat.title}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );

  // Render quick action
  const renderQuickAction = (action, index) => {
    const animStyle = {
      opacity: staggerAnims[index],
      transform: [
        {
          translateY: staggerAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
        {
          scale: staggerAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
          }),
        },
      ],
    };

    return (
      <Animated.View key={action.id} style={[styles.quickActionWrapper, animStyle]}>
        <AnimatedPressable onPress={action.onPress} scaleValue={0.95}>
          <LinearGradient
            colors={action.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickActionCard}
          >
            <View style={styles.quickActionGlow} />
            <Text style={styles.quickActionIcon}>{action.icon}</Text>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
          </LinearGradient>
        </AnimatedPressable>
      </Animated.View>
    );
  };

  // Render daily quest
  const renderDailyQuest = (quest, index) => (
    <View key={quest.id} style={styles.questItem}>
      <View style={[styles.questIconBg, { backgroundColor: quest.isCompleted ? COLORS.SUCCESS + '20' : COLORS.PRIMARY + '15' }]}>
        <Text style={styles.questIcon}>{quest.icon}</Text>
      </View>
      <View style={styles.questContent}>
        <Text style={styles.questName}>{quest.name}</Text>
        <View style={styles.questProgressBar}>
          <View 
            style={[
              styles.questProgressFill, 
              { 
                width: `${Math.min((quest.progress / quest.requirement.count) * 100, 100)}%`,
                backgroundColor: quest.isCompleted ? COLORS.SUCCESS : COLORS.PRIMARY,
              }
            ]} 
          />
        </View>
      </View>
      <View style={[styles.questReward, quest.isCompleted && styles.questRewardCompleted]}>
        <Text style={[styles.questRewardText, quest.isCompleted && { color: COLORS.WHITE }]}>
          {quest.isCompleted ? '✓' : `+${quest.points}`}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Animated Header */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight, opacity: headerOpacity }]}>
        <LinearGradient
          colors={GRADIENT_COLORS.HEADER}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          {/* Decorative Blobs */}
          <View style={styles.blob1} />
          <View style={styles.blob2} />
          <View style={styles.blob3} />

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
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingIcon}>{greeting.icon}</Text>
                <View>
                  <Text style={styles.greetingText}>{greeting.text},</Text>
                  <Text style={styles.userName}>{userData.name.split(' ')[0]}</Text>
                </View>
              </View>

              <AnimatedPressable style={styles.notificationBtn}>
                <View style={styles.notificationDot} />
                <Text style={styles.notificationIcon}>🔔</Text>
              </AnimatedPressable>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.profileLeft}>
                <View style={styles.avatarContainer}>
                  <Image source={userData.profileImage} style={styles.avatar} />
                  <View style={styles.onlineIndicator} />
                </View>
                <View style={styles.profileInfo}>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{userData.level}</Text>
                  </View>
                  <Text style={styles.locationText}>📍 {userData.location}</Text>
                </View>
              </View>

              <View style={styles.profileRight}>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakIcon}>🔥</Text>
                  <Text style={styles.streakValue}>{userData.streak}</Text>
                  <Text style={styles.streakLabel}>hari</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Curved Bottom */}
        <View style={styles.curvedBottom} />
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Stats Row */}
        <View style={styles.statsContainer}>
          {statsData.map(renderStatCard)}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aksi Cepat</Text>
            <Text style={styles.sectionEmoji}>⚡</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Daily Quests */}
        {dailyQuests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Misi Hari Ini</Text>
              <Text style={styles.sectionEmoji}>🎯</Text>
            </View>
            <GlassCard variant="light" padding="md" style={styles.questsCard}>
              {dailyQuests.map(renderDailyQuest)}
            </GlassCard>
          </View>
        )}

        {/* Impact Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dampak Kontribusimu</Text>
            <Text style={styles.sectionEmoji}>🌍</Text>
          </View>
          <AnimatedPressable onPress={() => navigation.navigate('Statistics')}>
            <LinearGradient
              colors={['#059669', '#047857', '#065F46']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.impactCard}
            >
              <View style={styles.impactDecorative} />
              <View style={styles.impactContent}>
                <View style={styles.impactRow}>
                  <View style={styles.impactItem}>
                    <Text style={styles.impactIcon}>🌳</Text>
                    <AnimatedCounter
                      value={stats.totalTrees || 0}
                      textStyle={styles.impactValue}
                      duration={1500}
                    />
                    <Text style={styles.impactLabel}>Pohon Ditanam</Text>
                  </View>
                  <View style={styles.impactDivider} />
                  <View style={styles.impactItem}>
                    <Text style={styles.impactIcon}>💨</Text>
                    <AnimatedCounter
                      value={stats.co2Absorbed || 0}
                      decimals={1}
                      suffix=" kg"
                      textStyle={styles.impactValue}
                      duration={1500}
                      delay={200}
                    />
                    <Text style={styles.impactLabel}>CO₂ Diserap</Text>
                  </View>
                </View>
                <View style={styles.impactFooter}>
                  <Text style={styles.impactFooterText}>
                    Setara dengan {Math.round((stats.co2Absorbed || 0) / 21.77)} pohon dewasa per tahun 🌲
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </AnimatedPressable>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CommunityFeed')}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <GlassCard variant="light" padding="md">
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: COLORS.PRIMARY + '15' }]}>
                <Text>🌱</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Budi menanam Mahoni</Text>
                <Text style={styles.activityTime}>Taman Kota • 2 jam lalu</Text>
              </View>
            </View>

            <View style={styles.activityDivider} />

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: COLORS.ACCENT + '15' }]}>
                <Text>🏆</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Target mingguan tercapai!</Text>
                <Text style={styles.activityTime}>+100 poin bonus</Text>
              </View>
            </View>

            <View style={styles.activityDivider} />

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: COLORS.INFO + '15' }]}>
                <Text>📍</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>12 lokasi RTH terdekat</Text>
                <Text style={styles.activityTime}>Dalam radius 5km</Text>
              </View>
              <TouchableOpacity 
                style={styles.activityAction}
                onPress={() => navigation.navigate('Map')}
              >
                <Text style={styles.activityActionText}>Lihat →</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Header Styles
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingHorizontal: 20,
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
  blob3: {
    position: 'absolute',
    top: 80,
    left: '40%',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  headerContent: {
    flex: 1,
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

  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  userName: {
    fontSize: 22,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginTop: 2,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.ACCENT,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    zIndex: 1,
  },
  notificationIcon: {
    fontSize: 22,
  },

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: COLORS.PRIMARY,
  },
  profileInfo: {
    gap: 6,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  locationText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  profileRight: {},
  streakBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  streakIcon: {
    fontSize: 20,
  },
  streakValue: {
    fontSize: 22,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginTop: 2,
  },
  streakLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 300,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 28,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.MEDIUM,
  },
  statCardGradient: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 22,
  },
  statValue: {
    fontSize: 24,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginTop: 4,
  },

  // Sections
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  seeAllText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionWrapper: {
    width: (width - 40 - 24) / 3,
  },
  quickActionCard: {
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...SHADOWS.MEDIUM,
  },
  quickActionGlow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 11,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    textAlign: 'center',
  },

  // Daily Quests
  questsCard: {
    ...SHADOWS.MEDIUM,
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  questIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  questIcon: {
    fontSize: 22,
  },
  questContent: {
    flex: 1,
  },
  questName: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginBottom: 8,
  },
  questProgressBar: {
    height: 6,
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  questProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  questReward: {
    backgroundColor: COLORS.PRIMARY + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
  },
  questRewardCompleted: {
    backgroundColor: COLORS.SUCCESS,
  },
  questRewardText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Impact Card
  impactCard: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    ...SHADOWS.LARGE,
  },
  impactDecorative: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  impactContent: {},
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  impactItem: {
    alignItems: 'center',
    flex: 1,
  },
  impactIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  impactValue: {
    fontSize: 28,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  impactLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginTop: 4,
  },
  impactDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
  },
  impactFooter: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
  },
  impactFooterText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    textAlign: 'center',
  },

  // Activity
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 2,
  },
  activityDivider: {
    height: 1,
    backgroundColor: COLORS.BORDER_LIGHT,
  },
  activityAction: {
    backgroundColor: COLORS.PRIMARY + '15',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  activityActionText: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Bottom
  bottomSpacing: {
    height: 20,
  },
});

