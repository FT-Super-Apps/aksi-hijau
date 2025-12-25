/**
 * Store Index - Central export for all Zustand stores
 * @module store
 */

export { useAuthStore } from './authStore';
export { useUserStore } from './userStore';
export { useTreeStore, TREE_TYPES } from './treeStore';
export { useAchievementStore, ACHIEVEMENTS, DAILY_QUESTS } from './achievementStore';

// Mock data exports
export {
  MOCK_USERS,
  MOCK_MY_TREES,
  MOCK_COMMUNITY_TREES,
  MOCK_USER_STATS,
  MOCK_UNLOCKED_ACHIEVEMENTS,
  MOCK_ACHIEVEMENT_PROGRESS,
  MOCK_RTH_LOCATIONS,
  MOCK_LEADERBOARD,
  MOCK_COMMUNITY_FEED,
  MOCK_WALLET_TRANSACTIONS,
  MOCK_REWARDS,
  MOCK_CHALLENGES,
  MOCK_LEARN_CONTENT,
} from './mockData';
