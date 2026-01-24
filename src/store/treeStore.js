/**
 * Tree Store - Zustand store untuk data pohon
 * @module store/treeStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_MY_TREES, MOCK_COMMUNITY_TREES } from './mockData';

// Kategori pohon
export const TREE_CATEGORIES = [
  { id: 'all', name: 'Semua', icon: '🌳' },
  { id: 'shade', name: 'Peneduh', icon: '🌲' },
  { id: 'fruit', name: 'Buah', icon: '🍎' },
  { id: 'ornamental', name: 'Hias', icon: '🌸' },
  { id: 'timber', name: 'Kayu', icon: '🪵' },
  { id: 'palm', name: 'Palem', icon: '🌴' },
  { id: 'mangrove', name: 'Mangrove', icon: '🌊' },
];

// Jenis pohon yang tersedia - diperluas dengan kategori
export const TREE_TYPES = [
  // Pohon Peneduh
  { id: 'mahoni', name: 'Mahoni', icon: '🌳', co2PerYear: 22.6, category: 'shade', scientificName: 'Swietenia mahagoni' },
  { id: 'beringin', name: 'Beringin', icon: '🌳', co2PerYear: 35.5, category: 'shade', scientificName: 'Ficus benjamina' },
  { id: 'trembesi', name: 'Trembesi', icon: '🌿', co2PerYear: 28.5, category: 'shade', scientificName: 'Samanea saman' },
  { id: 'ketapang', name: 'Ketapang', icon: '🍃', co2PerYear: 21.0, category: 'shade', scientificName: 'Terminalia catappa' },
  { id: 'angsana', name: 'Angsana', icon: '🌼', co2PerYear: 23.0, category: 'shade', scientificName: 'Pterocarpus indicus' },
  { id: 'kiara_payung', name: 'Kiara Payung', icon: '☂️', co2PerYear: 24.0, category: 'shade', scientificName: 'Filicium decipiens' },
  { id: 'tanjung', name: 'Tanjung', icon: '🌳', co2PerYear: 19.5, category: 'shade', scientificName: 'Mimusops elengi' },
  { id: 'glodokan', name: 'Glodokan Tiang', icon: '🌲', co2PerYear: 18.0, category: 'shade', scientificName: 'Polyalthia longifolia' },
  
  // Pohon Buah
  { id: 'mangga', name: 'Mangga', icon: '🥭', co2PerYear: 18.3, category: 'fruit', scientificName: 'Mangifera indica' },
  { id: 'jambu', name: 'Jambu Air', icon: '🍎', co2PerYear: 15.2, category: 'fruit', scientificName: 'Syzygium aqueum' },
  { id: 'jambu_biji', name: 'Jambu Biji', icon: '🍐', co2PerYear: 14.8, category: 'fruit', scientificName: 'Psidium guajava' },
  { id: 'rambutan', name: 'Rambutan', icon: '🔴', co2PerYear: 16.5, category: 'fruit', scientificName: 'Nephelium lappaceum' },
  { id: 'durian', name: 'Durian', icon: '🟡', co2PerYear: 20.0, category: 'fruit', scientificName: 'Durio zibethinus' },
  { id: 'nangka', name: 'Nangka', icon: '🟢', co2PerYear: 19.0, category: 'fruit', scientificName: 'Artocarpus heterophyllus' },
  { id: 'jeruk', name: 'Jeruk', icon: '🍊', co2PerYear: 12.5, category: 'fruit', scientificName: 'Citrus sp.' },
  { id: 'alpukat', name: 'Alpukat', icon: '🥑', co2PerYear: 17.0, category: 'fruit', scientificName: 'Persea americana' },
  { id: 'kelengkeng', name: 'Kelengkeng', icon: '⚪', co2PerYear: 15.0, category: 'fruit', scientificName: 'Dimocarpus longan' },
  { id: 'sawo', name: 'Sawo', icon: '🟤', co2PerYear: 16.0, category: 'fruit', scientificName: 'Manilkara zapota' },
  { id: 'pepaya', name: 'Pepaya', icon: '🧡', co2PerYear: 8.0, category: 'fruit', scientificName: 'Carica papaya' },
  { id: 'pisang', name: 'Pisang', icon: '🍌', co2PerYear: 6.5, category: 'fruit', scientificName: 'Musa sp.' },
  
  // Pohon Hias
  { id: 'flamboyan', name: 'Flamboyan', icon: '🌸', co2PerYear: 20.0, category: 'ornamental', scientificName: 'Delonix regia' },
  { id: 'tabebuya', name: 'Tabebuya', icon: '🌺', co2PerYear: 18.5, category: 'ornamental', scientificName: 'Tabebuia rosea' },
  { id: 'sakura', name: 'Sakura', icon: '🌸', co2PerYear: 12.0, category: 'ornamental', scientificName: 'Prunus cerasoides' },
  { id: 'bougainvillea', name: 'Bugenvil', icon: '💜', co2PerYear: 8.0, category: 'ornamental', scientificName: 'Bougainvillea sp.' },
  { id: 'kamboja', name: 'Kamboja', icon: '🌼', co2PerYear: 10.0, category: 'ornamental', scientificName: 'Plumeria sp.' },
  { id: 'kenanga', name: 'Kenanga', icon: '💛', co2PerYear: 14.0, category: 'ornamental', scientificName: 'Cananga odorata' },
  { id: 'melati', name: 'Melati', icon: '⚪', co2PerYear: 5.0, category: 'ornamental', scientificName: 'Jasminum sambac' },
  { id: 'kemuning', name: 'Kemuning', icon: '🌿', co2PerYear: 9.0, category: 'ornamental', scientificName: 'Murraya paniculata' },
  
  // Pohon Kayu
  { id: 'jati', name: 'Jati', icon: '🌲', co2PerYear: 28.1, category: 'timber', scientificName: 'Tectona grandis' },
  { id: 'akasia', name: 'Akasia', icon: '🌾', co2PerYear: 19.8, category: 'timber', scientificName: 'Acacia mangium' },
  { id: 'sengon', name: 'Sengon', icon: '🌳', co2PerYear: 25.0, category: 'timber', scientificName: 'Paraserianthes falcataria' },
  { id: 'meranti', name: 'Meranti', icon: '🪵', co2PerYear: 30.0, category: 'timber', scientificName: 'Shorea sp.' },
  { id: 'merbau', name: 'Merbau', icon: '🟫', co2PerYear: 26.0, category: 'timber', scientificName: 'Intsia bijuga' },
  { id: 'cendana', name: 'Cendana', icon: '✨', co2PerYear: 15.0, category: 'timber', scientificName: 'Santalum album' },
  { id: 'sono', name: 'Sonokeling', icon: '🎸', co2PerYear: 22.0, category: 'timber', scientificName: 'Dalbergia latifolia' },
  { id: 'eboni', name: 'Eboni', icon: '⬛', co2PerYear: 20.0, category: 'timber', scientificName: 'Diospyros celebica' },
  
  // Pohon Palem
  { id: 'kelapa', name: 'Kelapa', icon: '🥥', co2PerYear: 25.4, category: 'palm', scientificName: 'Cocos nucifera' },
  { id: 'pinang', name: 'Pinang', icon: '🌴', co2PerYear: 12.0, category: 'palm', scientificName: 'Areca catechu' },
  { id: 'palem_raja', name: 'Palem Raja', icon: '👑', co2PerYear: 18.0, category: 'palm', scientificName: 'Roystonea regia' },
  { id: 'palem_kuning', name: 'Palem Kuning', icon: '💛', co2PerYear: 14.0, category: 'palm', scientificName: 'Dypsis lutescens' },
  { id: 'palem_botol', name: 'Palem Botol', icon: '🍾', co2PerYear: 16.0, category: 'palm', scientificName: 'Hyophorbe lagenicaulis' },
  { id: 'aren', name: 'Aren', icon: '🌴', co2PerYear: 22.0, category: 'palm', scientificName: 'Arenga pinnata' },
  { id: 'salak', name: 'Salak', icon: '🟤', co2PerYear: 10.0, category: 'palm', scientificName: 'Salacca zalacca' },
  
  // Pohon Mangrove
  { id: 'bakau', name: 'Bakau', icon: '🌊', co2PerYear: 35.0, category: 'mangrove', scientificName: 'Rhizophora sp.' },
  { id: 'api_api', name: 'Api-api', icon: '🔥', co2PerYear: 30.0, category: 'mangrove', scientificName: 'Avicennia sp.' },
  { id: 'nipah', name: 'Nipah', icon: '🌿', co2PerYear: 28.0, category: 'mangrove', scientificName: 'Nypa fruticans' },
  { id: 'pedada', name: 'Pedada', icon: '🟢', co2PerYear: 25.0, category: 'mangrove', scientificName: 'Sonneratia sp.' },
  
  // Lainnya
  { id: 'bambu', name: 'Bambu', icon: '🎋', co2PerYear: 35.0, category: 'other', scientificName: 'Bambusa sp.' },
  { id: 'cemara', name: 'Cemara', icon: '🌲', co2PerYear: 20.0, category: 'other', scientificName: 'Casuarina equisetifolia' },
  { id: 'pinus', name: 'Pinus', icon: '🎄', co2PerYear: 22.0, category: 'other', scientificName: 'Pinus merkusii' },
  { id: 'other', name: 'Lainnya', icon: '🌱', co2PerYear: 21.77, category: 'other', scientificName: '-' },
];

// Helper function untuk mendapatkan tree types berdasarkan kategori
export const getTreesByCategory = (categoryId) => {
  if (categoryId === 'all') return TREE_TYPES;
  return TREE_TYPES.filter(tree => tree.category === categoryId);
};

// Helper function untuk search tree types
export const searchTreeTypes = (query) => {
  const lowerQuery = query.toLowerCase();
  return TREE_TYPES.filter(tree => 
    tree.name.toLowerCase().includes(lowerQuery) ||
    tree.scientificName.toLowerCase().includes(lowerQuery)
  );
};

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
