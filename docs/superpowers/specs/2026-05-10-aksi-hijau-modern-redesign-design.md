# Aksi Hijau — Modern Redesign Design Spec

**Date:** 2026-05-10
**Scope:** Full mobile app redesign (React Native / Expo SDK 54)
**Aesthetic direction:** Organic Nature × Editorial Magazine
**Mode:** Light only (dark mode deferred)
**Status:** Draft for user review

---

## 1. Vision

> *"A field guide to the planet you're saving."*

Aksi Hijau dirancang ulang sebagai **majalah botani modern**: setiap layar terbaca seperti artikel — *kicker → headline → lede → body* — dengan angka data yang diperlakukan sebagai tipografi utama, bukan sekadar isi kartu. Identitas visual dibangun di sekitar tiga keputusan pembeda yang dipakai konsisten di seluruh app:

1. **Numbers as hero typography.** Angka utama (jumlah pohon, CO₂ terserap, level) tampil sebagai headline serif raksasa Fraunces 64–96pt. Tiap kali user buka app, angka itulah yang bicara duluan.
2. **Botanical specimen plate.** Setiap pohon ditampilkan seperti halaman buku botani: nama latin italic, garis ukur halus, label data berformat tabel monospaced. Aktivitas "menanam pohon" jadi sakral, bukan sekadar gamifikasi point.
3. **Editorial rule lines + folio numbers.** Garis 1px horizontal antar section + angka kecil di pojok layar (mirip nomor halaman majalah) sebagai aksen tetap. Inilah "satu detail yang diingat".

Mood reference: Aesop · Are.na · NYT Cooking · Kinfolk · field-guide books (Peterson, Collins).

**Out of scope:** Backend, admin panel, dark mode, animations advanced (Reanimated layout transitions), TypeScript migration, accessibility audit beyond minimum.

---

## 2. Color System

Earth tones dalam dengan canvas warm-bone (bukan putih). Hijau jadi *brand voice*, terracotta + ochre jadi *spark*. Tidak ada gradien penuh — paling banter very-subtle paper-to-bone gradient di hero.

| Token | Hex | Usage |
|---|---|---|
| `bone` | `#F4EFE6` | Canvas/background utama app |
| `paper` | `#FBF8F1` | Surface kartu, modal, sheet |
| `paper-deep` | `#EDE6D5` | Surface tertekan (active state, input bg) |
| `ink` | `#1B1F1A` | Teks utama, headline |
| `ink-muted` | `#5A5F55` | Body sekunder, caption, metadata |
| `ink-faint` | `#8A8E83` | Disabled, placeholder |
| `rule` | `#D9D2C2` | Divider, hairline border |
| `forest` | `#1F3D2B` | Primary brand: tombol, link, headline aksen |
| `forest-deep` | `#15291D` | Hover/pressed primary |
| `moss` | `#4A6B3A` | Verified badge, secondary action |
| `sage` | `#C7D3B5` | Chip lembut, tag, fill subtle |
| `sage-deep` | `#9FB089` | Sage hover/active |
| `clay` | `#B5532A` | Streak api, accent panas, highlight angka |
| `clay-soft` | `#E8C8B3` | Streak background, soft warning |
| `ochre` | `#C89B3C` | Achievement gold, level badge, premium |
| `ochre-soft` | `#F0DCAF` | Achievement bg |
| `sky` | `#3F5E78` | Info, lokasi/GPS, link sekunder |
| `sky-soft` | `#CFD9E1` | Info bg |
| `signal-red` | `#9B2D20` | Error, rejected status |
| `signal-red-soft` | `#EBC9C4` | Error bg |

**Distribution rule (≈):** 70% canvas + ink · 20% forest/moss · 5% clay/ochre · 5% sage/sky.

**Status colors mapping:**
- `pending` → `ochre` text on `ochre-soft` bg
- `verified` → `moss` text on `sage` bg
- `rejected` → `signal-red` text on `signal-red-soft` bg

---

## 3. Typography

### Font stack
- **Display:** Fraunces (variable, opsz aktif, SOFT 50, WONK 1 di ukuran besar). Italic eksklusif untuk nama latin & istilah ilmiah.
- **Body:** Inter Tight (sans, x-height tinggi, hemat ruang vertikal mobile).
- **Mono:** JetBrains Mono — eksklusif untuk angka pengukuran dengan unit (kg, km, °C, koordinat) & ID kode.

### Type scale (mobile baseline 375pt)

| Token | Size / LH | Font | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| `display-xl` | 96 / 92 | Fraunces | 400 | -0.04em | Hero number Home & Statistics |
| `display-lg` | 64 / 64 | Fraunces | 400 | -0.03em | Headline layar (TreeDetail, Profile) |
| `display-md` | 44 / 48 | Fraunces | 400 | -0.02em | Section opener besar |
| `headline` | 28 / 34 | Fraunces | 500 | -0.015em | Judul kartu utama, modal title |
| `title` | 20 / 26 | Fraunces | 500 | -0.01em | Judul section, item list |
| `latin-italic` | 16 / 22 | Fraunces | 400 italic | 0 | Nama latin pohon |
| `body-lg` | 17 / 26 | Inter Tight | 400 | 0 | Body utama |
| `body` | 15 / 23 | Inter Tight | 400 | 0 | Body standar |
| `body-sm` | 13 / 20 | Inter Tight | 400 | 0 | Caption, helper |
| `label` | 11 / 14 | Inter Tight | 600 | 0.14em UPPERCASE | Kicker/eyebrow, badge, tab |
| `data-mono` | 12 / 16 | JetBrains Mono | 400 | 0.02em | Pengukuran kecil |
| `data-mono-lg` | 18 / 22 | JetBrains Mono | 500 | 0 | Angka di tabel spesimen |
| `button` | 15 / 20 | Inter Tight | 600 | 0.01em | Tombol |

### Editorial rules (wajib diikuti)
1. **Kicker pattern:** tiap section dimulai dengan satu baris `label` uppercase di atas headline serif.
2. **Drop figure:** angka utama selalu Fraunces, bukan sans.
3. **Italic = scientific only.** Untuk emphasis biasa, gunakan weight 500.
4. **Mono = measurement only.** Poin/level pakai Fraunces (mereka adalah "drop figure", bukan pengukuran).
5. **No ALL CAPS Fraunces.** Uppercase hanya untuk Inter Tight `label`.

### Implementasi
- Ganti `@expo-google-fonts/sora` & `@expo-google-fonts/kulim-park` dengan `@expo-google-fonts/fraunces`, `@expo-google-fonts/inter-tight`, `@expo-google-fonts/jetbrains-mono`.
- Buat helper components di `src/components/atoms/typography/`: `<Display>`, `<Headline>`, `<Title>`, `<Body>`, `<Label>`, `<Mono>`, `<Latin>`. Developer **tidak pernah** hardcode `fontFamily` lagi.
- React Native tidak mendukung variable axes secara native — pakai weight terdekat per ukuran (Fraunces 400 default, 500 untuk emphasis). Soft/Wonk diapproksimasi dengan font file pre-baked jika perlu.

---

## 4. Spacing, Radius, Elevation, Layout

### Spacing scale (4pt base)
`xs 4 · sm 8 · md 12 · lg 16 · xl 20 · 2xl 24 · 3xl 32 · 4xl 40 · 5xl 56 · 6xl 80`

Section gap di layar: `4xl–5xl` (40–56pt). Editorial layout butuh nafas; jangan padatkan ke 16pt.

### Border radius
`none 0 · sm 4 · md 8 · lg 12 · xl 16 · pill 999`

**Aturan radius (penting untuk character):**
- Tombol primary, kartu utama, modal: `lg` (12) — tidak bulat berlebihan, terasa printed.
- Chip, badge, status pill: `pill`.
- Input, surface tertekan: `md` (8).
- Avatar, ikon dalam circle: `pill`.
- Photo/image card: `sm` (4) — sengaja kecil untuk feel "polaroid/specimen".
- **Tidak ada** radius `2xl/3xl` (24–28). Itu signature design lama yang mau dibuang.

### Elevation
Bayangan dipakai sangat hemat. Editorial = flat with rule lines, bukan flat with shadows everywhere.

| Token | Spec | Usage |
|---|---|---|
| `flat` | none + 1px `rule` border | Default kartu (paling sering dipakai) |
| `lift` | `0 1 2 0 rgba(27,31,26,0.06)` | Tombol primary, FAB |
| `float` | `0 8 24 0 rgba(27,31,26,0.10)` | Modal, bottom sheet, dropdown |
| `press` | inset `0 1 2 0 rgba(0,0,0,0.05)` | Active button state |

### Layout grid
- App horizontal padding: **24pt** kiri-kanan (lega, editorial).
- Hero section bisa break to edge (`-24pt margin`) untuk foto full-bleed.
- Asimetri terkontrol: kicker label sering offset ke kanan (text-align right) sementara headline kiri — "magazine masthead" feel.
- **Folio number**: angka kecil mono `01 / 04` di pojok kanan-atas tiap layar utama (di luar safe area, di header bar). Angka ini = nomor screen di flow saat itu.
- **Rule lines**: 1px `rule` color memisahkan section. Lebih sering dipakai daripada shadow.

---

## 5. Component Patterns

Semua komponen di-redesign. Folder `src/components/buttons/` di-deprecate; sumber kebenaran tunggal: `src/components/atoms/` & `molecules/`.

### 5.1 Button
Variants: `primary · secondary · ghost · danger`
Sizes: `sm (h36) · md (h48) · lg (h56)`

- **Primary:** `forest` bg, `paper` text, no radius >12, `lift` shadow, hover/press → `forest-deep`.
- **Secondary:** transparent bg, 1px `ink` border, `ink` text. Looks like editorial outline button.
- **Ghost:** no border, `ink` text, underline appears on press (editorial link feel).
- **Danger:** `signal-red` bg, `paper` text.
- Icon-left default. Ikon line-style 1.5px stroke (lihat §5.7).
- Loading state: replace label with 3-dot pulsing animation (Inter Tight ellipsis), no spinner.

### 5.2 Card (`<Card />`)
Default: `paper` bg, 1px `rule` border, radius `lg`, padding `xl`. **Tidak ada shadow.**
Variants:
- `flat` (default)
- `elevated` (rare — only for modals/sheets, uses `float`)
- `specimen` (untuk pohon — lihat §5.5)
- `feature` (full-bleed image header + body — untuk featured challenge/post)

### 5.3 StatCard (Hero number style)
Layout vertikal:
```
LABEL UPPERCASE              ← label, ink-muted
247                          ← display-lg/xl Fraunces, ink/forest
pohon tertanam               ← body-sm, ink-muted
─────────────────────        ← rule line
TREN +12 BULAN INI           ← label, moss
```
Tidak ada ikon besar dekoratif di kartu stat. Angka *adalah* dekorasinya.

### 5.4 Badge / Chip
- **Badge** (status, kecil): pill, `body-sm` weight 600, padding `sm md`, ikon dot 6pt di kiri.
- **Chip** (filter/tag): radius `md`, 1px border `rule`, `body-sm`. Active: `forest` bg + `paper` text + no border.
- **Level badge** (Profile): octagon shape (custom SVG), `ochre` border 1.5px, level number Fraunces di tengah, label di bawah.

### 5.5 SpecimenCard (signature component baru)
Untuk display pohon — fokus utama identitas visual app.

```
┌─────────────────────────────┐
│  NO. 027 · BUAH             │  ← label kicker
│                             │
│  Mangga                     │  ← title, Fraunces
│  Mangifera indica           │  ← latin-italic
│                             │
│  [foto pohon, radius sm]    │  ← photo, polaroid feel
│                             │
│  ───────────────────────    │  ← rule
│  CO₂        22 KG/YR        │  ← data row (label + mono)
│  KATEGORI   BUAH            │
│  TINGGI MAX 20 M            │
│  DITANAM    14 MAR 2026     │
│  LOKASI     −5.13°S         │  ← koordinat italic-able
│             119.43°E        │
└─────────────────────────────┘
```
Dipakai di: TreeDetail (full-screen versi), Profile tree list (kompak 2-kolom), Camera form (preview).

### 5.6 Input / FormField
- Underline-only style (no full border): 1px `rule` bottom border, focus → 1.5px `forest`.
- Floating label: pakai pattern label kapital kecil di atas, bukan label-yang-bergerak.
- Background transparent (canvas show through), hanya `paper-deep` saat field aktif/error.
- Helper text di bawah `body-sm`, error pakai `signal-red`.

### 5.7 Iconography
- Style: **line, 1.5px stroke, rounded caps**. Tidak ada ikon filled (kecuali dot indicator).
- Source: hand-pick dari Phosphor Icons (regular weight) atau Lucide (sebelum dipakai, semua diunifikasi ke 1.5px stroke).
- Decorative botanical SVG (daun, ranting, kontur topografi tipis) sebagai aksen background di hero — **bukan** ikon UI utama.

### 5.8 Tab Bar
Redesign penuh — `CustomTabBar` glassmorphism saat ini diganti.

- Background: `paper` solid dengan 1px top border `rule`. **No glass blur.** Editorial = solid surfaces.
- 5 tab: Beranda · Statistik · Tanam (center) · Komunitas · Profil.
- Center "Tanam" button: lingkaran 56pt `forest` bg, ikon plus line, mengambang **2pt** di atas tab bar (subtle, bukan dramatic FAB).
- Active tab: ikon `forest`, label `label` size, dengan **1px rule line di atas ikon** (editorial active indicator) dengan lebar 24pt centered.
- Inactive: ikon `ink-muted`, no underline.

### 5.9 Header / Top bar
Per layar, bukan global. Pattern:
```
[← back]                    01 / 04   ← folio number kanan-atas mono
HALAMAN                               ← label kicker kiri
Profil Anda                           ← display-md Fraunces
─────────────────────────────         ← rule line
```
Status bar dark content di atas `bone` background.

### 5.10 Modal & Bottom Sheet
- Bottom sheet: radius top `lg` (12 only), `paper` bg, `float` shadow, drag handle 36×4 `rule` color.
- Modal: center, max width 320, `paper` bg, radius `lg`, padding `2xl`. Headline `headline`, body `body`, two-button row dengan ghost + primary.

### 5.11 Empty state
Tidak ada ilustrasi karakter generic. Gunakan:
- 1 botanical SVG line drawing di tengah (daun, ranting kosong)
- `headline` Fraunscess: "Belum ada pohon di sini."
- `body` Inter Tight 1 baris penjelasan
- 1 ghost button CTA

### 5.12 Loading state
- Initial app load: layar `bone`, logo wordmark "Aksi Hijau" di Fraunces center, fade in/out 1.5s.
- Skeleton: rectangle `paper-deep` color, no shimmer animation (terlalu sibuk untuk editorial). Hanya muncul jika data load >300ms.
- Inline button loading: 3 dot pulse (lihat §5.1).

---

## 6. Motion & Micro-interactions

Filosofi: **restrained, editorial.** Tidak ada animasi heboh. Setiap motion harus punya alasan.

| Trigger | Animation | Spec |
|---|---|---|
| Screen enter | Fade up | opacity 0→1, translateY 8→0, 280ms cubic-bezier(.2,.8,.2,1) |
| Hero number reveal (Home) | Counter tick + fade | Counter ke target dalam 800ms ease-out |
| Card press | Scale | 1 → 0.98, 100ms |
| Button press | Scale + bg darken | 1 → 0.97 + bg → forest-deep, 80ms |
| Tab switch | Active indicator slide | rule-line indicator translate horizontal, 220ms ease-out |
| Pull to refresh | Custom: rotating leaf SVG | Replace default spinner |
| Bottom sheet | Spring slide | translateY from bottom, spring stiffness 180 damping 22 |
| Quest completed | Flash + checkmark draw | bg flashes `sage` 200ms, then SVG check stroke draws over 400ms |
| Achievement unlock | Modal float + ochre border pulse | One time, ~1.2s total |

**Pakai library:** `react-native-reanimated` (sudah common di Expo). Tidak perlu Lottie kecuali untuk tree-grow celebration.

---

## 7. Per-Screen Layout Design

Format ringkas: kicker → headline → key sections.

### 7.1 LandingScreen (sebelum auth)
- Full bleed hero foto pohon (atau hand-drawn botanical SVG kalau no asset)
- Wordmark "Aksi Hijau" Fraunces display-lg di paper card overlap bawah hero
- Tagline `body-lg` Inter Tight: *"Catat. Tumbuhkan. Pulihkan."*
- 2 tombol stack: `Mulai` (primary) + `Sudah punya akun` (ghost)
- Folio `00 / 00` kanan-atas

### 7.2 OnboardingScreen
3 slides, masing-masing:
- Number Fraunces display-lg di kiri-atas (`01`, `02`, `03`)
- Botanical SVG illustration center
- Headline Fraunscess + body Inter Tight
- Page indicator: 3 rule lines (active = forest, inactive = rule color), bukan dot

### 7.3 LoginScreen / RegisterScreen / ForgotPasswordScreen
- Kicker `MASUK` / `DAFTAR` / `LUPA SANDI` (label uppercase)
- Headline `display-md`: "Selamat datang kembali."
- Form fields `Underline` style §5.6
- Primary button full width
- Footer link ghost: "Belum punya akun? Daftar"

### 7.4 HomeScreen 🌟 (most important)

```
─────────────────────────────────────────
[avatar]                       01 / 05
SELAMAT PAGI, ANINDYA                    ← label
Hari ke-12                                ← title
streak Anda berturut-turut.
─────────────────────────────────────────

PROGRESS HARI INI
2 dari 3                                  ← display-xl Fraunces
pohon tertanam hari ini

[progress bar tipis 2px, sage→forest]

─────────────────────────────────────────

DAMPAK ANDA SECARA TOTAL                  ← label
247                                       ← display-xl
pohon · 5.434 KG CO₂/YR                  ← body + mono inline

─────────────────────────────────────────

MISI HARI INI                             ← section label
[3 quest cards stacked, flat with rule borders]
  Tanam 1 pohon            +20 PTS
  Dokumentasikan pohon     +15 PTS
  Bagikan ke komunitas     +25 PTS

─────────────────────────────────────────

TIPS LAPANGAN                             ← editorial section
"Cara terbaik menanam pohon..."           ← title Fraunces
[body editorial text 3-4 lines]
[Read more →]

─────────────────────────────────────────
folio 01 / 05 di footer juga
```

**No** background gradient, **no** floating cards with shadows, **no** rounded-2xl. Pure editorial.

### 7.5 CameraScreen (form tanam pohon)
- Kicker `TANAM POHON BARU`
- Headline `display-md`: "Catat spesimen baru."
- Section 1: **Pilih Jenis** — chip horizontal scroll (`Semua · Buah · Peneduh · Kayu · Hias · Palem`), grid 2-kolom SpecimenCard mini di bawah
- Section 2: **Lokasi** — auto-detect, koordinat ditampilkan mono `−5.13°S 119.43°E`, alamat body
- Section 3: **Catatan** — Underline input multiline
- Section 4: **Dampak Diharapkan** — preview SpecimenCard untuk tree yang dipilih
- Sticky bottom: full-width primary button "Foto Pohon" dengan icon camera

### 7.6 PhotoPreviewScreen
- Photo full-bleed top (sm radius, polaroid feel — sengaja tidak full screen)
- Card overlap bawah dengan Specimen data
- Two-button row: Ghost "Foto ulang" + Primary "Simpan spesimen"

### 7.7 ProfileScreen
- Avatar 80pt circle kiri-atas
- Headline `display-lg`: nama user
- Sub: `latin-italic`-styled bio (italic Fraunces — pengecualian boleh untuk bio user)
- **Level badge** (octagon ochre, lihat §5.4) kanan-atas dengan angka level
- Stats grid 2×2 (StatCard §5.3): Pohon · CO₂ · Streak · Achievements
- Section: **Koleksi Spesimen** — grid 2-col SpecimenCard mini (recent 6 trees), CTA "Lihat semua"
- Section: **Pencapaian** — list achievement dengan ikon line + label uppercase status
- Section: **Pengaturan** — list-row pattern, ghost links

### 7.8 StatisticsScreen
- Hero stat huge: `display-xl` total CO₂
- Section: **Tren 12 Bulan** — bar chart minimalis (bars `forest` color, baseline `rule`, label mono di sumbu)
- Section: **Komposisi Spesies** — horizontal stacked bar 4pt height + legend list
- Section: **Lokasi Penanaman** — mini map preview (rounded sm) + koordinat list
- Section: **Riwayat** — list SpecimenCard kompak

### 7.9 TreeDetailScreen
- Hero: photo full-bleed, no rounded
- Pull-up content sheet di atas photo (radius lg top)
- Inside: full SpecimenCard layout (§5.5)
- Section: **Riwayat Perawatan** — timeline vertikal dengan rule line vertical + dot nodes
- Section: **Cerita** — body editorial dari catatan user, italic untuk quote
- Action bar bawah: ghost edit + ghost share + primary "Tambah catatan"

### 7.10 MapScreen
- Map full-screen, custom map style: muted bone tones, hijau untuk RTH
- Top floating panel `paper` dengan kicker `RUANG TERBUKA HIJAU TERDEKAT` + count
- Bottom sheet (peekable): list RTH dengan card style flat + jarak mono `1.2 KM`

### 7.11 CommunityFeedScreen
- Header: kicker `KOMUNITAS` + headline `Cerita lapangan.`
- Filter chip row: `Semua · Terbaru · Populer · Sekitar Anda`
- Feed item layout (editorial post card):
  - User row kompak (avatar 32pt + name + waktu mono)
  - Headline Fraunces title (jika post punya title)
  - Body Inter Tight 3-line clamp
  - Photo (jika ada) sm radius
  - Linked SpecimenCard reference (jika post tag pohon) — kecil, kompak
  - Action row: ghost-style icon buttons (like, comment, share) — count mono

### 7.12 LeaderboardScreen
- Tabs: `Global · Mingguan · Bulanan · Kota`
- Top 3 sebagai "podium editorial" — stack vertikal dengan number besar Fraunces (`01·02·03`), bukan podium klasik
- Rest: list-row dengan rank mono, avatar, nama, angka pohon mono — separated by rule lines

### 7.13 EcoWalletScreen
- Hero balance: `display-xl` poin angka, label `SALDO POIN`
- Section: **Riwayat** — list-row, +/− amount mono ochre/clay
- Section: **Tukar Hadiah** — grid 2-col card hadiah, photo top + nama serif + cost mono

### 7.14 CarbonCalculatorScreen
- Stepped form, kategori sebagai chip: `Transport · Listrik · Makanan · Sampah`
- Input dengan unit mono di kanan
- Result section: hero number CO₂ Fraunces + offset suggestion ("Tanam X pohon untuk menetralkan")
- CTA primary: "Tanam sekarang" → masuk Camera flow

### 7.15 LearnChallengeScreen
- List challenge dengan FeatureCard variant (full-bleed image top + body)
- Status badge (upcoming/active/ended), countdown mono
- Progress bar 2px untuk yang joined

### 7.16 NotificationsScreen
- List flat dengan rule lines
- Type ikon kiri (line, 1.5px), title body weight 600, time mono kanan
- Unread: dot indicator `clay` 6pt di kiri

### 7.17 Tab bar (global)
Spec di §5.8.

---

## 8. Iconography & Imagery

### Icon set
- **Source:** Phosphor Icons (Regular weight) + custom botanical SVG (daun, ranting, kontur)
- **Stroke:** unify ke 1.5px
- **Sizes:** 16 · 20 · 24 · 32
- **Color:** inherit currentColor, default `ink`, muted `ink-muted`
- **Tab icon set yang ada** (`HomeIcon`, `ScanIcon`, `ProfileIcon`, `NotificationIcon`, `ShopIcon`) di-redraw dengan style baru

### Tree category icons
Saat ini pakai emoji (🥭🌳🍎). **Diganti** dengan custom line illustration tiap kategori (1 daun simbolis per kategori) untuk konsistensi editorial. Emoji boleh tetap muncul di achievement (cultural feel) tapi tidak di kategori utama.

### Imagery treatment
- Foto pohon: tidak pernah cropped circle. Selalu rectangular dengan radius `sm` (polaroid feel).
- Tidak ada photo overlay gradient. Foto tampil as-is.
- Kalau perlu separator dengan teks di atas foto, pakai `paper` solid bar di bawah, bukan gradient.

### Decorative botanical SVG
Library kecil (~6 motif): daun mangga, ranting beringin, kontur topografi, garis ukur, kompas. Dipakai sebagai aksen halus di:
- Empty state center
- Hero section background (opacity 0.06, di balik teks)
- Section dividers besar (kontur topografi tipis)

---

## 9. Architectural Changes

### Dependency changes
**Add:**
- `@expo-google-fonts/fraunces`
- `@expo-google-fonts/inter-tight`
- `@expo-google-fonts/jetbrains-mono`
- `react-native-reanimated` (jika belum)
- `phosphor-react-native` (atau tetap pakai SVG manual jika ingin minimize deps)

**Remove:**
- `@expo-google-fonts/sora`
- `@expo-google-fonts/kulim-park`
- `expo-linear-gradient` jika tidak terpakai lagi (cek dulu — mungkin hanya di splash)

**Keep as-is:** zustand, async-storage, navigation, expo-camera/location/image-picker.

### File structure changes

```
src/
  theme/
    tokens.js              ← NEW: single source of truth (color/space/radius/elevation/type tokens)
    index.js               ← refactor: just re-export from tokens
  constants/
    colors.js              ← deprecated (keep stub re-exporting from theme/tokens for migration)
    typography.js          ← deprecated (same)
    spacing.js             ← deprecated (same)
  components/
    atoms/
      typography/          ← NEW: Display, Headline, Title, Body, Label, Mono, Latin, index.js
      Button.js            ← redesigned per §5.1
      Card.js              ← redesigned per §5.2
      Badge.js             ← redesigned per §5.4
      Chip.js              ← NEW
      Input.js             ← redesigned per §5.6
      RuleLine.js          ← NEW (1px horizontal divider)
      FolioNumber.js       ← NEW (mono "01 / 05" indicator)
      Icon.js              ← NEW: wrapper around phosphor / svg with stroke + size standard
    molecules/
      StatCard.js          ← redesigned per §5.3
      SpecimenCard.js      ← NEW per §5.5 (used in many screens)
      QuestRow.js          ← NEW
      ScreenHeader.js      ← NEW: kicker + folio + headline + rule
      EmptyState.js        ← NEW per §5.11
      BotanicalIllus.js    ← NEW: SVG botanical accent component
    buttons/               ← DEPRECATED: delete after migration
    common/                ← review: keep SvgIcon, retire BackgroundIllustration/ProductIcons (replaced)
    TabNavigation/         ← redesigned per §5.8
  navigation/
    AppNavigator.js        ← keep, sync with redesigned headers
    AppNavigator.minimal.js ← DELETE (legacy)
    AppNavigator.restored.js ← DELETE (legacy)
  screens/                 ← all screens rewritten per §7
  store/                   ← unchanged (still mock data — backend out of scope)
  utils/                   ← review: trim Image/ImageImporter/ImageExamples/SvgAssets to essentials
```

### Targeted refactors (limited scope)
Beberapa layar **sangat besar** (CameraScreen 36KB, HomeScreen 32KB, TreeDetail 35KB). Selama redesign:
- Pecah CameraScreen → `CameraScreen.js` + `components/camera/{TreeTypePicker, LocationField, NotesField, ImpactPreview, BottomActionBar}`
- Pecah HomeScreen → `HomeScreen.js` + `components/home/{Greeting, TodayProgress, TotalImpact, DailyQuests, FieldTip}`
- Pecah TreeDetailScreen → `TreeDetailScreen.js` + `components/treeDetail/{HeroPhoto, SpecimenSheet, CareTimeline, StorySection}`
- Konsolidasi duplikat: hapus `src/components/buttons/Button.js`, semua import diarahkan ke `atoms/Button`.
- Hapus file legacy navigator (`AppNavigator.minimal.js`, `AppNavigator.restored.js`).

**Out of scope refactor:** stores, utils image helpers (kecuali yang jelas tidak terpakai), navigation structure.

---

## 10. Migration Strategy

Direkomendasikan urutan implementasi (akan diperinci di plan dokumen berikutnya):

**Phase A — Foundation (no UI change yet)**
1. Install fonts baru, setup token file `theme/tokens.js`
2. Build atoms baru: typography components, Button, Card, Badge, Chip, Input, Icon, RuleLine, FolioNumber
3. Update theme exports + keep old constants as compat shim

**Phase B — Signature components**
4. Build SpecimenCard, StatCard, ScreenHeader, EmptyState, BotanicalIllus
5. Redesign TabBar

**Phase C — Screen-by-screen**
Order optimized for showcase impact:
6. HomeScreen (most important — sets the tone)
7. ProfileScreen + StatisticsScreen (showcase data treatment)
8. TreeDetailScreen (showcase SpecimenCard + editorial layout)
9. CameraScreen + PhotoPreviewScreen (core flow)
10. Auth screens (Login/Register/Onboarding/Landing/Forgot)
11. CommunityFeed + Leaderboard
12. EcoWallet + CarbonCalculator + LearnChallenge + Map + Notifications

**Phase D — Cleanup**
13. Delete deprecated `components/buttons/`, legacy navigators
14. Remove unused fonts/deps
15. Smoke test all flows

---

## 11. Acceptance Criteria

The redesign is "done" when:

- [ ] All 17 screens listed in §7 use new design system, no Sora/Kulim Park anywhere
- [ ] Zero hardcoded colors in screen files — all from `theme/tokens.js`
- [ ] Zero hardcoded `fontFamily` outside typography atoms
- [ ] No screen file > 400 lines (refactored into per-screen subcomponents)
- [ ] `components/buttons/` directory deleted, all imports updated
- [ ] Legacy navigator files deleted
- [ ] App boots and navigates through full happy path: Landing → Login → Home → Camera → PhotoPreview → save → back to Home
- [ ] Tab bar shows new editorial-active style (rule line indicator)
- [ ] At least 3 screens prominently feature `display-xl` Fraunces hero number (Home, Profile, Statistics)
- [ ] SpecimenCard appears in: TreeDetail, Profile, Camera form preview
- [ ] Folio numbers visible on all main screens

---

## 12. Open Questions / Risks

1. **Variable font support in React Native.** Fraunces is variable; RN doesn't support variable axes. Mitigation: bundle 3 weights (400, 400-italic, 500), accept loss of optical sizing. Acceptable trade-off.
2. **Tree photos.** Mock data may not include real tree photos at right aspect ratios. Mitigation: design SpecimenCard to gracefully handle no-image (show botanical SVG placeholder).
3. **Phosphor vs custom SVG.** Adding `phosphor-react-native` adds ~few hundred KB. Alternative: hand-pick only ~12 icons we need into `components/atoms/icons/`. **Decision deferred to plan phase.**
4. **Dark mode.** Token system designed to support dark mode later (`bone` becomes `ink` and vice versa essentially), but no dark variants defined now. Out of scope.
5. **Backend.** Still mock data. Redesign does not block or wait for backend. When backend lands later, only data layer changes — UI is independent.

---

*End of design spec.*
