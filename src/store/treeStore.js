/**
 * Tree Store - Zustand store untuk data pohon
 * @module store/treeStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_MY_TREES, MOCK_COMMUNITY_TREES } from './mockData';

// Jenis pohon yang tersedia
export const TREE_TYPES = [
  { id: 'mahoni', name: 'Mahoni', icon: '🌳', co2PerYear: 22.6 },
  { id: 'mangga', name: 'Mangga', icon: '🥭', co2PerYear: 18.3 },
  { id: 'jambu', name: 'Jambu', icon: '🍎', co2PerYear: 15.2 },
  { id: 'kelapa', name: 'Kelapa', icon: '🌴', co2PerYear: 25.4 },
  { id: 'jati', name: 'Jati', icon: '🌲', co2PerYear: 28.1 },
  { id: 'beringin', name: 'Beringin', icon: '🌳', co2PerYear: 35.5 },
  { id: 'flamboyan', name: 'Flamboyan', icon: '🌸', co2PerYear: 20.0 },
  { id: 'trembesi', name: 'Trembesi', icon: '🌿', co2PerYear: 28.5 },
  { id: 'akasia', name: 'Akasia', icon: '🌾', co2PerYear: 19.8 },
  { id: 'ketapang', name: 'Ketapang', icon: '🍃', co2PerYear: 21.0 },
  { id: 'tabebuya', name: 'Tabebuya', icon: '🌺', co2PerYear: 18.5 },
  { id: 'angsana', name: 'Angsana', icon: '🌼', co2PerYear: 23.0 },
  { id: 'other', name: 'Lainnya', icon: '🌱', co2PerYear: 21.77 },
];

export const useTreeStore = create(
  persist(
    (set, get) => ({
      // State - initialized with mock data
      myTrees: [...MOCK_MY_TREES],
      communityTrees: [...MOCK_COMMUNITY_TREES],
      isLoading: false,
      error: null,
      isInitialized: false,

      // Actions
      addTree: (treeData) => {
        const newTree = {
          id: 'tree-' + Date.now().toString(),
          ...treeData,
          createdAt: new Date().toISOString(),
          status: 'healthy',
          lastWatered: null,
          photos: treeData.photo ? [{ uri: treeData.photo, date: new Date().toISOString() }] : [],
        };

        set((state) => ({
          myTrees: [newTree, ...state.myTrees],
        }));

        return newTree;
      },

      updateTree: (treeId, updateData) => {
        set((state) => ({
          myTrees: state.myTrees.map((tree) =>
            tree.id === treeId ? { ...tree, ...updateData } : tree
          ),
        }));
      },

      deleteTree: (treeId) => {
        set((state) => ({
          myTrees: state.myTrees.filter((tree) => tree.id !== treeId),
        }));
      },

      addPhotoToTree: (treeId, photoUri) => {
        set((state) => ({
          myTrees: state.myTrees.map((tree) =>
            tree.id === treeId
              ? {
                  ...tree,
                  photos: [
                    ...tree.photos,
                    { uri: photoUri, date: new Date().toISOString() },
                  ],
                }
              : tree
          ),
        }));
      },

      waterTree: (treeId) => {
        set((state) => ({
          myTrees: state.myTrees.map((tree) =>
            tree.id === treeId
              ? { ...tree, lastWatered: new Date().toISOString(), status: 'healthy' }
              : tree
          ),
        }));
      },

      // Get tree by ID
      getTreeById: (treeId) => {
        return get().myTrees.find((tree) => tree.id === treeId);
      },

      // Get trees by type
      getTreesByType: (typeId) => {
        return get().myTrees.filter((tree) => tree.type === typeId);
      },

      // Get trees that need care (not watered in 7 days)
      getTreesNeedingCare: () => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        return get().myTrees.filter((tree) => {
          if (!tree.lastWatered) return true;
          return new Date(tree.lastWatered) < sevenDaysAgo;
        });
      },

      // Calculate total CO2 absorbed by user's trees
      calculateTotalCO2: () => {
        const trees = get().myTrees;
        return trees.reduce((total, tree) => {
          const treeType = TREE_TYPES.find((t) => t.id === tree.type);
          const co2PerYear = treeType ? treeType.co2PerYear : 21.77;
          
          const ageInYears = (Date.now() - new Date(tree.createdAt).getTime()) / (365 * 24 * 60 * 60 * 1000);
          return total + (co2PerYear * Math.max(ageInYears, 0.1));
        }, 0);
      },

      // Load community trees
      loadCommunityTrees: async () => {
        set({ isLoading: true });

        try {
          await new Promise((resolve) => setTimeout(resolve, 300));

          set({
            communityTrees: [...MOCK_COMMUNITY_TREES],
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
        }
      },

      // Initialize with demo data
      initializeWithDemoData: () => {
        set({
          myTrees: [...MOCK_MY_TREES],
          communityTrees: [...MOCK_COMMUNITY_TREES],
          isInitialized: true,
        });
      },

      // Initialize for new user (empty)
      initializeNewUser: () => {
        set({
          myTrees: [],
          communityTrees: [...MOCK_COMMUNITY_TREES],
          isInitialized: true,
        });
      },

      // Clear all data
      clearTrees: () => {
        set({
          myTrees: [],
          communityTrees: [],
          isInitialized: false,
        });
      },
    }),
    {
      name: 'tree-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        myTrees: state.myTrees,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
