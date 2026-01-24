/**
 * HomeScreen - Premium Modern Dashboard
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
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useTreeStore } from '../../store/treeStore';
import { useAchievementStore } from '../../store/achievementStore';
import AnimatedPressable from '../../components/atoms/AnimatedPressable';
import AnimatedCounter from '../../components/atoms/AnimatedCounter';
import GlassCard from '../../components/atoms/GlassCard';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

export default function HomeScreen({ navigation }) {
  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Card animations
  const cardAnims = useRef([...Array(8)].map(() => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(30),
    scale: new Animated.Value(0.95),
  }))).current;

  // Store hooks
  const { user } = useAuthStore();
  const { profile, stats } = useUserStore();
  const { myTrees, loadCommunityTrees } = useTreeStore();
  const { initializeDailyQuests, checkAchievements, getDailyQuestStatus } = useAchievementStore();

  const dailyQuests = getDailyQuestStatus();
  const completedQuests = dailyQuests.filter(q => q.isCompleted).length;

  useEffect(() => {
    initializeDailyQuests();
    loadCommunityTrees();
    checkAchievements(stats);

    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered card animations
    cardAnims.forEach((anim, index) => {
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 400,
          delay: 200 + (index * 80),
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: 0,
          tension: 80,
          friction: 12,
          delay: 200 + (index * 80),
          useNativeDriver: true,
        }),
        Animated.spring(anim.scale, {
          toValue: 1,
          tension: 80,
          friction: 10,
          delay: 200 + (index * 80),
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Pulse animation for live indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Get greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Selamat Pagi', icon: '🌅', color: '#FF9500' };
    if (hour < 17) return { text: 'Selamat Siang', icon: '☀️', color: '#FFD60A' };
    if (hour < 20) return { text: 'Selamat Sore', icon: '🌆', color: '#FF6B6B' };
    return { text: 'Selamat Malam', icon: '🌙', color: '#A78BFA' };
  };

  const greeting = getGreeting();

  // User data
  const userData = {
    name: profile.name || user?.name || 'Eco Warrior',
    profileImage: profile.avatar || require('../../../assets/home/avatar.png'),
    level: stats.level || 1,
    levelName: stats.levelName || 'Eco Beginner 🌱',
    points: stats.totalPoints || 0,
    streak: stats.streak || 0,
  };

  // Calculate level progress
  const levelProgress = ((stats.totalPoints || 0) % 500) / 500;

  // Quick Actions - 2x2 grid with larger cards
  const quickActions = [
    {
      id: 1,
      title: 'Tanam Pohon',
      subtitle: 'Mulai aksi hijau',
      icon: '🌱',
      gradient: ['#10B981', '#059669'],
      onPress: () => navigation.navigate('Camera'),
    },
    {
      id: 2,
      title: 'Jejak Karbon',
      subtitle: 'Hitung emisi CO₂',
      icon: '🌍',
      gradient: ['#3B82F6', '#2563EB'],
      onPress: () => navigation.navigate('CarbonCalculator'),
    },
    {
      id: 3,
      title: 'Tantangan',
      subtitle: 'Misi & hadiah',
      icon: '🎯',
      gradient: ['#F59E0B', '#D97706'],
      onPress: () => navigation.navigate('LearnChallenge'),
    },
    {
      id: 4,
      title: 'Komunitas',
      subtitle: 'Berbagi cerita',
      icon: '👥',
      gradient: ['#EC4899', '#DB2777'],
      onPress: () => navigation.navigate('CommunityFeed'),
    },
  ];

  // Feature highlights
  const features = [
    {
      id: 1,
      title: 'Eco Wallet',
      icon: '💎',
      points: stats.totalPoints || 0,
      color: '#8B5CF6',
      onPress: () => navigation.navigate('EcoWallet'),
    },
    {
      id: 2,
      title: 'Leaderboard',
      icon: '🏆',
      rank: '#23',
      color: '#F59E0B',
      onPress: () => navigation.navigate('Leaderboard'),
    },
    {
      id: 3,
      title: 'Peta RTH',
      icon: '📍',
      nearby: '12 lokasi',
      color: '#10B981',
      onPress: () => navigation.navigate('Map'),
    },
  ];

  // Environmental tips
  const ecoTips = [
    { id: 1, text: 'Hemat listrik 1 jam = 0.5kg CO₂', icon: '💡' },
    { id: 2, text: 'Bersepeda 5km = 1.3kg CO₂ tersimpan', icon: '🚲' },
    { id: 3, text: '1 pohon menyerap 21kg CO₂/tahun', icon: '🌳' },
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % ecoTips.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  // Render animated card
  const renderAnimatedView = (index, children, style = {}) => (
    <Animated.View
      style={[
        style,
        {
          opacity: cardAnims[index]?.opacity || 1,
          transform: [
            { translateY: cardAnims[index]?.translateY || 0 },
            { scale: cardAnims[index]?.scale || 1 },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header with Gradient - Scrollable */}
        <LinearGradient
          colors={['#059669', '#047857', '#065F46']}
          style={styles.headerGradient}
        >
          {/* Decorative Elements */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* Header Content */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            {/* Top Row - Greeting + Streak + Notification (Inline) */}
            <View style={styles.topRow}>
              {/* Left: Greeting */}
              <View style={styles.greetingSection}>
                <View style={styles.greetingRow}>
                  <View style={[styles.greetingIconBg, { backgroundColor: greeting.color + '30' }]}>
                    <Text style={styles.greetingEmoji}>{greeting.icon}</Text>
                  </View>
                  <View style={styles.greetingTextContainer}>
                    <Text style={styles.greetingText}>{greeting.text},</Text>
                    <Text style={styles.userName}>{userData.name.split(' ')[0]}</Text>
                  </View>
                </View>
              </View>

              {/* Right: Streak + Notification */}
              <View style={styles.topActions}>
                {/* Streak Pill */}
                <Animated.View style={[styles.streakPill, { transform: [{ scale: pulseAnim }] }]}>
                  <Text style={styles.streakFireIcon}>🔥</Text>
                  <Text style={styles.streakPillValue}>{userData.streak}</Text>
                </Animated.View>

                {/* Notification */}
                <AnimatedPressable 
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('Notifications')}
                >
                  <Text style={styles.iconButtonText}>🔔</Text>
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>3</Text>
                  </View>
                </AnimatedPressable>
              </View>
            </View>

            {/* Profile Card - Avatar + Points Only */}
            <View style={styles.profileCard}>
              <View style={styles.profileLeft}>
                <View style={styles.avatarWrapper}>
                  <Image source={userData.profileImage} style={styles.avatar} />
                  <View style={styles.levelBadgeSmall}>
                    <Text style={styles.levelBadgeText}>{userData.level}</Text>
                  </View>
                </View>
                
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{userData.name}</Text>
                  <Text style={styles.levelName}>{userData.levelName}</Text>
                  {/* Mini XP Bar */}
                  <View style={styles.miniXpContainer}>
                    <View style={styles.miniXpBar}>
                      <View style={[styles.miniXpBarFill, { width: `${levelProgress * 100}%` }]} />
                    </View>
                    <Text style={styles.miniXpText}>{Math.round(levelProgress * 100)}%</Text>
                  </View>
                </View>
              </View>

              {/* Points Badge */}
              <View style={styles.pointsBadge}>
                <Text style={styles.pointsBadgeIcon}>⭐</Text>
                <Text style={styles.pointsBadgeValue}>{userData.points}</Text>
                <Text style={styles.pointsBadgeLabel}>poin</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Stats Overview */}
          {renderAnimatedView(0,
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: '#10B98120' }]}>
                  <Text style={styles.statIcon}>🌳</Text>
                </View>
                <AnimatedCounter
                  value={stats.totalTrees || 0}
                  textStyle={styles.statValue}
                  duration={1200}
                />
                <Text style={styles.statLabel}>Pohon</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: '#F59E0B20' }]}>
                  <Text style={styles.statIcon}>⭐</Text>
                </View>
                <AnimatedCounter
                  value={stats.totalPoints || 0}
                  textStyle={styles.statValue}
                  duration={1200}
                  delay={200}
                />
                <Text style={styles.statLabel}>Poin</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: '#3B82F620' }]}>
                  <Text style={styles.statIcon}>💨</Text>
                </View>
                <AnimatedCounter
                  value={stats.co2Absorbed || 0}
                  decimals={1}
                  suffix="kg"
                  textStyle={styles.statValue}
                  duration={1200}
                  delay={400}
                />
                <Text style={styles.statLabel}>CO₂ Diserap</Text>
              </View>
            </View>
          , styles.statsCard)}

          {/* Eco Tip Banner */}
          {renderAnimatedView(1,
            <View style={styles.tipBanner}>
              <LinearGradient
                colors={['#FEF3C7', '#FDE68A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tipGradient}
              >
                <Animated.View style={[styles.tipPulse, { transform: [{ scale: pulseAnim }] }]}>
                  <Text style={styles.tipIcon}>{ecoTips[currentTip].icon}</Text>
                </Animated.View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipLabel}>💡 Tips Hari Ini</Text>
                  <Text style={styles.tipText}>{ecoTips[currentTip].text}</Text>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Quick Actions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Aksi Cepat</Text>
              <Text style={styles.sectionSubtitle}>Mulai berkontribusi</Text>
            </View>

            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <Animated.View
                  key={action.id}
                  style={[
                    styles.quickActionWrapper,
                    {
                      opacity: cardAnims[2 + index]?.opacity || 1,
                      transform: [
                        { translateY: cardAnims[2 + index]?.translateY || 0 },
                        { scale: cardAnims[2 + index]?.scale || 1 },
                      ],
                    },
                  ]}
                >
                  <AnimatedPressable 
                    onPress={action.onPress}
                    scaleValue={0.95}
                  >
                    <LinearGradient
                      colors={action.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.quickActionCard}
                    >
                      <View style={styles.quickActionGlow} />
                      <Text style={styles.quickActionIcon}>{action.icon}</Text>
                      <Text style={styles.quickActionTitle}>{action.title}</Text>
                      <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                    </LinearGradient>
                  </AnimatedPressable>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Daily Progress */}
          {dailyQuests.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Misi Harian</Text>
                <View style={styles.questProgress}>
                  <Text style={styles.questProgressText}>
                    {completedQuests}/{dailyQuests.length}
                  </Text>
                </View>
              </View>

              {renderAnimatedView(6,
                <View style={styles.questsContainer}>
                  {dailyQuests.slice(0, 3).map((quest) => (
                    <View key={quest.id} style={styles.questCard}>
                      <View style={[
                        styles.questIconContainer,
                        quest.isCompleted && styles.questIconCompleted
                      ]}>
                        <Text style={styles.questIcon}>{quest.icon}</Text>
                      </View>
                      <View style={styles.questInfo}>
                        <Text style={styles.questName} numberOfLines={1}>{quest.name}</Text>
                        <View style={styles.questBar}>
                          <View 
                            style={[
                              styles.questBarFill,
                              { 
                                width: `${Math.min((quest.progress / quest.requirement.count) * 100, 100)}%`,
                                backgroundColor: quest.isCompleted ? '#10B981' : '#059669'
                              }
                            ]} 
                          />
                        </View>
                      </View>
                      <View style={[
                        styles.questRewardBadge,
                        quest.isCompleted && styles.questRewardCompleted
                      ]}>
                        <Text style={[
                          styles.questRewardText,
                          quest.isCompleted && { color: '#FFF' }
                        ]}>
                          {quest.isCompleted ? '✓' : `+${quest.points}`}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Feature Highlights */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Fitur Lainnya</Text>
            </View>

            {renderAnimatedView(7,
              <View style={styles.featuresRow}>
                {features.map((feature) => (
                  <AnimatedPressable 
                    key={feature.id}
                    style={styles.featureCard}
                    onPress={feature.onPress}
                  >
                    <View style={[styles.featureIconBg, { backgroundColor: feature.color + '15' }]}>
                      <Text style={styles.featureIcon}>{feature.icon}</Text>
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={[styles.featureValue, { color: feature.color }]}>
                      {feature.points || feature.rank || feature.nearby}
                    </Text>
                  </AnimatedPressable>
                ))}
              </View>
            )}
          </View>

          {/* Impact Card */}
          <View style={styles.section}>
            <AnimatedPressable onPress={() => navigation.navigate('Statistics')}>
              <LinearGradient
                colors={['#065F46', '#047857', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.impactCard}
              >
                <View style={styles.impactDecor1} />
                <View style={styles.impactDecor2} />
                
                <View style={styles.impactHeader}>
                  <Text style={styles.impactTitle}>🌍 Dampak Kontribusimu</Text>
                  <Text style={styles.impactArrow}>→</Text>
                </View>

                <View style={styles.impactStats}>
                  <View style={styles.impactStatItem}>
                    <Text style={styles.impactStatIcon}>🌳</Text>
                    <Text style={styles.impactStatValue}>{stats.totalTrees || 0}</Text>
                    <Text style={styles.impactStatLabel}>Pohon Ditanam</Text>
                  </View>
                  
                  <View style={styles.impactStatDivider} />
                  
                  <View style={styles.impactStatItem}>
                    <Text style={styles.impactStatIcon}>💨</Text>
                    <Text style={styles.impactStatValue}>{(stats.co2Absorbed || 0).toFixed(1)}</Text>
                    <Text style={styles.impactStatLabel}>kg CO₂ Diserap</Text>
                  </View>
                </View>

                <View style={styles.impactFooter}>
                  <Text style={styles.impactFooterText}>
                    ≈ {Math.round((stats.co2Absorbed || 0) / 21.77)} pohon dewasa/tahun 🌲
                  </Text>
                </View>
              </LinearGradient>
            </AnimatedPressable>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header Gradient - Scrollable
  headerGradient: {
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorCircle2: {
    position: 'absolute',
    top: 120,
    left: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  // Greeting - Inline Style
  greetingSection: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  greetingEmoji: {
    fontSize: 22,
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  userName: {
    fontSize: 20,
    color: '#FFF',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginTop: 2,
  },
  
  // Top Actions - Streak + Notification
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.4)',
  },
  streakFireIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  streakPillValue: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconButtonText: {
    fontSize: 20,
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#059669',
  },
  notifBadgeText: {
    fontSize: 9,
    color: '#FFF',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 12,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  levelBadgeSmall: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 8,
    backgroundColor: '#FFD60A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#059669',
  },
  levelBadgeText: {
    fontSize: 10,
    color: '#000',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  levelName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginTop: 2,
  },
  
  // Mini XP Bar (inline with profile info)
  miniXpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  miniXpBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  miniXpBarFill: {
    height: '100%',
    backgroundColor: '#FFD60A',
    borderRadius: 2,
  },
  miniXpText: {
    fontSize: 10,
    color: '#FFD60A',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    minWidth: 28,
  },
  
  // Points Badge - No Border, Square
  pointsBadge: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
    borderRadius: 16,
  },
  pointsBadgeIcon: {
    fontSize: 18,
  },
  pointsBadgeValue: {
    fontSize: 16,
    color: '#FFD60A',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginTop: 1,
  },
  pointsBadgeLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Content
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Stats
  statsCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.MEDIUM,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 24,
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
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.BORDER,
  },

  // Tip Banner
  tipBanner: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.SMALL,
  },
  tipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  tipPulse: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(217,119,6,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipLabel: {
    fontSize: 11,
    color: '#92400E',
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#78350F',
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionWrapper: {
    width: CARD_WIDTH,
  },
  quickActionCard: {
    height: 130,
    borderRadius: 24,
    padding: 18,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...SHADOWS.MEDIUM,
  },
  quickActionGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  quickActionIcon: {
    fontSize: 36,
  },
  quickActionTitle: {
    fontSize: 16,
    color: '#FFF',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginTop: 2,
  },

  // Quest Progress
  questProgress: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  questProgressText: {
    fontSize: 13,
    color: '#059669',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  questsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 4,
    ...SHADOWS.SMALL,
  },
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  questIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#05966915',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  questIconCompleted: {
    backgroundColor: '#10B98120',
  },
  questIcon: {
    fontSize: 22,
  },
  questInfo: {
    flex: 1,
  },
  questName: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginBottom: 8,
  },
  questBar: {
    height: 6,
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  questBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  questRewardBadge: {
    backgroundColor: '#05966915',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 12,
  },
  questRewardCompleted: {
    backgroundColor: '#10B981',
  },
  questRewardText: {
    fontSize: 12,
    color: '#059669',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Features
  featuresRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },
  featureIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginBottom: 4,
  },
  featureValue: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Impact Card
  impactCard: {
    borderRadius: 28,
    padding: 24,
    overflow: 'hidden',
    ...SHADOWS.LARGE,
  },
  impactDecor1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  impactDecor2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  impactTitle: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  impactArrow: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.7)',
  },
  impactStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  impactStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  impactStatIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  impactStatValue: {
    fontSize: 32,
    color: '#FFF',
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  impactStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginTop: 4,
  },
  impactStatDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  impactFooter: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: 14,
  },
  impactFooterText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    textAlign: 'center',
  },

  // Bottom
  bottomSpacing: {
    height: 20,
  },
});
