/**
 * User Store - Zustand store untuk data profil pengguna
 * @module store/userStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USER_STATS } from './mockData';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // Profile State
      profile: {
        id: null,
        name: '',
        email: '',
        phone: '',
        avatar: null,
        bio: '',
        location: 'Makassar',
        joinDate: null,
      },

      // Stats State - initialized with mock data for demo
      stats: {
        totalTrees: MOCK_USER_STATS.totalTrees,
        totalPoints: MOCK_USER_STATS.totalPoints,
        co2Absorbed: MOCK_USER_STATS.co2Absorbed,
        streak: MOCK_USER_STATS.streak,
        level: MOCK_USER_STATS.level,
        levelName: MOCK_USER_STATS.levelName,
        todayTarget: MOCK_USER_STATS.todayTarget,
        todayProgress: MOCK_USER_STATS.todayProgress,
      },

      // Settings State
      settings: {
        notifications: true,
        reminderTime: '08:00',
        language: 'id',
        darkMode: false,
      },

      // Flag to check if initialized
      isInitialized: false,

      // Actions
      setProfile: (profileData) => {
        set((state) => ({
          profile: { ...state.profile, ...profileData },
        }));
      },

      updateStats: (statsData) => {
        set((state) => ({
          stats: { ...state.stats, ...statsData },
        }));
      },

      incrementTrees: (count = 1) => {
        set((state) => {
          const newTotalTrees = state.stats.totalTrees + count;
          const newPoints = state.stats.totalPoints + (count * 50);
          const newCo2 = state.stats.co2Absorbed + (count * 21.77);

          const { level, levelName } = calculateLevel(newPoints);

          return {
            stats: {
              ...state.stats,
              totalTrees: newTotalTrees,
              totalPoints: newPoints,
              co2Absorbed: Math.round(newCo2 * 100) / 100,
              todayProgress: state.stats.todayProgress + count,
              level,
              levelName,
            },
          };
        });
      },

      addPoints: (points) => {
        set((state) => {
          const newPoints = state.stats.totalPoints + points;
          const { level, levelName } = calculateLevel(newPoints);

          return {
            stats: {
              ...state.stats,
              totalPoints: newPoints,
              level,
              levelName,
            },
          };
        });
      },

      incrementStreak: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            streak: state.stats.streak + 1,
          },
        }));
      },

      resetStreak: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            streak: 0,
          },
        }));
      },

      resetDailyProgress: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            todayProgress: 0,
          },
        }));
      },

      updateSettings: (settingsData) => {
        set((state) => ({
          settings: { ...state.settings, ...settingsData },
        }));
      },

      // Initialize user data from auth
      initializeFromAuth: (authUser) => {
        if (authUser) {
          set((state) => ({
            profile: {
              ...state.profile,
              id: authUser.id,
              name: authUser.name,
              email: authUser.email,
              phone: authUser.phone || '',
              bio: authUser.bio || '',
              location: authUser.location || 'Makassar',
              joinDate: authUser.joinDate || new Date().toISOString(),
            },
            isInitialized: true,
          }));
        }
      },

      // Initialize with demo data (for demo user)
      initializeWithDemoData: () => {
        set({
          stats: {
            totalTrees: MOCK_USER_STATS.totalTrees,
            totalPoints: MOCK_USER_STATS.totalPoints,
            co2Absorbed: MOCK_USER_STATS.co2Absorbed,
            streak: MOCK_USER_STATS.streak,
            level: MOCK_USER_STATS.level,
            levelName: MOCK_USER_STATS.levelName,
            todayTarget: MOCK_USER_STATS.todayTarget,
            todayProgress: MOCK_USER_STATS.todayProgress,
          },
          isInitialized: true,
        });
      },

      // Initialize new user (fresh stats)
      initializeNewUser: () => {
        set({
          stats: {
            totalTrees: 0,
            totalPoints: 0,
            co2Absorbed: 0,
            streak: 0,
            level: 1,
            levelName: 'Eco Beginner 🌱',
            todayTarget: 5,
            todayProgress: 0,
          },
          isInitialized: true,
        });
      },

      // Reset all user data
      resetUser: () => {
        set({
          profile: {
            id: null,
            name: '',
            email: '',
            phone: '',
            avatar: null,
            bio: '',
            location: 'Makassar',
            joinDate: null,
          },
          stats: {
            totalTrees: 0,
            totalPoints: 0,
            co2Absorbed: 0,
            streak: 0,
            level: 1,
            levelName: 'Eco Beginner 🌱',
            todayTarget: 5,
            todayProgress: 0,
          },
          isInitialized: false,
        });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper function to calculate level based on points
function calculateLevel(points) {
  const levels = [
    { min: 0, level: 1, name: 'Eco Beginner 🌱' },
    { min: 100, level: 2, name: 'Eco Learner 🌿' },
    { min: 300, level: 3, name: 'Eco Explorer 🍀' },
    { min: 600, level: 4, name: 'Eco Warrior ⚔️' },
    { min: 1000, level: 5, name: 'Eco Champion 🏆' },
    { min: 2000, level: 6, name: 'Eco Master 🌳' },
    { min: 5000, level: 7, name: 'Eco Legend 👑' },
    { min: 10000, level: 8, name: 'Earth Guardian 🌍' },
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].min) {
      return { level: levels[i].level, levelName: levels[i].name };
    }
  }

  return { level: 1, levelName: 'Eco Beginner 🌱' };
}
