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

export default function LearnChallengeScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('challenges');
  const [activeChallenges, setActiveChallenges] = useState([1, 2]);

  const challenges = [
    {
      id: 1,
      title: 'Tanam 10 Pohon Minggu Ini',
      description: 'Ajak teman dan tanam 10 pohon dalam 7 hari',
      icon: '🌱',
      difficulty: 'Medium',
      duration: '7 hari',
      reward: '500 poin',
      progress: 6,
      total: 10,
      participants: 234,
      category: 'planting',
      active: true,
    },
    {
      id: 2,
      title: 'Zero Waste Weekend',
      description: 'Jalani akhir pekan tanpa menghasilkan sampah plastik',
      icon: '♻️',
      difficulty: 'Hard',
      duration: '3 hari',
      reward: '300 poin',
      progress: 2,
      total: 3,
      participants: 567,
      category: 'waste',
      active: true,
    },
    {
      id: 3,
      title: 'Bersepeda ke Kantor',
      description: 'Gunakan sepeda untuk pergi ke kantor selama seminggu',
      icon: '🚲',
      difficulty: 'Easy',
      duration: '5 hari',
      reward: '200 poin',
      progress: 0,
      total: 5,
      participants: 892,
      category: 'transport',
      active: false,
    },
    {
      id: 4,
      title: 'Vegetarian Week',
      description: 'Coba pola makan vegetarian selama 7 hari',
      icon: '🥗',
      difficulty: 'Medium',
      duration: '7 hari',
      reward: '350 poin',
      progress: 0,
      total: 7,
      participants: 445,
      category: 'food',
      active: false,
    },
  ];

  const learningModules = [
    {
      id: 1,
      title: 'Dasar-dasar Perubahan Iklim',
      description: 'Pahami penyebab dan dampak perubahan iklim global',
      duration: '15 menit',
      modules: 5,
      completed: 3,
      thumbnail: 'https://via.placeholder.com/120x80/4CAF50/FFFFFF?text=Climate',
      category: 'Beginner',
      badge: '🌍',
    },
    {
      id: 2,
      title: 'Teknik Penanaman Pohon yang Benar',
      description: 'Belajar cara menanam dan merawat pohon dengan efektif',
      duration: '20 menit',
      modules: 6,
      completed: 6,
      thumbnail: 'https://via.placeholder.com/120x80/2196F3/FFFFFF?text=Planting',
      category: 'Intermediate',
      badge: '🌳',
    },
    {
      id: 3,
      title: 'Mengelola Sampah Rumah Tangga',
      description: 'Tips praktis mengurangi dan mendaur ulang sampah',
      duration: '12 menit',
      modules: 4,
      completed: 1,
      thumbnail: 'https://via.placeholder.com/120x80/FF9800/FFFFFF?text=Waste',
      category: 'Beginner',
      badge: '♻️',
    },
    {
      id: 4,
      title: 'Energi Terbarukan di Rumah',
      description: 'Cara menghemat energi dan beralih ke sumber terbarukan',
      duration: '25 menit',
      modules: 7,
      completed: 0,
      thumbnail: 'https://via.placeholder.com/120x80/9C27B0/FFFFFF?text=Energy',
      category: 'Advanced',
      badge: '⚡',
    },
  ];

  const quizzes = [
    {
      id: 1,
      title: 'Quiz: Jejak Karbon',
      questions: 10,
      points: 100,
      completed: true,
      score: 85,
      icon: '📝',
    },
    {
      id: 2,
      title: 'Quiz: Biodiversitas',
      questions: 15,
      points: 150,
      completed: false,
      score: null,
      icon: '🦋',
    },
    {
      id: 3,
      title: 'Quiz: Daur Ulang',
      questions: 12,
      points: 120,
      completed: true,
      score: 92,
      icon: '♻️',
    },
  ];

  const toggleChallenge = (id) => {
    if (activeChallenges.includes(id)) {
      setActiveChallenges(activeChallenges.filter(c => c !== id));
    } else {
      setActiveChallenges([...activeChallenges, id]);
    }
  };

  const renderChallengeCard = (challenge) => {
    const progressPercentage = (challenge.progress / challenge.total) * 100;
    const isActive = activeChallenges.includes(challenge.id);

    const difficultyColors = {
      Easy: COLORS.SUCCESS,
      Medium: COLORS.WARNING,
      Hard: COLORS.ERROR,
    };

    return (
      <TouchableOpacity
        key={challenge.id}
        style={[styles.challengeCard, isActive && styles.challengeCardActive]}
        activeOpacity={0.8}
      >
        <View style={styles.challengeHeader}>
          <View style={styles.challengeIconContainer}>
            <Text style={styles.challengeIcon}>{challenge.icon}</Text>
          </View>

          <View style={styles.challengeHeaderRight}>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors[challenge.difficulty] + '20' }]}>
              <Text style={[styles.difficultyText, { color: difficultyColors[challenge.difficulty] }]}>
                {challenge.difficulty}
              </Text>
            </View>
            {isActive && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Aktif</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDescription}>{challenge.description}</Text>

        <View style={styles.challengeStats}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statText}>{challenge.duration}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statText}>{challenge.participants} peserta</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statText}>{challenge.reward}</Text>
          </View>
        </View>

        {isActive && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Progress</Text>
              <Text style={styles.progressNumbers}>
                {challenge.progress}/{challenge.total}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
                style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.challengeButton, isActive && styles.challengeButtonActive]}
          onPress={() => toggleChallenge(challenge.id)}
        >
          <LinearGradient
            colors={isActive ? [COLORS.GRAY_300, COLORS.GRAY_400] : [COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
            style={styles.challengeButtonGradient}
          >
            <Text style={styles.challengeButtonText}>
              {isActive ? '✓ Sedang Aktif' : '🚀 Mulai Challenge'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderLearningCard = (module) => {
    const completionPercentage = (module.completed / module.modules) * 100;

    return (
      <TouchableOpacity key={module.id} style={styles.learningCard} activeOpacity={0.8}>
        <Image source={{ uri: module.thumbnail }} style={styles.learningThumbnail} />

        <View style={styles.learningContent}>
          <View style={styles.learningHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{module.category}</Text>
            </View>
            <Text style={styles.learningBadge}>{module.badge}</Text>
          </View>

          <Text style={styles.learningTitle}>{module.title}</Text>
          <Text style={styles.learningDescription}>{module.description}</Text>

          <View style={styles.learningStats}>
            <View style={styles.learningStat}>
              <Text style={styles.learningStatIcon}>⏱️</Text>
              <Text style={styles.learningStatText}>{module.duration}</Text>
            </View>
            <View style={styles.learningStat}>
              <Text style={styles.learningStatIcon}>📚</Text>
              <Text style={styles.learningStatText}>{module.modules} modul</Text>
            </View>
          </View>

          <View style={styles.moduleProgress}>
            <View style={styles.moduleProgressBar}>
              <View style={[styles.moduleProgressFill, { width: `${completionPercentage}%` }]} />
            </View>
            <Text style={styles.moduleProgressText}>
              {module.completed}/{module.modules} selesai
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuizCard = (quiz) => (
    <TouchableOpacity key={quiz.id} style={styles.quizCard} activeOpacity={0.8}>
      <View style={styles.quizIconContainer}>
        <Text style={styles.quizIcon}>{quiz.icon}</Text>
      </View>

      <View style={styles.quizContent}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        <View style={styles.quizInfo}>
          <Text style={styles.quizInfoText}>{quiz.questions} pertanyaan</Text>
          <Text style={styles.quizPoints}>+{quiz.points} poin</Text>
        </View>

        {quiz.completed && (
          <View style={styles.quizScore}>
            <Text style={styles.quizScoreText}>Skor: {quiz.score}/100</Text>
            <View style={[styles.scoreBar, { width: `${quiz.score}%` }]} />
          </View>
        )}
      </View>

      <View style={[styles.quizStatus, quiz.completed && styles.quizStatusCompleted]}>
        <Text style={[styles.quizStatusText, quiz.completed && styles.quizStatusTextCompleted]}>
          {quiz.completed ? '✓' : '▶'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderChallenges = () => (
    <View style={styles.tabContent}>
      {/* Active Challenges Summary */}
      <View style={styles.summaryCard}>
        <LinearGradient
          colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
          style={styles.summaryGradient}
        >
          <Text style={styles.summaryTitle}>Challenge Aktif</Text>
          <Text style={styles.summaryValue}>{activeChallenges.length}</Text>
          <Text style={styles.summarySubtitle}>Sedang berlangsung</Text>
        </LinearGradient>
      </View>

      <Text style={styles.sectionTitle}>Tantangan Tersedia</Text>
      {challenges.map(renderChallengeCard)}
    </View>
  );

  const renderLearning = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Modul Pembelajaran</Text>
      {learningModules.map(renderLearningCard)}

      <Text style={styles.sectionTitle}>Kuis</Text>
      {quizzes.map(renderQuizCard)}
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

          <Text style={styles.headerTitle}>Belajar & Tantangan</Text>

          <TouchableOpacity style={styles.badgeButton}>
            <Text style={styles.badgeIcon}>🏆</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'challenges' && styles.tabButtonActive]}
            onPress={() => setSelectedTab('challenges')}
          >
            <Text style={[styles.tabButtonText, selectedTab === 'challenges' && styles.tabButtonTextActive]}>
              🎯 Tantangan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'learning' && styles.tabButtonActive]}
            onPress={() => setSelectedTab('learning')}
          >
            <Text style={[styles.tabButtonText, selectedTab === 'learning' && styles.tabButtonTextActive]}>
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
        {selectedTab === 'challenges' ? renderChallenges() : renderLearning()}

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
  badgeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 20,
  },

  // Tab Selector
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE + '15',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: COLORS.WHITE,
  },
  tabButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
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

  // Summary Card
  summaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.XL,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryGradient: {
    padding: SPACING.PADDING.XL,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    opacity: 0.9,
    marginBottom: SPACING.MARGIN.SM,
  },
  summaryValue: {
    fontSize: 64,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Section
  sectionTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.LG,
  },

  // Challenge Card
  challengeCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  challengeCardActive: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.MD,
  },
  challengeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeIcon: {
    fontSize: 32,
  },
  challengeHeaderRight: {
    flexDirection: 'row',
    gap: SPACING.MARGIN.SM,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  activeBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  challengeTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.SM,
  },
  challengeDescription: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: SPACING.MARGIN.LG,
  },
  challengeStats: {
    flexDirection: 'row',
    gap: SPACING.MARGIN.LG,
    marginBottom: SPACING.MARGIN.LG,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  statText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  progressSection: {
    marginBottom: SPACING.MARGIN.LG,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.SM,
  },
  progressText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  progressNumbers: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  challengeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  challengeButtonActive: {
    opacity: 0.7,
  },
  challengeButtonGradient: {
    paddingVertical: SPACING.PADDING.MD,
    alignItems: 'center',
  },
  challengeButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Learning Card
  learningCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.MD,
    marginBottom: SPACING.MARGIN.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  learningThumbnail: {
    width: 120,
    height: 100,
    borderRadius: 12,
    marginRight: SPACING.MARGIN.MD,
  },
  learningContent: {
    flex: 1,
  },
  learningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.SM,
  },
  categoryBadge: {
    backgroundColor: COLORS.PRIMARY + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  learningBadge: {
    fontSize: 20,
  },
  learningTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  learningDescription: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: SPACING.MARGIN.SM,
  },
  learningStats: {
    flexDirection: 'row',
    gap: SPACING.MARGIN.MD,
    marginBottom: SPACING.MARGIN.SM,
  },
  learningStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learningStatIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  learningStatText: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  moduleProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MARGIN.SM,
  },
  moduleProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.GRAY_200,
    borderRadius: 2,
  },
  moduleProgressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 2,
  },
  moduleProgressText: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Quiz Card
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    marginBottom: SPACING.MARGIN.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quizIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.ACCENT + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.MD,
  },
  quizIcon: {
    fontSize: 24,
  },
  quizContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  quizInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MARGIN.MD,
  },
  quizInfoText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  quizPoints: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.ACCENT,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  quizScore: {
    marginTop: SPACING.MARGIN.SM,
  },
  quizScoreText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.SUCCESS,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: 4,
  },
  scoreBar: {
    height: 4,
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 2,
  },
  quizStatus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizStatusCompleted: {
    backgroundColor: COLORS.SUCCESS + '15',
  },
  quizStatusText: {
    fontSize: 18,
    color: COLORS.PRIMARY,
  },
  quizStatusTextCompleted: {
    color: COLORS.SUCCESS,
  },

  bottomSpacing: {
    height: 80,
  },
});

