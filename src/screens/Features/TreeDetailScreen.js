import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Animated,
  Share,
  FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { COLORS, SHADOWS, GRADIENT_COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';
import { useTreeStore, TREE_TYPES } from '../../store/treeStore';

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 350;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Animated Circle Component for Progress Ring
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TreeDetailScreen({ navigation, route }) {
  const { treeId } = route.params || {};
  const { getTreeById, waterTree } = useTreeStore();
  const scrollY = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Get tree from store or use mock data
  const storedTree = getTreeById(treeId);
  const treeType = storedTree ? TREE_TYPES.find(t => t.id === storedTree.type) : null;

  // Calculate age
  const calculateAge = (createdAt) => {
    if (!createdAt) return '0 hari';
    const created = new Date(createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    if (diffDays < 30) return `${diffDays} hari`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan`;
    return `${Math.floor(diffDays / 365)} tahun`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const treeData = storedTree ? {
    id: storedTree.id,
    type: storedTree.typeName || treeType?.name || 'Pohon',
    scientificName: treeType?.id || '',
    plantedDate: formatDate(storedTree.createdAt),
    planter: 'Anda',
    location: storedTree.location?.name || 'Lokasi tidak diketahui',
    coordinates: storedTree.location?.coordinates || { lat: -5.1477, lng: 119.4327 },
    images: storedTree.photos?.map(p => p.uri) || [],
    healthStatus: storedTree.status === 'healthy' ? 90 : storedTree.status === 'needs_care' ? 60 : 80,
    lastCareDate: formatDate(storedTree.lastWatered),
    watering: storedTree.lastWatered ? 'Terakhir disiram' : 'Belum disiram',
    condition: storedTree.status === 'healthy' ? 'Sehat' : storedTree.status === 'needs_care' ? 'Perlu Perhatian' : 'Tumbuh',
    height: '-',
    age: calculateAge(storedTree.createdAt),
    co2Absorbed: `${((treeType?.co2PerYear || 21.77) * 0.1).toFixed(1)} kg`,
    oxygenProduced: `${((treeType?.co2PerYear || 21.77) * 0.1 * 0.73).toFixed(1)} kg`,
    notes: storedTree.notes || ''
  } : {
    id: 1,
    type: 'Mahoni',
    scientificName: 'Swietenia mahagoni',
    plantedDate: '15 Agustus 2024',
    planter: 'Ahmad Wijaya',
    location: 'Taman Hasanuddin, Makassar',
    coordinates: { lat: -5.1477, lng: 119.4327 },
    images: [
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800',
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800',
    ],
    healthStatus: 85,
    lastCareDate: '20 Agustus 2024',
    watering: 'Rutin',
    condition: 'Sehat',
    height: '2.3 m',
    age: '3 bulan',
    co2Absorbed: '15 kg',
    oxygenProduced: '11 kg'
  };

  // Growth data for chart
  const growthData = [
    { month: 'Jan', height: 0.5 },
    { month: 'Feb', height: 0.8 },
    { month: 'Mar', height: 1.2 },
    { month: 'Apr', height: 1.5 },
    { month: 'Mei', height: 1.9 },
    { month: 'Jun', height: 2.3 },
  ];

  const careHistory = [
    {
      id: 1,
      date: '20 Agustus 2024',
      activity: 'Penyiraman',
      notes: 'Disiram dengan 5 liter air',
      user: 'Ahmad Wijaya',
      icon: '💧',
      color: COLORS.INFO,
    },
    {
      id: 2,
      date: '18 Agustus 2024',
      activity: 'Pemupukan',
      notes: 'Diberi pupuk organik kompos',
      user: 'Komunitas Hijau',
      icon: '🌱',
      color: COLORS.SUCCESS,
    },
    {
      id: 3,
      date: '15 Agustus 2024',
      activity: 'Penanaman',
      notes: 'Bibit ditanam di lokasi yang tepat',
      user: 'Ahmad Wijaya',
      icon: '🌳',
      color: COLORS.PRIMARY,
    }
  ];

  // Animate progress on mount
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: treeData.healthStatus,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [treeData.healthStatus]);

  // Animated values for header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.3, 1],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [HEADER_SCROLL_DISTANCE - 50, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const getHealthColor = (status) => {
    if (status >= 80) return COLORS.SUCCESS;
    if (status >= 50) return COLORS.WARNING;
    return COLORS.ERROR;
  };

  const getConditionBadge = (condition) => {
    const badges = {
      'Sehat': { color: COLORS.SUCCESS, bg: COLORS.SUCCESS_SOFT, icon: '✓' },
      'Tumbuh': { color: COLORS.INFO, bg: COLORS.INFO_SOFT, icon: '↑' },
      'Perlu Perhatian': { color: COLORS.WARNING, bg: COLORS.WARNING_SOFT, icon: '!' },
    };
    return badges[condition] || badges['Tumbuh'];
  };

  // Share functionality
  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌳 Pohon ${treeData.type} saya di Aksi Hijau!\n\n📍 Lokasi: ${treeData.location}\n📅 Ditanam: ${treeData.plantedDate}\n🌿 CO₂ Diserap: ${treeData.co2Absorbed}\n💨 O₂ Diproduksi: ${treeData.oxygenProduced}\n\nAyo ikut menanam pohon bersama! #AksiHijau #TanamPohon`,
        title: `Pohon ${treeData.type} - Aksi Hijau`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // Circular Progress Ring Component
  const CircularProgress = ({ percentage, size = 140, strokeWidth = 12 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const healthColor = getHealthColor(percentage);

    const strokeDashoffset = progressAnimation.interpolate({
      inputRange: [0, 100],
      outputRange: [circumference, 0],
    });

    return (
      <View style={styles.progressRingContainer}>
        <Svg width={size} height={size} style={styles.progressSvg}>
          <Defs>
            <SvgLinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={healthColor} />
              <Stop offset="100%" stopColor={healthColor + '80'} />
            </SvgLinearGradient>
          </Defs>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.GRAY_200}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          />
        </Svg>
        <View style={styles.progressTextContainer}>
          <Text style={[styles.progressPercentage, { color: healthColor }]}>
            {percentage}%
          </Text>
          <Text style={styles.progressLabel}>Kesehatan</Text>
        </View>
      </View>
    );
  };

  // Growth Chart Component
  const GrowthChart = () => {
    const maxHeight = Math.max(...growthData.map(d => d.height));
    const chartHeight = 120;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartBars}>
          {growthData.map((item, index) => {
            const barHeight = (item.height / maxHeight) * chartHeight;
            return (
              <View key={index} style={styles.chartBarWrapper}>
                <View style={styles.chartBarContainer}>
                  <LinearGradient
                    colors={GRADIENT_COLORS.PRIMARY}
                    style={[styles.chartBar, { height: barHeight }]}
                  />
                </View>
                <Text style={styles.chartLabel}>{item.month}</Text>
                <Text style={styles.chartValue}>{item.height}m</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // Mini Map Component
  const MiniMap = () => (
    <TouchableOpacity style={styles.miniMapContainer} activeOpacity={0.9}>
      <LinearGradient
        colors={[COLORS.PRIMARY_SOFT, COLORS.PRIMARY_LIGHT]}
        style={styles.miniMapGradient}
      >
        <View style={styles.miniMapContent}>
          <View style={styles.miniMapPin}>
            <Text style={styles.miniMapPinIcon}>📍</Text>
          </View>
          <View style={styles.miniMapInfo}>
            <Text style={styles.miniMapTitle}>Lihat di Peta</Text>
            <Text style={styles.miniMapCoords}>
              {treeData.coordinates.lat.toFixed(4)}, {treeData.coordinates.lng.toFixed(4)}
            </Text>
          </View>
          <View style={styles.miniMapArrow}>
            <Text style={styles.miniMapArrowIcon}>→</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Photo Gallery Component
  const PhotoGallery = () => {
    const images = treeData.images.length > 0 ? treeData.images : [null];

    return (
      <View style={styles.galleryContainer}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(index);
          }}
          renderItem={({ item, index }) => (
            <View style={styles.galleryImageContainer}>
              {item ? (
                <Image source={{ uri: item }} style={styles.galleryImage} />
              ) : (
                <LinearGradient colors={GRADIENT_COLORS.FOREST} style={styles.galleryImage}>
                  <Text style={styles.placeholderEmoji}>🌳</Text>
                </LinearGradient>
              )}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        {/* Pagination Dots */}
        {images.length > 1 && (
          <View style={styles.paginationContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeImageIndex === index && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderStatCard = (icon, value, label, gradientColors) => (
    <View style={styles.statCardWrapper}>
      <LinearGradient
        colors={gradientColors || [COLORS.GLASS_WHITE_ULTRA, COLORS.GLASS_WHITE]}
        style={styles.statCard}
      >
        <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>{icon}</Text>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </LinearGradient>
    </View>
  );

  const conditionBadge = getConditionBadge(treeData.condition);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Animated Header with Photo Gallery */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <Animated.View style={[styles.imageWrapper, { opacity: imageOpacity, transform: [{ scale: imageScale }] }]}>
          <PhotoGallery />
        </Animated.View>
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.7)']}
          locations={[0, 0.4, 1]}
          style={styles.heroGradient}
          pointerEvents="none"
        />

        {/* Header Navigation */}
        <View style={styles.headerNav}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.GLASS_WHITE, COLORS.GLASS_WHITE_LIGHT]}
              style={styles.navButtonGradient}
            >
              <Text style={styles.navIcon}>←</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Animated.Text style={[styles.headerTitle, { opacity: titleOpacity }]}>
            {treeData.type}
          </Animated.Text>

          <TouchableOpacity 
            style={styles.navButton} 
            activeOpacity={0.8}
            onPress={handleShare}
          >
            <LinearGradient
              colors={[COLORS.GLASS_WHITE, COLORS.GLASS_WHITE_LIGHT]}
              style={styles.navButtonGradient}
            >
              <Text style={styles.navIcon}>↗</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Floating Tree Info Card */}
        <View style={styles.floatingCardContainer}>
          <View style={styles.floatingCard}>
            <View style={styles.floatingCardContent}>
              <View style={styles.treeNameSection}>
                <Text style={styles.treeName}>{treeData.type}</Text>
                <Text style={styles.treeScientific}>{treeData.scientificName}</Text>
              </View>
              <View style={[styles.conditionBadge, { backgroundColor: conditionBadge.bg }]}>
                <Text style={[styles.conditionIcon, { color: conditionBadge.color }]}>
                  {conditionBadge.icon}
                </Text>
                <Text style={[styles.conditionText, { color: conditionBadge.color }]}>
                  {treeData.condition}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Info Cards Section */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Lokasi</Text>
                <Text style={styles.infoValue} numberOfLines={2}>{treeData.location}</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>📅</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Ditanam</Text>
                <Text style={styles.infoValue}>{treeData.plantedDate}</Text>
              </View>
            </View>
          </View>
          <View style={styles.infoCardFull}>
            <Text style={styles.infoIcon}>👤</Text>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Ditanam Oleh</Text>
              <Text style={styles.infoValue}>{treeData.planter}</Text>
            </View>
          </View>
        </View>

        {/* Mini Map */}
        <View style={styles.section}>
          <MiniMap />
        </View>

        {/* Health & Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Kesehatan</Text>
          
          <View style={styles.healthCard}>
            <LinearGradient
              colors={[COLORS.GLASS_WHITE_ULTRA, COLORS.GLASS_WHITE]}
              style={styles.healthCardGradient}
            >
              {/* Animated Circular Progress */}
              <View style={styles.healthVisual}>
                <CircularProgress percentage={treeData.healthStatus} />
              </View>

              {/* Health Details */}
              <View style={styles.healthDetails}>
                <View style={styles.healthDetailItem}>
                  <View style={[styles.healthDot, { backgroundColor: COLORS.SUCCESS }]} />
                  <Text style={styles.healthDetailLabel}>Perawatan Terakhir</Text>
                  <Text style={styles.healthDetailValue}>{treeData.lastCareDate}</Text>
                </View>
                <View style={styles.healthDetailItem}>
                  <View style={[styles.healthDot, { backgroundColor: COLORS.INFO }]} />
                  <Text style={styles.healthDetailLabel}>Penyiraman</Text>
                  <Text style={styles.healthDetailValue}>{treeData.watering}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Growth Chart Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Grafik Pertumbuhan</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>6 Bulan</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chartCard}>
            <GrowthChart />
          </View>
        </View>

        {/* Impact Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dampak Lingkungan</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('📏', treeData.height, 'Tinggi', [COLORS.GLASS_WHITE_ULTRA, COLORS.GLASS_WHITE])}
            {renderStatCard('⏱️', treeData.age, 'Umur', [COLORS.GLASS_WHITE_ULTRA, COLORS.GLASS_WHITE])}
            {renderStatCard('🌿', treeData.co2Absorbed, 'CO₂ Diserap', [COLORS.SUCCESS_SOFT, COLORS.SUCCESS_SOFT + '80'])}
            {renderStatCard('💨', treeData.oxygenProduced, 'O₂ Diproduksi', [COLORS.INFO_SOFT, COLORS.INFO_SOFT + '80'])}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
              <LinearGradient
                colors={GRADIENT_COLORS.PRIMARY}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>💧</Text>
                <Text style={styles.actionText}>Siram</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
              <LinearGradient
                colors={GRADIENT_COLORS.SUNRISE}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>📸</Text>
                <Text style={styles.actionText}>Foto</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
              <LinearGradient
                colors={GRADIENT_COLORS.SKY}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>📝</Text>
                <Text style={styles.actionText}>Catatan</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard} 
              activeOpacity={0.8}
              onPress={handleShare}
            >
              <LinearGradient
                colors={GRADIENT_COLORS.EARTH}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>↗️</Text>
                <Text style={styles.actionText}>Bagikan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Care History Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Riwayat Perawatan</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeline}>
            {careHistory.map((care, index) => (
              <View key={care.id} style={styles.timelineItem}>
                {/* Timeline Line */}
                {index < careHistory.length - 1 && (
                  <View style={styles.timelineLine} />
                )}
                
                {/* Timeline Dot */}
                <View style={[styles.timelineDot, { backgroundColor: care.color + '20' }]}>
                  <Text style={styles.timelineIcon}>{care.icon}</Text>
                </View>

                {/* Timeline Content */}
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineActivity}>{care.activity}</Text>
                    <Text style={styles.timelineDate}>{care.date}</Text>
                  </View>
                  <Text style={styles.timelineNotes}>{care.notes}</Text>
                  <View style={styles.timelineUserContainer}>
                    <View style={styles.timelineAvatar}>
                      <Text style={styles.timelineAvatarText}>
                        {care.user.charAt(0)}
                      </Text>
                    </View>
                    <Text style={styles.timelineUser}>{care.user}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Notes Section */}
        {treeData.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Catatan</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesIcon}>📋</Text>
              <Text style={styles.notesText}>{treeData.notes}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Header Styles
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  imageWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  // Gallery Styles
  galleryContainer: {
    flex: 1,
  },
  galleryImageContainer: {
    width: width,
    height: '100%',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.WHITE + '50',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.WHITE,
    width: 24,
  },

  // Navigation
  headerNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.PADDING.LG,
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
  },
  navButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.MEDIUM,
  },
  navButtonGradient: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  navIcon: {
    fontSize: 22,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Floating Card
  floatingCardContainer: {
    position: 'absolute',
    bottom: -30,
    left: SPACING.PADDING.LG,
    right: SPACING.PADDING.LG,
  },
  floatingCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    ...SHADOWS.LARGE,
  },
  floatingCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  treeNameSection: {
    flex: 1,
  },
  treeName: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 2,
  },
  treeScientific: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    fontStyle: 'italic',
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  conditionIcon: {
    fontSize: 12,
    marginRight: 4,
    fontWeight: 'bold',
  },
  conditionText: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: HEADER_MAX_HEIGHT + 20,
  },

  // Section Styles
  section: {
    paddingHorizontal: SPACING.PADDING.LG,
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
    marginBottom: SPACING.MARGIN.MD,
  },
  seeAllText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Info Cards
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.MD,
    ...SHADOWS.SMALL,
  },
  infoCardFull: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.MD,
    ...SHADOWS.SMALL,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Mini Map
  miniMapContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.MEDIUM,
  },
  miniMapGradient: {
    padding: SPACING.PADDING.LG,
  },
  miniMapContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniMapPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  miniMapPinIcon: {
    fontSize: 24,
  },
  miniMapInfo: {
    flex: 1,
  },
  miniMapTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 2,
  },
  miniMapCoords: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  miniMapArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniMapArrowIcon: {
    fontSize: 18,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },

  // Health Card
  healthCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.MEDIUM,
  },
  healthCardGradient: {
    padding: SPACING.PADDING.XL,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
  },
  healthVisual: {
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.LG,
  },

  // Progress Ring
  progressRingContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSvg: {
    position: 'absolute',
  },
  progressTextContainer: {
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: FONT_SIZES.H2,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  progressLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },

  healthDetails: {
    gap: 12,
  },
  healthDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.PADDING.MD,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  healthDetailLabel: {
    flex: 1,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  healthDetailValue: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Chart
  chartCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    ...SHADOWS.SMALL,
  },
  chartContainer: {
    paddingTop: 8,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  chartBarWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarContainer: {
    height: 120,
    width: 24,
    backgroundColor: COLORS.GRAY_100,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: 12,
  },
  chartLabel: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 8,
  },
  chartValue: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginTop: 2,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statCardWrapper: {
    width: '50%',
    padding: 6,
  },
  statCard: {
    borderRadius: 20,
    padding: SPACING.PADDING.LG,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
    ...SHADOWS.SMALL,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...SHADOWS.SMALL,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.MEDIUM,
  },
  actionGradient: {
    paddingVertical: SPACING.PADDING.LG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  actionText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Timeline
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.MARGIN.LG,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 20,
    top: 48,
    bottom: -SPACING.MARGIN.LG,
    width: 2,
    backgroundColor: COLORS.BORDER,
  },
  timelineDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MARGIN.MD,
  },
  timelineIcon: {
    fontSize: 20,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.MD,
    ...SHADOWS.SMALL,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineActivity: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  timelineDate: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  timelineNotes: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 8,
    lineHeight: 20,
  },
  timelineUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY_SOFT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  timelineAvatarText: {
    fontSize: 12,
    color: COLORS.PRIMARY_DARK,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  timelineUser: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },

  // Notes
  notesCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.PADDING.LG,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
    ...SHADOWS.SMALL,
  },
  notesIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  notesText: {
    flex: 1,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    lineHeight: 22,
  },

  bottomSpacing: {
    height: 40,
  },
});
