/**
 * Achievement Store - Zustand store untuk sistem badge dan achievement
 * @module store/achievementStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  MOCK_UNLOCKED_ACHIEVEMENTS, 
  MOCK_ACHIEVEMENT_PROGRESS 
} from './mockData';

// Definisi semua achievement yang tersedia
export const ACHIEVEMENTS = [
  {
    id: 'first_plant',
    name: 'First Plant',
    description: 'Tanam pohon pertamamu',
    icon: '🌱',
    requirement: { type: 'trees', count: 1 },
    points: 50,
  },
  {
    id: 'tree_planter',
    name: 'Tree Planter',
    description: 'Tanam 5 pohon',
    icon: '🌿',
    requirement: { type: 'trees', count: 5 },
    points: 100,
  },
  {
    id: 'tree_guardian',
    name: 'Tree Guardian',
    description: 'Rawat 10 pohon',
    icon: '🌳',
    requirement: { type: 'trees', count: 10 },
    points: 200,
  },
  {
    id: 'forest_maker',
    name: 'Forest Maker',
    description: 'Tanam 25 pohon',
    icon: '🏞️',
    requirement: { type: 'trees', count: 25 },
    points: 500,
  },
  {
    id: 'eco_warrior',
    name: 'Eco Warrior',
    description: 'Tanam 50 pohon',
    icon: '⚔️',
    requirement: { type: 'trees', count: 50 },
    points: 1000,
  },
  {
    id: 'eco_champion',
    name: 'Eco Champion',
    description: 'Kumpulkan 1000 poin',
    icon: '🏆',
    requirement: { type: 'points', count: 1000 },
    points: 200,
  },
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Login 3 hari berturut-turut',
    icon: '🔥',
    requirement: { type: 'streak', count: 3 },
    points: 30,
  },
  {
    id: 'streak_7',
    name: '7-Day Streak',
    description: 'Login 7 hari berturut-turut',
    icon: '🔥',
    requirement: { type: 'streak', count: 7 },
    points: 70,
  },
  {
    id: 'streak_30',
    name: 'Monthly Warrior',
    description: 'Login 30 hari berturut-turut',
    icon: '💪',
    requirement: { type: 'streak', count: 30 },
    points: 300,
  },
  {
    id: 'photographer',
    name: 'Photographer',
    description: 'Upload 10 foto pohon',
    icon: '📸',
    requirement: { type: 'photos', count: 10 },
    points: 100,
  },
  {
    id: 'pro_photographer',
    name: 'Pro Photographer',
    description: 'Upload 50 foto pohon',
    icon: '📷',
    requirement: { type: 'photos', count: 50 },
    points: 300,
  },
  {
    id: 'community_hero',
    name: 'Community Hero',
    description: 'Ajak 5 teman bergabung',
    icon: '👥',
    requirement: { type: 'referrals', count: 5 },
    points: 250,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Kunjungi 5 lokasi RTH berbeda',
    icon: '🗺️',
    requirement: { type: 'locations', count: 5 },
    points: 150,
  },
  {
    id: 'master_explorer',
    name: 'Master Explorer',
    description: 'Kunjungi 10 lokasi RTH berbeda',
    icon: '🧭',
    requirement: { type: 'locations', count: 10 },
    points: 300,
  },
  {
    id: 'carbon_saver',
    name: 'Carbon Saver',
    description: 'Serap 100 kg CO₂',
    icon: '🌍',
    requirement: { type: 'co2', count: 100 },
    points: 200,
  },
  {
    id: 'climate_hero',
    name: 'Climate Hero',
    description: 'Serap 1 ton CO₂',
    icon: '🌐',
    requirement: { type: 'co2', count: 1000 },
    points: 1000,
  },
];

// Daily challenges/quests
export const DAILY_QUESTS = [
  {
    id: 'daily_photo',
    name: 'Foto Harian',
    description: 'Foto 1 pohon hari ini',
    icon: '📸',
    requirement: { type: 'daily_photos', count: 1 },
    points: 10,
  },
  {
    id: 'daily_plant',
    name: 'Tanam Hari Ini',
    description: 'Tanam 1 pohon hari ini',
    icon: '🌱',
    requirement: { type: 'daily_trees', count: 1 },
    points: 50,
  },
  {
    id: 'daily_water',
    name: 'Siram Pohon',
    description: 'Siram 3 pohon hari ini',
    icon: '💧',
    requirement: { type: 'daily_water', count: 3 },
    points: 20,
  },
  {
    id: 'daily_learn',
    name: 'Belajar Lingkungan',
    description: 'Baca 1 artikel edukasi',
    icon: '📚',
    requirement: { type: 'daily_learn', count: 1 },
    points: 15,
  },
];

export const useAchievementStore = create(
  persist(
    (set, get) => ({
      // State - initialized with mock data for demo
      unlockedAchievements: [...MOCK_UNLOCKED_ACHIEVEMENTS],
      achievementProgress: { ...MOCK_ACHIEVEMENT_PROGRESS },
      dailyQuests: [],
      dailyQuestProgress: {
        daily_photos: 0,
        daily_trees: 1,
        daily_water: 2,
        daily_learn: 0,
      },
      lastQuestReset: null,
      totalPhotos: 3,
      totalReferrals: 0,
      visitedLocations: ['rth-1', 'rth-2'],
      newAchievements: [],
      isInitialized: false,

      // Actions
      checkAchievements: (stats) => {
        const { unlockedAchievements } = get();
        const newUnlocked = [];

        ACHIEVEMENTS.forEach((achievement) => {
          if (unlockedAchievements.includes(achievement.id)) return;

          let progress = 0;
          let isUnlocked = false;

          switch (achievement.requirement.type) {
            case 'trees':
              progress = stats.totalTrees || 0;
              isUnlocked = progress >= achievement.requirement.count;
              break;
            case 'points':
              progress = stats.totalPoints || 0;
              isUnlocked = progress >= achievement.requirement.count;
              break;
            case 'streak':
              progress = stats.streak || 0;
              isUnlocked = progress >= achievement.requirement.count;
              break;
            case 'photos':
              progress = get().totalPhotos;
              isUnlocked = progress >= achievement.requirement.count;
              break;
            case 'referrals':
              progress = get().totalReferrals;
              isUnlocked = progress >= achievement.requirement.count;
              break;
            case 'locations':
              progress = get().visitedLocations.length;
              isUnlocked = progress >= achievement.requirement.count;
              break;
            case 'co2':
              progress = stats.co2Absorbed || 0;
              isUnlocked = progress >= achievement.requirement.count;
              break;
          }

          set((state) => ({
            achievementProgress: {
              ...state.achievementProgress,
              [achievement.id]: progress,
            },
          }));

          if (isUnlocked) {
            newUnlocked.push(achievement);
          }
        });

        if (newUnlocked.length > 0) {
          set((state) => ({
            unlockedAchievements: [
              ...state.unlockedAchievements,
              ...newUnlocked.map((a) => a.id),
            ],
            newAchievements: [
              ...state.newAchievements,
              ...newUnlocked.map((a) => a.id),
            ],
          }));

          return newUnlocked;
        }

        return [];
      },

      incrementPhotos: () => {
        set((state) => ({
          totalPhotos: state.totalPhotos + 1,
        }));
      },

      incrementReferrals: () => {
        set((state) => ({
          totalReferrals: state.totalReferrals + 1,
        }));
      },

      addVisitedLocation: (locationId) => {
        set((state) => {
          if (state.visitedLocations.includes(locationId)) {
            return state;
          }
          return {
            visitedLocations: [...state.visitedLocations, locationId],
          };
        });
      },

      markAchievementSeen: (achievementId) => {
        set((state) => ({
          newAchievements: state.newAchievements.filter((id) => id !== achievementId),
        }));
      },

      clearNewAchievements: () => {
        set({ newAchievements: [] });
      },

      // Daily quests
      initializeDailyQuests: () => {
        const now = new Date();
        const today = now.toDateString();
        const { lastQuestReset } = get();

        if (lastQuestReset !== today) {
          const shuffled = [...DAILY_QUESTS].sort(() => 0.5 - Math.random());
          const todayQuests = shuffled.slice(0, 3);

          set({
            dailyQuests: todayQuests,
            dailyQuestProgress: {
              daily_photos: 0,
              daily_trees: 0,
              daily_water: 0,
              daily_learn: 0,
            },
            lastQuestReset: today,
          });
        } else if (get().dailyQuests.length === 0) {
          // If quests not loaded yet but same day
          const shuffled = [...DAILY_QUESTS].sort(() => 0.5 - Math.random());
          const todayQuests = shuffled.slice(0, 3);
          set({ dailyQuests: todayQuests });
        }
      },

      updateDailyQuestProgress: (questType, increment = 1) => {
        set((state) => {
          const currentProgress = state.dailyQuestProgress[questType] || 0;
          return {
            dailyQuestProgress: {
              ...state.dailyQuestProgress,
              [questType]: currentProgress + increment,
            },
          };
        });
      },

      getDailyQuestStatus: () => {
        const { dailyQuests, dailyQuestProgress } = get();

        return dailyQuests.map((quest) => {
          const progress = dailyQuestProgress[quest.requirement.type] || 0;
          const isCompleted = progress >= quest.requirement.count;

          return {
            ...quest,
            progress,
            isCompleted,
          };
        });
      },

      getAchievementDetails: () => {
        const { unlockedAchievements, achievementProgress, newAchievements } = get();

        return ACHIEVEMENTS.map((achievement) => ({
          ...achievement,
          isUnlocked: unlockedAchievements.includes(achievement.id),
          progress: achievementProgress[achievement.id] || 0,
          isNew: newAchievements.includes(achievement.id),
        }));
      },

      // Initialize with demo data
      initializeWithDemoData: () => {
        set({
          unlockedAchievements: [...MOCK_UNLOCKED_ACHIEVEMENTS],
          achievementProgress: { ...MOCK_ACHIEVEMENT_PROGRESS },
          totalPhotos: 3,
          visitedLocations: ['rth-1', 'rth-2'],
          isInitialized: true,
        });
      },

      // Initialize for new user
      initializeNewUser: () => {
        set({
          unlockedAchievements: [],
          achievementProgress: {},
          dailyQuests: [],
          dailyQuestProgress: {},
          totalPhotos: 0,
          totalReferrals: 0,
          visitedLocations: [],
          newAchievements: [],
          isInitialized: true,
        });
      },

      // Reset all achievements
      resetAchievements: () => {
        set({
          unlockedAchievements: [],
          achievementProgress: {},
          dailyQuests: [],
          dailyQuestProgress: {},
          lastQuestReset: null,
          totalPhotos: 0,
          totalReferrals: 0,
          visitedLocations: [],
          newAchievements: [],
          isInitialized: false,
        });
      },
    }),
    {
      name: 'achievement-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
