/**
 * LearnChallengeScreen - Halaman edukasi dan challenge
 * @module screens/Features/LearnChallengeScreen
 */

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
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { MOCK_CHALLENGES, MOCK_LEARN_CONTENT } from '../../store/mockData';
import { useAchievementStore } from '../../store/achievementStore';

const { width } = Dimensions.get('window');

export default function LearnChallengeScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('challenges');
  const { getDailyQuestStatus } = useAchievementStore();
  const dailyQuests = getDailyQuestStatus();

  const formatTimeRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffMs = end - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} hari`;
  };

  const renderDailyQuest = (quest, index) => (
    <View key={quest.id} style={styles.dailyQuestItem}>
      <View style={styles.questIconContainer}>
        <Text style={styles.questIcon}>{quest.icon}</Text>
      </View>
      <View style={styles.questContent}>
        <Text style={styles.questName}>{quest.name}</Text>
        <Text style={styles.questDescription}>{quest.description}</Text>
        <View style={styles.questProgress}>
          <View style={styles.questProgressBar}>
            <View 
              style={[
                styles.questProgressFill, 
                { width: `${Math.min((quest.progress / quest.requirement.count) * 100, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.questProgressText}>
            {quest.progress}/{quest.requirement.count}
          </Text>
        </View>
      </View>
      <View style={styles.questReward}>
        <Text style={styles.questRewardText}>+{quest.points}</Text>
        {quest.isCompleted && <Text style={styles.questCheckmark}>✓</Text>}
      </View>
    </View>
  );

  const renderChallenge = (challenge) => (
    <TouchableOpacity key={challenge.id} style={styles.challengeCard} activeOpacity={0.8}>
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.challengeGradient}
      >
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeIcon}>{challenge.icon}</Text>
          <View style={styles.challengeBadge}>
            <Text style={styles.challengeBadgeText}>🔥 Aktif</Text>
          </View>
        </View>

        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDescription}>{challenge.description}</Text>

        <View style={styles.challengeStats}>
          <View style={styles.challengeStat}>
            <Text style={styles.challengeStatLabel}>Hadiah</Text>
            <Text style={styles.challengeStatValue}>+{challenge.reward} poin</Text>
          </View>
          <View style={styles.challengeStat}>
            <Text style={styles.challengeStatLabel}>Peserta</Text>
            <Text style={styles.challengeStatValue}>{challenge.participants}</Text>
          </View>
          <View style={styles.challengeStat}>
            <Text style={styles.challengeStatLabel}>Sisa Waktu</Text>
            <Text style={styles.challengeStatValue}>{formatTimeRemaining(challenge.endDate)}</Text>
          </View>
        </View>

        <View style={styles.challengeProgress}>
          <View style={styles.challengeProgressBar}>
            <View 
              style={[
                styles.challengeProgressFill, 
                { width: `${(challenge.progress / challenge.requirement.count) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.challengeProgressText}>
            {challenge.progress}/{challenge.requirement.count} selesai
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderLearnItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.learnCard} activeOpacity={0.8}>
      <View style={[styles.learnIconContainer, item.isCompleted && styles.learnIconCompleted]}>
        <Text style={styles.learnIcon}>{item.icon}</Text>
        {item.isCompleted && (
          <View style={styles.learnCheckmark}>
            <Text style={styles.learnCheckmarkText}>✓</Text>
          </View>
        )}
      </View>

      <View style={styles.learnContent}>
        <View style={styles.learnHeader}>
          <View style={styles.learnTypeBadge}>
            <Text style={styles.learnTypeText}>
              {item.type === 'article' ? '📄 Artikel' : 
               item.type === 'quiz' ? '❓ Quiz' : 
               item.type === 'video' ? '🎬 Video' : '📚'}
            </Text>
          </View>
          <Text style={styles.learnDuration}>{item.duration}</Text>
        </View>

        <Text style={styles.learnTitle}>{item.title}</Text>
        <Text style={styles.learnDescription}>{item.description}</Text>

        <View style={styles.learnFooter}>
          <Text style={styles.learnPoints}>+{item.points} poin</Text>
          {item.isCompleted ? (
            <Text style={styles.learnCompleted}>Selesai ✓</Text>
          ) : (
            <Text style={styles.learnStart}>Mulai →</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
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

          <Text style={styles.headerTitle}>Belajar & Tantangan</Text>

          <View style={styles.placeholder} />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'challenges' && styles.tabButtonActive]}
            onPress={() => setSelectedTab('challenges')}
          >
            <Text style={[styles.tabText, selectedTab === 'challenges' && styles.tabTextActive]}>
              🎯 Tantangan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'learn' && styles.tabButtonActive]}
            onPress={() => setSelectedTab('learn')}
          >
            <Text style={[styles.tabText, selectedTab === 'learn' && styles.tabTextActive]}>
              📚 Belajar
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {selectedTab === 'challenges' ? (
          <>
            {/* Daily Quests */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Misi Harian</Text>
                <Text style={styles.sectionSubtitle}>Reset dalam 12 jam</Text>
              </View>
              <View style={styles.dailyQuestsContainer}>
                {dailyQuests.length > 0 ? (
                  dailyQuests.map(renderDailyQuest)
                ) : (
                  <Text style={styles.emptyText}>Memuat misi harian...</Text>
                )}
              </View>
            </View>

            {/* Active Challenges */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Tantangan Aktif</Text>
                <TouchableOpacity>
                  <Text style={styles.sectionLink}>Lihat Semua</Text>
                </TouchableOpacity>
              </View>
              {MOCK_CHALLENGES.filter(c => c.isActive).map(renderChallenge)}
            </View>
          </>
        ) : (
          <>
            {/* Learning Progress */}
            <View style={styles.progressCard}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>Progress Belajar</Text>
                <Text style={styles.progressCount}>
                  {MOCK_LEARN_CONTENT.filter(l => l.isCompleted).length}/{MOCK_LEARN_CONTENT.length} selesai
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.progressFill,
                      { width: `${(MOCK_LEARN_CONTENT.filter(l => l.isCompleted).length / MOCK_LEARN_CONTENT.length) * 100}%` }
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Learn Content */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Konten Edukasi</Text>
              </View>
              {MOCK_LEARN_CONTENT.map(renderLearnItem)}
            </View>
          </>
        )}

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
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: SPACING.PADDING.MD,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.MARGIN.MD,
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
  },
  placeholder: {
    width: 40,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE + '15',
    borderRadius: 25,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.WHITE,
  },
  tabText: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  tabTextActive: {
    color: COLORS.PRIMARY,
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.PADDING.LG,
  },

  // Section
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
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  sectionLink: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Daily Quests
  dailyQuestsContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.SM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dailyQuestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.PADDING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  questIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.MD,
  },
  questIcon: {
    fontSize: 24,
  },
  questContent: {
    flex: 1,
  },
  questName: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  questDescription: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 6,
  },
  questProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 3,
    marginRight: SPACING.MARGIN.SM,
  },
  questProgressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 3,
  },
  questProgressText: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  questReward: {
    alignItems: 'center',
  },
  questRewardText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  questCheckmark: {
    fontSize: 16,
    color: COLORS.SUCCESS,
    marginTop: 2,
  },

  // Challenge Card
  challengeCard: {
    marginBottom: SPACING.MARGIN.LG,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  challengeGradient: {
    padding: SPACING.PADDING.XL,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.MD,
  },
  challengeIcon: {
    fontSize: 40,
  },
  challengeBadge: {
    backgroundColor: COLORS.WHITE + '25',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  challengeBadgeText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  challengeTitle: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE + 'CC',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: SPACING.MARGIN.LG,
  },
  challengeStats: {
    flexDirection: 'row',
    marginBottom: SPACING.MARGIN.LG,
  },
  challengeStat: {
    flex: 1,
  },
  challengeStatLabel: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.WHITE + '80',
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 2,
  },
  challengeStatValue: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  challengeProgress: {
    backgroundColor: COLORS.WHITE + '20',
    borderRadius: 12,
    padding: SPACING.PADDING.MD,
  },
  challengeProgressBar: {
    height: 8,
    backgroundColor: COLORS.WHITE + '30',
    borderRadius: 4,
    marginBottom: 8,
  },
  challengeProgressFill: {
    height: '100%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 4,
  },
  challengeProgressText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    textAlign: 'center',
  },

  // Progress Card
  progressCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.XL,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.MD,
  },
  progressTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  progressCount: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  progressBarContainer: {},
  progressBar: {
    height: 10,
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },

  // Learn Card
  learnCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.MD,
    marginBottom: SPACING.MARGIN.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  learnIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.MD,
    position: 'relative',
  },
  learnIconCompleted: {
    backgroundColor: COLORS.SUCCESS + '15',
  },
  learnIcon: {
    fontSize: 28,
  },
  learnCheckmark: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnCheckmarkText: {
    fontSize: 12,
    color: COLORS.WHITE,
  },
  learnContent: {
    flex: 1,
  },
  learnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  learnTypeBadge: {
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  learnTypeText: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  learnDuration: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  learnTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  learnDescription: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 8,
  },
  learnFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  learnPoints: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  learnCompleted: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.SUCCESS,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  learnStart: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  emptyText: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
    padding: SPACING.PADDING.XL,
  },

  bottomSpacing: {
    height: 80,
  },
});
