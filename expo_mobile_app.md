# Expo React Native - Sedekah Hijau Mobile App Screens
## Mobile App Screen Requirements

### 1. List Data Screen (Home Dashboard)

#### Header Section
```
┌─────────────────────────────────────┐
│ 🌱 Selamat pagi, Ahmad!             │
│ Makassar, 27°C ☀️                  │
│ Target hari ini: 5 pohon           │
└─────────────────────────────────────┘
```

#### Statistics Cards (Horizontal Scroll)
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   23     │ │  156     │ │ 11.47%   │ │  2.3t    │
│ Pohon    │ │ Komunitas│ │   RTH    │ │   CO2    │
│ Saya     │ │ Pohon    │ │ Makassar │ │ Diserap  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

#### Quick Actions
```
┌─────────────────────────────────────┐
│ Aksi Cepat                          │
├─────────────────────────────────────┤
│ 📷 Tanam Pohon Baru                 │
│ 🗺️ Lihat Peta RTH                   │
│ 📊 Statistik Bulanan                │
│ 🏆 Leaderboard                      │
└─────────────────────────────────────┘
```

#### Recent Activities Feed
```
┌─────────────────────────────────────┐
│ Aktivitas Terbaru                   │
├─────────────────────────────────────┤
│ [📸] Budi menanam Mahoni            │
│      Taman Kota, 2 jam lalu         │
├─────────────────────────────────────┤
│ [📸] Sari menanam Mangga            │
│      Jl. Perintis, 4 jam lalu       │
├─────────────────────────────────────┤
│ [🏆] Anda mencapai target minggu!   │
│      5 pohon telah ditanam          │
└─────────────────────────────────────┘
```

#### Mini Map Section
```
┌─────────────────────────────────────┐
│ Peta RTH Terdekat                   │
│ ┌─────────────────────────────────┐ │
│ │        🗺️ MAP VIEW              │ │
│ │    📍 📍    📍                  │ │
│ │      📍  📍      📍             │ │
│ │  📍        📍                   │ │
│ └─────────────────────────────────┘ │
│ 12 lokasi RTH dalam radius 5km      │
└─────────────────────────────────────┘
```

### 2. Camera Screen (Tree Documentation)

#### Camera Interface
```
┌─────────────────────────────────────┐
│ ← Kembali              🔄 Balik     │
├─────────────────────────────────────┤
│                                     │
│         CAMERA VIEWFINDER           │
│                                     │
│    📍 Lokasi: Jl. Veteran No.1     │
│    🧭 Arah: Utara (15°)             │
│                                     │
│         ⊞ ⊞ ⊞ (Grid Lines)          │
│                                     │
├─────────────────────────────────────┤
│ ⚡ Flash   [⚪ Capture]   🖼️ Gallery │
└─────────────────────────────────────┘
```

#### Pre-Capture Form
```
┌─────────────────────────────────────┐
│ Informasi Penanaman                 │
├─────────────────────────────────────┤
│ Jenis Pohon: [Dropdown ▼]          │
│ ├─ Mahoni                           │
│ ├─ Mangga                           │
│ ├─ Ketapang                         │
│ └─ Lainnya...                       │
├─────────────────────────────────────┤
│ Lokasi: [GPS Auto] 📍               │
│ Jl. Veteran No.1, Makassar         │
├─────────────────────────────────────┤
│ Catatan: [Text Input]               │
│ "Ditanam bersama komunitas..."      │
├─────────────────────────────────────┤
│ [📷 Ambil Foto]                     │
└─────────────────────────────────────┘
```

#### Photo Preview & Upload
```
┌─────────────────────────────────────┐
│ ← Kembali    Preview    Ulang 🔄    │
├─────────────────────────────────────┤
│                                     │
│         PHOTO PREVIEW               │
│       [Captured Tree Image]         │
│                                     │
├─────────────────────────────────────┤
│ ✓ GPS Terverifikasi                 │
│ ✓ Kualitas Foto Baik                │
│ ✓ Jenis Pohon: Mahoni               │
├─────────────────────────────────────┤
│ [🚀 Upload & Simpan]                │
│ [📝 Edit Info]                      │
└─────────────────────────────────────┘
```

### 3. Profile Screen (User Dashboard)

#### Profile Header
```
┌─────────────────────────────────────┐
│        [Profile Picture]            │
│         Ahmad Wijaya                │
│    📍 Makassar, Sulawesi Selatan    │
│      Bergabung sejak Jan 2024       │
└─────────────────────────────────────┘
```

#### Personal Statistics
```
┌─────────────────────────────────────┐
│ Kontribusi Saya                     │
├─────────────────────────────────────┤
│ 🌱 23 Pohon Ditanam                 │
│ 🏆 Peringkat #15 di Makassar        │
│ 📅 45 Hari Aktif                    │
│ 🌿 2.3 Ton CO2 Diserap              │
└─────────────────────────────────────┘
```

#### Achievement Badges
```
┌─────────────────────────────────────┐
│ Pencapaian                          │
├─────────────────────────────────────┤
│ 🥇 Penanam Pertama    🌟 Konsisten  │
│ 🌳 Ahli Mahoni        📸 Fotografer │
│ 🤝 Kolaborator        🎯 Target     │
└─────────────────────────────────────┘
```

#### Activity History Timeline
```
┌─────────────────────────────────────┐
│ Riwayat Aktivitas                   │
├─────────────────────────────────────┤
│ ● 27 Agu - Menanam Ketapang         │
│   Taman Hasanuddin                  │
│   [📸 Lihat Foto]                   │
├─────────────────────────────────────┤
│ ● 25 Agu - Menanam Mangga           │
│   Jl. Perintis Kemerdekaan         │
│   [📸 Lihat Foto]                   │
├─────────────────────────────────────┤
│ ● 20 Agu - Event Komunitas          │
│   Penanaman Massal Pantai Losari   │
│   [👥 5 peserta]                    │
└─────────────────────────────────────┘
```

#### Settings Menu
```
┌─────────────────────────────────────┐
│ Pengaturan                          │
├─────────────────────────────────────┤
│ 👤 Edit Profil                  >   │
│ 🔔 Notifikasi                   >   │
│ 🌐 Bahasa                       >   │
│ 🔒 Privasi                      >   │
│ 📊 Data Saya                    >   │
│ ❓ Bantuan                       >   │
│ 🚪 Keluar                       >   │
└─────────────────────────────────────┘
```

## Additional Screens & Features

### Map View Screen (Full Map)
```
┌─────────────────────────────────────┐
│ ← Peta RTH Makassar     🔍 Cari     │
├─────────────────────────────────────┤
│                                     │
│           FULL MAP VIEW             │
│     📍🌳 📍🌳    📍🌳              │
│   📍🌳    🏢    📍🌳   📍🌳        │
│     📍🌳      📍🌳                 │
│                                     │
├─────────────────────────────────────┤
│ 🌳 Pohon  🏞️ RTH  📊 Filter        │
└─────────────────────────────────────┘
```

### Tree Detail Screen
```
┌─────────────────────────────────────┐
│ ← Detail Pohon                      │
├─────────────────────────────────────┤
│        [Large Tree Photo]           │
├─────────────────────────────────────┤
│ Jenis: Mahoni (Swietenia mahagoni)  │
│ Ditanam: 15 Agustus 2024            │
│ Oleh: Ahmad Wijaya                  │
│ Lokasi: Taman Hasanuddin            │
├─────────────────────────────────────┤
│ Status Pertumbuhan:                 │
│ ████████░░ 80% Sehat                │
├─────────────────────────────────────┤
│ Perawatan Terakhir: 20 Agu 2024     │
│ Penyiraman: Rutin                   │
│ Kondisi: Baik                       │
├─────────────────────────────────────┤
│ [📊 Lihat Progress]                 │
│ [📝 Tambah Catatan]                 │
└─────────────────────────────────────┘
```

### Statistics Dashboard
```
┌─────────────────────────────────────┐
│ ← Statistik Lingkungan              │
├─────────────────────────────────────┤
│ Dampak Lingkungan Anda:             │
│                                     │
│ CO2 Diserap (Ton)                   │
│ ████████████░░░░░░░░ 2.3/5.0        │
│                                     │
│ Suhu Diturunkan (°C)                │
│ ██████░░░░░░░░░░░░░░░ 0.8/2.0        │
│                                     │
│ Area Hijau Dibuat (m²)              │
│ ███████████░░░░░░░░░ 156/300         │
├─────────────────────────────────────┤
│ Progress Bulanan                    │
│     [Bar Chart Visualization]       │
├─────────────────────────────────────┤
│ Target 2024: 50 pohon               │
│ Progress: ████████░░ 46%            │
└─────────────────────────────────────┘
```

### Leaderboard Screen
```
┌─────────────────────────────────────┐
│ ← Leaderboard Makassar              │
├─────────────────────────────────────┤
│ 🥇 1. Budi Santoso     - 156 pohon  │
│ 🥈 2. Sari Indah       - 143 pohon  │
│ 🥉 3. Agus Prasetyo    - 128 pohon  │
│    4. Made Wijaya      - 87 pohon   │
│    ...                              │
│   15. Ahmad Wijaya     - 23 pohon   │ ← You
│    ...                              │
├─────────────────────────────────────┤
│ Filter: [Bulan Ini ▼] [Kota ▼]     │
├─────────────────────────────────────┤
│ Kontribusi Komunitas:               │
│ 🏢 Forum Hijau Makassar - 2,345     │
│ 🌱 Green Community      - 1,876     │
│ 🎓 Mahasiswa Peduli     - 1,234     │
└─────────────────────────────────────┘
```

## Key Indonesian UI Elements

### Navigation Labels
- **List Data**: "Beranda" or "Data Pohon"
- **Kamera**: "Kamera" 
- **Profile**: "Profil"

### Common Buttons
- **Tanam Pohon Baru**: Plant New Tree
- **Lihat Peta**: View Map
- **Simpan**: Save
- **Batal**: Cancel
- **Upload**: Upload
- **Bagikan**: Share

### Status Indicators
- **Sehat**: Healthy
- **Perlu Perawatan**: Needs Care
- **Tumbuh Baik**: Growing Well
- **Baru Ditanam**: Newly Planted

### Environmental Terms
- **Ruang Terbuka Hijau (RTH)**: Green Open Space
- **Penyerapan CO2**: CO2 Absorption
- **Keanekaragaman Hayati**: Biodiversity
- **Mitigasi Iklim**: Climate Mitigation

This mobile app design focuses on ease of use, clear Indonesian localization, and encouraging user engagement through gamification and community features while maintaining the environmental mission of the Sedekah Hijau program.
