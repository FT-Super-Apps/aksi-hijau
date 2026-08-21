# Aksi Hijau - Panduan Sinergi Admin Panel & Mobile App

## Daftar Isi
1. [Overview Project](#overview-project)
2. [Design System](#design-system)
3. [Struktur Data](#struktur-data)
4. [Fitur & Endpoint](#fitur--endpoint)
5. [User Flow](#user-flow)
6. [Component Reference](#component-reference)

---

## Overview Project

### Deskripsi
**Aksi Hijau (EcoUnity)** adalah aplikasi mobile untuk pelacakan penanaman pohon dan perhitungan jejak karbon. Admin Panel diperlukan untuk mengelola data pengguna, pohon, tantangan, dan statistik platform.

### Tech Stack

| Platform | Technology |
|----------|------------|
| Mobile | React Native 0.81.5, Expo 54 |
| State Management | Zustand |
| Navigation | React Navigation 7.x |
| Admin (Recommended) | Next.js / React + Tailwind CSS |
| Backend (Recommended) | Node.js + Express / Supabase / Firebase |
| Database (Recommended) | PostgreSQL / Supabase / Firebase Firestore |

---

## Design System

### Color Palette

#### Primary Colors (Hijau/Green Theme)
```
PRIMARY:        #059669  - Warna utama (tombol, header, aksen)
PRIMARY_DARK:   #047857  - Warna gradient gelap
PRIMARY_LIGHT:  #10B981  - Warna highlight/success
BACKGROUND:     #F0FDF4  - Background utama (soft green tint)
```

#### Secondary Colors
```
SECONDARY:      #3B82F6  - Biru (info, lokasi)
ACCENT:         #F59E0B  - Kuning/Orange (warning, streak, poin)
ERROR:          #EF4444  - Merah (error, logout, danger)
```

#### Neutral Colors
```
WHITE:          #FFFFFF
GRAY_50:        #F9FAFB
GRAY_100:       #F3F4F6
GRAY_200:       #E5E7EB
GRAY_300:       #D1D5DB
GRAY_400:       #9CA3AF
GRAY_500:       #6B7280
TEXT_PRIMARY:   #1F2937  - Teks utama
TEXT_SECONDARY: #6B7280  - Teks sekunder
TEXT_TERTIARY:  #9CA3AF  - Teks disabled
```

#### Feature Colors (untuk kategori/badge)
```
TREE:           #10B981  - Hijau (pohon)
CARBON:         #3B82F6  - Biru (karbon)
CHALLENGE:      #F59E0B  - Kuning (tantangan)
COMMUNITY:      #EC4899  - Pink (komunitas)
WALLET:         #8B5CF6  - Ungu (eco wallet)
STREAK:         #FF6B6B  - Merah muda (streak api)
```

#### Gradient Combinations
```javascript
// Header Gradient
HEADER: ['#059669', '#047857', '#065F46']

// Button Gradient
PRIMARY_BUTTON: ['#10B981', '#059669']
DANGER_BUTTON: ['#EF4444', '#DC2626']

// Card Gradients
TREE_CARD: ['#10B981', '#059669']
CARBON_CARD: ['#3B82F6', '#2563EB']
CHALLENGE_CARD: ['#F59E0B', '#D97706']
COMMUNITY_CARD: ['#EC4899', '#DB2777']
```

### Typography

#### Font Family
```
Primary Font: Sora
Weights:
- Regular (400)
- Medium (500)
- SemiBold (600)
- Bold (700)
```

#### Font Sizes
```
xs:   10px  - Caption, badge
sm:   12px  - Label, subtitle
base: 14px  - Body text
md:   16px  - Menu item, input
lg:   18px  - Section title
xl:   20px  - Card title
2xl:  24px  - Page title
3xl:  28px  - Hero text
```

### Spacing System
```
xs:   4px
sm:   8px
md:   12px
lg:   16px
xl:   20px
2xl:  24px
3xl:  32px
4xl:  40px
```

### Border Radius
```
sm:   8px   - Small buttons, badges
md:   12px  - Inputs, small cards
lg:   16px  - Cards, buttons
xl:   20px  - Large cards
2xl:  24px  - Modal, bottom sheet
3xl:  28px  - Header rounded corners
```

### Shadows
```javascript
SMALL: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
}

MEDIUM: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 6,
}

LARGE: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.15,
  shadowRadius: 24,
  elevation: 10,
}
```

---

## Struktur Data

### 1. User / Pengguna

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  created_at: timestamp;
  updated_at: timestamp;
  
  // Profile
  profile: {
    bio?: string;
    location?: string;
    joined_date: timestamp;
  };
  
  // Statistics
  stats: {
    level: number;              // 1-10
    levelName: string;          // "Eco Beginner", "Eco Warrior", etc.
    totalPoints: number;        // Total XP/poin
    totalTrees: number;         // Jumlah pohon ditanam
    co2Absorbed: number;        // kg CO2 diserap (calculated)
    streak: number;             // Hari berturut-turut aktif
    todayProgress: number;      // Pohon hari ini
    todayTarget: number;        // Target harian (default: 3)
  };
  
  // Settings
  settings: {
    notifications: boolean;
    darkMode: boolean;
    language: string;           // 'id' | 'en'
  };
}
```

#### Level System
```typescript
const LEVEL_CONFIG = {
  1: { name: 'Eco Beginner 🌱', minPoints: 0, maxPoints: 100 },
  2: { name: 'Eco Learner 🌿', minPoints: 100, maxPoints: 300 },
  3: { name: 'Eco Explorer 🌳', minPoints: 300, maxPoints: 600 },
  4: { name: 'Eco Warrior 💚', minPoints: 600, maxPoints: 1000 },
  5: { name: 'Eco Champion 🏆', minPoints: 1000, maxPoints: 2000 },
  6: { name: 'Eco Master 🌟', minPoints: 2000, maxPoints: 5000 },
  7: { name: 'Eco Legend ✨', minPoints: 5000, maxPoints: 10000 },
  8: { name: 'Eco Guardian 🛡️', minPoints: 10000, maxPoints: 25000 },
  9: { name: 'Eco Hero 🦸', minPoints: 25000, maxPoints: 50000 },
  10: { name: 'Eco Supreme 👑', minPoints: 50000, maxPoints: Infinity },
};
```

### 2. Tree / Pohon

```typescript
interface Tree {
  id: string;
  user_id: string;
  tree_type_id: string;
  
  // Location
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    province?: string;
  };
  
  // Details
  photo_url: string;
  notes?: string;
  planted_at: timestamp;
  
  // Verification
  status: 'pending' | 'verified' | 'rejected';
  verified_by?: string;         // Admin ID
  verified_at?: timestamp;
  rejection_reason?: string;
  
  // Calculated
  co2_absorbed: number;         // kg per year (from tree type)
  points_earned: number;
}
```

### 3. Tree Type / Jenis Pohon

```typescript
interface TreeType {
  id: string;
  name: string;                 // "Mangga"
  scientific_name: string;      // "Mangifera indica"
  icon: string;                 // Emoji: "🥭"
  category: string;             // "fruit" | "shade" | "timber" | "ornamental" | "palm"
  
  // Environmental Impact
  co2_per_year: number;         // kg CO2 absorbed per year
  o2_per_year?: number;         // kg O2 produced per year
  
  // Metadata
  description?: string;
  growth_time?: string;         // "3-5 tahun"
  max_height?: number;          // meters
  
  is_active: boolean;
}
```

#### Tree Categories
```typescript
const TREE_CATEGORIES = [
  { id: 'all', name: 'Semua', icon: '🌳' },
  { id: 'fruit', name: 'Buah', icon: '🍎' },
  { id: 'shade', name: 'Peneduh', icon: '🌲' },
  { id: 'timber', name: 'Kayu', icon: '🪵' },
  { id: 'ornamental', name: 'Hias', icon: '🌸' },
  { id: 'palm', name: 'Palem', icon: '🌴' },
];
```

#### Sample Tree Types (50+ jenis)
```typescript
const TREE_TYPES = [
  // Buah
  { id: 'mangga', name: 'Mangga', scientific_name: 'Mangifera indica', icon: '🥭', category: 'fruit', co2_per_year: 22 },
  { id: 'durian', name: 'Durian', scientific_name: 'Durio zibethinus', icon: '🍈', category: 'fruit', co2_per_year: 25 },
  { id: 'rambutan', name: 'Rambutan', scientific_name: 'Nephelium lappaceum', icon: '🍒', category: 'fruit', co2_per_year: 18 },
  { id: 'jeruk', name: 'Jeruk', scientific_name: 'Citrus sinensis', icon: '🍊', category: 'fruit', co2_per_year: 15 },
  { id: 'alpukat', name: 'Alpukat', scientific_name: 'Persea americana', icon: '🥑', category: 'fruit', co2_per_year: 20 },
  { id: 'jambu', name: 'Jambu', scientific_name: 'Psidium guajava', icon: '🍐', category: 'fruit', co2_per_year: 16 },
  { id: 'nangka', name: 'Nangka', scientific_name: 'Artocarpus heterophyllus', icon: '🍈', category: 'fruit', co2_per_year: 24 },
  { id: 'pisang', name: 'Pisang', scientific_name: 'Musa paradisiaca', icon: '🍌', category: 'fruit', co2_per_year: 10 },
  { id: 'pepaya', name: 'Pepaya', scientific_name: 'Carica papaya', icon: '🍈', category: 'fruit', co2_per_year: 8 },
  { id: 'kelapa', name: 'Kelapa', scientific_name: 'Cocos nucifera', icon: '🥥', category: 'palm', co2_per_year: 22 },
  
  // Peneduh
  { id: 'beringin', name: 'Beringin', scientific_name: 'Ficus benjamina', icon: '🌳', category: 'shade', co2_per_year: 35 },
  { id: 'trembesi', name: 'Trembesi', scientific_name: 'Samanea saman', icon: '🌳', category: 'shade', co2_per_year: 28.5 },
  { id: 'ketapang', name: 'Ketapang', scientific_name: 'Terminalia catappa', icon: '🌳', category: 'shade', co2_per_year: 26 },
  { id: 'flamboyan', name: 'Flamboyan', scientific_name: 'Delonix regia', icon: '🌺', category: 'shade', co2_per_year: 24 },
  { id: 'angsana', name: 'Angsana', scientific_name: 'Pterocarpus indicus', icon: '🌳', category: 'shade', co2_per_year: 30 },
  
  // Kayu
  { id: 'jati', name: 'Jati', scientific_name: 'Tectona grandis', icon: '🪵', category: 'timber', co2_per_year: 32 },
  { id: 'mahoni', name: 'Mahoni', scientific_name: 'Swietenia mahagoni', icon: '🪵', category: 'timber', co2_per_year: 28 },
  { id: 'sengon', name: 'Sengon', scientific_name: 'Albizia chinensis', icon: '🌲', category: 'timber', co2_per_year: 20 },
  { id: 'akasia', name: 'Akasia', scientific_name: 'Acacia mangium', icon: '🌲', category: 'timber', co2_per_year: 26 },
  
  // Hias
  { id: 'sakura', name: 'Sakura', scientific_name: 'Prunus serrulata', icon: '🌸', category: 'ornamental', co2_per_year: 12 },
  { id: 'kamboja', name: 'Kamboja', scientific_name: 'Plumeria rubra', icon: '🌺', category: 'ornamental', co2_per_year: 10 },
  { id: 'bougainville', name: 'Bugenvil', scientific_name: 'Bougainvillea', icon: '🌺', category: 'ornamental', co2_per_year: 8 },
  { id: 'tabebuya', name: 'Tabebuya', scientific_name: 'Tabebuia rosea', icon: '🌸', category: 'ornamental', co2_per_year: 18 },
  
  // Palem
  { id: 'palem_raja', name: 'Palem Raja', scientific_name: 'Roystonea regia', icon: '🌴', category: 'palm', co2_per_year: 18 },
  { id: 'pinang', name: 'Pinang', scientific_name: 'Areca catechu', icon: '🌴', category: 'palm', co2_per_year: 14 },
  { id: 'kurma', name: 'Kurma', scientific_name: 'Phoenix dactylifera', icon: '🌴', category: 'palm', co2_per_year: 16 },
];
```

### 4. Achievement / Pencapaian

```typescript
interface Achievement {
  id: string;
  name: string;                 // "Penanam Pertama"
  description: string;          // "Tanam pohon pertamamu"
  icon: string;                 // "🌱"
  
  // Requirement
  requirement: {
    type: 'trees' | 'streak' | 'points' | 'challenge' | 'carbon';
    count: number;
  };
  
  // Reward
  points_reward: number;
  badge_url?: string;
  
  is_active: boolean;
}
```

#### Default Achievements
```typescript
const ACHIEVEMENTS = [
  { id: 'first_tree', name: 'Penanam Pertama', icon: '🌱', requirement: { type: 'trees', count: 1 }, points: 50 },
  { id: 'tree_10', name: 'Penghijauan Pemula', icon: '🌿', requirement: { type: 'trees', count: 10 }, points: 100 },
  { id: 'tree_50', name: 'Pejuang Hijau', icon: '🌳', requirement: { type: 'trees', count: 50 }, points: 250 },
  { id: 'tree_100', name: 'Master Penghijauan', icon: '🏆', requirement: { type: 'trees', count: 100 }, points: 500 },
  { id: 'streak_7', name: 'Konsisten Seminggu', icon: '🔥', requirement: { type: 'streak', count: 7 }, points: 100 },
  { id: 'streak_30', name: 'Dedikasi Sebulan', icon: '💪', requirement: { type: 'streak', count: 30 }, points: 300 },
  { id: 'carbon_100', name: 'Penyerap Karbon', icon: '💨', requirement: { type: 'carbon', count: 100 }, points: 200 },
  { id: 'carbon_1000', name: 'Carbon Hero', icon: '🌍', requirement: { type: 'carbon', count: 1000 }, points: 1000 },
];
```

### 5. Daily Quest / Misi Harian

```typescript
interface DailyQuest {
  id: string;
  name: string;                 // "Tanam 3 Pohon"
  description: string;
  icon: string;
  
  // Requirement
  requirement: {
    type: 'trees' | 'photo' | 'share' | 'learn';
    count: number;
  };
  
  // Reward
  points_reward: number;
  
  // Daily reset
  reset_time: string;           // "00:00" UTC+7
  is_active: boolean;
}
```

#### Default Daily Quests
```typescript
const DAILY_QUESTS = [
  { id: 'daily_tree_1', name: 'Tanam 1 Pohon', icon: '🌱', requirement: { type: 'trees', count: 1 }, points: 20 },
  { id: 'daily_tree_3', name: 'Tanam 3 Pohon', icon: '🌳', requirement: { type: 'trees', count: 3 }, points: 50 },
  { id: 'daily_photo', name: 'Dokumentasi Pohon', icon: '📸', requirement: { type: 'photo', count: 1 }, points: 15 },
  { id: 'daily_share', name: 'Bagikan ke Komunitas', icon: '📢', requirement: { type: 'share', count: 1 }, points: 25 },
];
```

### 6. Challenge / Tantangan

```typescript
interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  banner_url?: string;
  
  // Duration
  start_date: timestamp;
  end_date: timestamp;
  
  // Requirement
  requirement: {
    type: 'trees' | 'carbon' | 'streak' | 'species';
    count: number;
    tree_type_id?: string;      // For specific tree challenges
  };
  
  // Rewards
  points_reward: number;
  badge_id?: string;
  prize_description?: string;
  
  // Participants
  max_participants?: number;
  
  status: 'upcoming' | 'active' | 'ended';
  is_featured: boolean;
}
```

### 7. Community Post / Feed Komunitas

```typescript
interface CommunityPost {
  id: string;
  user_id: string;
  tree_id?: string;             // Link ke pohon yang ditanam
  
  // Content
  content: string;
  images: string[];             // Array of image URLs
  
  // Location (optional)
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  // Engagement
  likes_count: number;
  comments_count: number;
  shares_count: number;
  
  // Status
  status: 'active' | 'hidden' | 'reported';
  created_at: timestamp;
  updated_at: timestamp;
}
```

### 8. RTH Location / Lokasi Ruang Terbuka Hijau

```typescript
interface RTHLocation {
  id: string;
  name: string;                 // "Taman Kota Makassar"
  description?: string;
  
  // Location
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  province: string;
  
  // Details
  type: 'park' | 'forest' | 'garden' | 'mangrove' | 'other';
  area_size?: number;           // Hectares
  facilities?: string[];        // ["Toilet", "Parkir", "Jogging Track"]
  operating_hours?: string;     // "06:00 - 18:00"
  
  // Media
  images: string[];
  
  // Stats
  trees_planted: number;        // Total pohon di lokasi ini
  total_co2_absorbed: number;
  
  is_active: boolean;
  created_at: timestamp;
}
```

### 9. Carbon Calculator Log

```typescript
interface CarbonLog {
  id: string;
  user_id: string;
  
  // Input
  category: 'transport' | 'electricity' | 'food' | 'waste';
  activity: string;             // "motor", "mobil", "listrik_rumah", etc.
  value: number;                // km, kWh, kg, etc.
  unit: string;
  
  // Result
  carbon_emission: number;      // kg CO2
  
  // Offset suggestion
  trees_needed: number;         // Jumlah pohon untuk offset
  
  calculated_at: timestamp;
}
```

#### Carbon Emission Factors
```typescript
const CARBON_FACTORS = {
  transport: {
    motor: 0.1,       // kg CO2 per km
    mobil: 0.21,
    bus: 0.089,
    kereta: 0.041,
    pesawat: 0.255,
  },
  electricity: {
    per_kwh: 0.7,     // kg CO2 per kWh (Indonesia average)
  },
  food: {
    daging_sapi: 27,  // kg CO2 per kg
    daging_ayam: 6.9,
    ikan: 5,
    sayuran: 2,
    nasi: 2.7,
  },
  waste: {
    per_kg: 0.5,      // kg CO2 per kg sampah
  },
};
```

### 10. Notification

```typescript
interface Notification {
  id: string;
  user_id: string;
  
  type: 'achievement' | 'challenge' | 'reminder' | 'system' | 'social';
  title: string;
  body: string;
  icon?: string;
  
  // Action
  action_type?: 'navigate' | 'url';
  action_target?: string;       // Screen name or URL
  
  is_read: boolean;
  created_at: timestamp;
}
```

### 11. Leaderboard

```typescript
interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  
  // Stats for ranking
  total_trees: number;
  total_points: number;
  total_co2: number;
  
  // Badges
  level: number;
  level_name: string;
  achievements_count: number;
}
```

---

## Fitur & Endpoint

### Admin Panel Features

#### 1. Dashboard
- Total pengguna aktif
- Total pohon tertanam (pending/verified)
- Total CO2 diserap
- Grafik pertumbuhan mingguan/bulanan
- Top contributors

#### 2. User Management
```
GET    /api/admin/users              - List all users (paginated)
GET    /api/admin/users/:id          - Get user detail
PUT    /api/admin/users/:id          - Update user
DELETE /api/admin/users/:id          - Delete user
GET    /api/admin/users/:id/trees    - Get user's trees
GET    /api/admin/users/:id/stats    - Get user statistics
```

#### 3. Tree Management
```
GET    /api/admin/trees              - List all trees (paginated, filterable)
GET    /api/admin/trees/:id          - Get tree detail
PUT    /api/admin/trees/:id          - Update tree
DELETE /api/admin/trees/:id          - Delete tree
POST   /api/admin/trees/:id/verify   - Verify tree
POST   /api/admin/trees/:id/reject   - Reject tree with reason
```

#### 4. Tree Types Management
```
GET    /api/admin/tree-types         - List all tree types
POST   /api/admin/tree-types         - Create tree type
PUT    /api/admin/tree-types/:id     - Update tree type
DELETE /api/admin/tree-types/:id     - Delete tree type
```

#### 5. Challenge Management
```
GET    /api/admin/challenges         - List all challenges
POST   /api/admin/challenges         - Create challenge
PUT    /api/admin/challenges/:id     - Update challenge
DELETE /api/admin/challenges/:id     - Delete challenge
GET    /api/admin/challenges/:id/participants - List participants
```

#### 6. Achievement Management
```
GET    /api/admin/achievements       - List all achievements
POST   /api/admin/achievements       - Create achievement
PUT    /api/admin/achievements/:id   - Update achievement
DELETE /api/admin/achievements/:id   - Delete achievement
```

#### 7. Daily Quest Management
```
GET    /api/admin/quests             - List all daily quests
POST   /api/admin/quests             - Create quest
PUT    /api/admin/quests/:id         - Update quest
DELETE /api/admin/quests/:id         - Delete quest
```

#### 8. RTH Location Management
```
GET    /api/admin/rth                - List all RTH locations
POST   /api/admin/rth                - Create location
PUT    /api/admin/rth/:id            - Update location
DELETE /api/admin/rth/:id            - Delete location
```

#### 9. Community Moderation
```
GET    /api/admin/posts              - List all posts
GET    /api/admin/posts/reported     - List reported posts
PUT    /api/admin/posts/:id/hide     - Hide post
PUT    /api/admin/posts/:id/restore  - Restore post
DELETE /api/admin/posts/:id          - Delete post
```

#### 10. Reports & Analytics
```
GET    /api/admin/reports/overview   - Platform overview
GET    /api/admin/reports/trees      - Trees statistics
GET    /api/admin/reports/users      - User growth
GET    /api/admin/reports/carbon     - Carbon impact
GET    /api/admin/reports/export     - Export data (CSV/Excel)
```

### Mobile API Endpoints

#### Authentication
```
POST   /api/auth/register            - Register new user
POST   /api/auth/login               - Login
POST   /api/auth/logout              - Logout
POST   /api/auth/refresh             - Refresh token
POST   /api/auth/forgot-password     - Request password reset
POST   /api/auth/reset-password      - Reset password
```

#### User
```
GET    /api/user/profile             - Get current user profile
PUT    /api/user/profile             - Update profile
PUT    /api/user/avatar              - Upload avatar
GET    /api/user/stats               - Get user statistics
PUT    /api/user/settings            - Update settings
```

#### Trees
```
GET    /api/trees                    - List user's trees
POST   /api/trees                    - Create new tree (with photo)
GET    /api/trees/:id                - Get tree detail
PUT    /api/trees/:id                - Update tree
DELETE /api/trees/:id                - Delete tree
GET    /api/trees/types              - Get all tree types
GET    /api/trees/nearby             - Get trees near location
```

#### Achievements & Quests
```
GET    /api/achievements             - Get all achievements with progress
GET    /api/quests/daily             - Get daily quests with progress
POST   /api/quests/:id/claim         - Claim quest reward
```

#### Challenges
```
GET    /api/challenges               - List active challenges
GET    /api/challenges/:id           - Get challenge detail
POST   /api/challenges/:id/join      - Join challenge
GET    /api/challenges/:id/leaderboard - Challenge leaderboard
```

#### Community
```
GET    /api/community/feed           - Get community feed
POST   /api/community/posts          - Create post
GET    /api/community/posts/:id      - Get post detail
POST   /api/community/posts/:id/like - Like post
POST   /api/community/posts/:id/comment - Comment on post
DELETE /api/community/posts/:id      - Delete own post
POST   /api/community/posts/:id/report - Report post
```

#### Carbon Calculator
```
POST   /api/carbon/calculate         - Calculate carbon footprint
GET    /api/carbon/history           - Get calculation history
GET    /api/carbon/tips              - Get reduction tips
```

#### RTH / Map
```
GET    /api/rth                      - Get all RTH locations
GET    /api/rth/:id                  - Get RTH detail
GET    /api/rth/nearby               - Get nearby RTH
```

#### Leaderboard
```
GET    /api/leaderboard              - Get global leaderboard
GET    /api/leaderboard/weekly       - Weekly leaderboard
GET    /api/leaderboard/monthly      - Monthly leaderboard
GET    /api/leaderboard/city/:city   - City leaderboard
```

#### Notifications
```
GET    /api/notifications            - Get user notifications
PUT    /api/notifications/:id/read   - Mark as read
PUT    /api/notifications/read-all   - Mark all as read
DELETE /api/notifications/:id        - Delete notification
```

---

## User Flow

### 1. Onboarding Flow
```
Splash Screen
    ↓
Onboarding Slides (3 slides)
    ↓
Login / Register
    ↓
Profile Setup (optional)
    ↓
Home Screen
```

### 2. Tree Planting Flow
```
Home Screen
    ↓
Tap "Tanam Pohon" / Camera Tab
    ↓
Form Screen (CameraScreen)
  - Select Tree Type (required)
  - Auto-detect Location
  - Add Notes (optional)
  - View Impact Preview
    ↓
Tap "Foto Pohon"
    ↓
Camera View
  - Take Photo
    ↓
Photo Preview Screen
  - Review Photo
  - Confirm Details
    ↓
Tap "Simpan"
    ↓
Success Screen
  - Points Earned
  - CO2 Impact
  - Share Option
    ↓
Return to Home
```

### 3. Daily Quest Flow
```
Home Screen (Quest Section)
    ↓
View Active Quests
    ↓
Complete Quest Action
    ↓
Quest Auto-updates Progress
    ↓
When Complete → Claim Reward
    ↓
Points Added to User
```

---

## Component Reference

### Mobile App Screens

| Screen | Description | Key Components |
|--------|-------------|----------------|
| `HomeScreen` | Dashboard utama | Stats, Quick Actions, Daily Quests, Tips |
| `CameraScreen` | Form tambah pohon | Tree Picker, Location, Notes, Impact Preview |
| `PhotoPreviewScreen` | Preview foto pohon | Photo, Details Confirmation |
| `ProfileScreen` | Profil pengguna | Avatar, Stats, Achievements, Settings |
| `StatisticsScreen` | Statistik detail | Charts, History, Impact |
| `MapScreen` | Peta RTH | Map View, Markers, Location List |
| `CommunityFeedScreen` | Feed komunitas | Post List, Create Post |
| `CarbonCalculatorScreen` | Kalkulator karbon | Calculator Form, Results, Tips |
| `LeaderboardScreen` | Papan peringkat | Rankings, Filters |
| `ChallengeScreen` | Daftar tantangan | Challenge Cards, Progress |
| `EcoWalletScreen` | Eco Wallet/Poin | Points Balance, History, Rewards |
| `NotificationsScreen` | Notifikasi | Notification List |

### Admin Panel Pages

| Page | Description | Features |
|------|-------------|----------|
| `/dashboard` | Overview | Stats Cards, Charts, Recent Activity |
| `/users` | User Management | User Table, Search, Filter, Actions |
| `/users/:id` | User Detail | Profile, Trees, Stats, Edit |
| `/trees` | Tree Management | Tree Table, Verification Queue |
| `/trees/:id` | Tree Detail | Photo, Location, Status, Actions |
| `/tree-types` | Tree Types | CRUD Tree Types |
| `/challenges` | Challenges | CRUD Challenges |
| `/achievements` | Achievements | CRUD Achievements |
| `/quests` | Daily Quests | CRUD Quests |
| `/rth` | RTH Locations | CRUD Locations, Map View |
| `/community` | Community | Post Moderation |
| `/reports` | Reports | Analytics, Export |
| `/settings` | Settings | App Config, Notifications |

---

## Admin Panel UI Guidelines

### Color Usage in Admin

```css
/* Primary Actions */
.btn-primary { background: #059669; }
.btn-secondary { background: #3B82F6; }
.btn-danger { background: #EF4444; }
.btn-warning { background: #F59E0B; }

/* Status Colors */
.status-pending { background: #FEF3C7; color: #92400E; }
.status-verified { background: #D1FAE5; color: #065F46; }
.status-rejected { background: #FEE2E2; color: #991B1B; }

/* Sidebar */
.sidebar { background: #065F46; }
.sidebar-item-active { background: #059669; }

/* Cards */
.card { background: #FFFFFF; border-radius: 12px; }
.card-header { border-bottom: 1px solid #E5E7EB; }
```

### Table Design
```
- Striped rows for readability
- Sticky header on scroll
- Pagination: 10, 25, 50, 100 items per page
- Search & filter at top
- Bulk actions when applicable
- Action buttons: View, Edit, Delete
```

### Form Design
```
- Labels above inputs
- Required fields marked with *
- Validation messages below inputs
- Save/Cancel buttons at bottom
- Confirmation modal for destructive actions
```

---

## Environment Variables

### Mobile App (.env)
```
API_URL=https://api.aksihijau.com
GOOGLE_MAPS_API_KEY=xxx
SENTRY_DSN=xxx
```

### Admin Panel (.env)
```
NEXT_PUBLIC_API_URL=https://api.aksihijau.com
DATABASE_URL=postgresql://...
JWT_SECRET=xxx
CLOUDINARY_URL=xxx
```

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=xxx
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
FIREBASE_PROJECT_ID=xxx
SMTP_HOST=xxx
SMTP_USER=xxx
SMTP_PASS=xxx
```

---

## Deployment Checklist

### Mobile App
- [ ] Update version number
- [ ] Test on iOS & Android
- [ ] Generate release builds
- [ ] Submit to App Store & Play Store

### Admin Panel
- [ ] Build production bundle
- [ ] Deploy to Vercel/Netlify
- [ ] Configure custom domain
- [ ] Set up SSL

### Backend
- [ ] Run database migrations
- [ ] Seed initial data (tree types, achievements)
- [ ] Deploy to Railway/Render/AWS
- [ ] Configure environment variables
- [ ] Set up monitoring (Sentry, LogRocket)

---

## Contact & Support

**Project:** Aksi Hijau (EcoUnity)
**Version:** 1.0.0
**Last Updated:** January 2025

---

*Dokumen ini adalah panduan teknis untuk pengembangan Admin Panel yang sinkron dengan Mobile App Aksi Hijau.*
