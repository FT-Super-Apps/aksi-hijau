import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';

const { width, height } = Dimensions.get('window');

export default function MapScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: '🌳 Pohon', active: true },
    { id: 'rth', label: '🏞️ RTH', active: false },
    { id: 'filter', label: '📊 Filter', active: false },
  ];

  const treeLocations = [
    {
      id: 1,
      type: 'Mahoni',
      location: 'Taman Hasanuddin',
      planter: 'Ahmad Wijaya',
      date: '15 Agustus 2024',
      status: 'healthy',
      coordinates: { lat: -5.147665, lng: 119.432732 }
    },
    {
      id: 2,
      type: 'Mangga',
      location: 'Jl. Perintis Kemerdekaan',
      planter: 'Sari Indah',
      date: '20 Agustus 2024',
      status: 'healthy',
      coordinates: { lat: -5.135399, lng: 119.423790 }
    },
    {
      id: 3,
      type: 'Ketapang',
      location: 'Pantai Losari',
      planter: 'Budi Santoso',
      date: '25 Agustus 2024',
      status: 'growing',
      coordinates: { lat: -5.135717, lng: 119.403831 }
    }
  ];

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

          <Text style={styles.headerTitle}>Peta RTH Makassar</Text>

          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Cari lokasi RTH..."
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <View style={styles.fullMapView}>
          <Text style={styles.mapTitle}>🗺️ FULL MAP VIEW</Text>

          {/* Map Pins Simulation */}
          <View style={styles.mapPinsContainer}>
            <Text style={[styles.mapPin, { top: '20%', left: '15%' }]}>📍🌳</Text>
            <Text style={[styles.mapPin, { top: '30%', right: '20%' }]}>📍🌳</Text>
            <Text style={[styles.mapPin, { top: '45%', left: '30%' }]}>📍🌳</Text>
            <Text style={[styles.mapPin, { top: '60%', right: '15%' }]}>📍🌳</Text>
            <Text style={[styles.mapPin, { bottom: '25%', left: '20%' }]}>📍🌳</Text>
            <Text style={[styles.mapPin, { bottom: '20%', right: '30%' }]}>📍🌳</Text>

            {/* Building representation */}
            <View style={[styles.building, { top: '40%', left: '45%' }]}>
              <Text style={styles.buildingIcon}>🏢</Text>
            </View>
          </View>

          {/* Location Info Popup */}
          <View style={styles.locationPopup}>
            <Text style={styles.popupTitle}>Taman Hasanuddin</Text>
            <Text style={styles.popupInfo}>3 pohon ditanam • Mahoni, Ketapang</Text>
          </View>
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.filterTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tree List */}
      <ScrollView style={styles.treeList} showsVerticalScrollIndicator={false}>
        <Text style={styles.listTitle}>Pohon Terdekat</Text>

        {treeLocations.map((tree) => (
          <TouchableOpacity key={tree.id} style={styles.treeCard}>
            <View style={styles.treeInfo}>
              <View style={[
                styles.statusDot,
                { backgroundColor: tree.status === 'healthy' ? '#4CAF50' : '#FF9800' }
              ]} />

              <View style={styles.treeDetails}>
                <Text style={styles.treeType}>{tree.type}</Text>
                <Text style={styles.treeLocation}>{tree.location}</Text>
                <Text style={styles.treePlanter}>Ditanam oleh {tree.planter}</Text>
                <Text style={styles.treeDate}>{tree.date}</Text>
              </View>

              <TouchableOpacity style={styles.navigateButton}>
                <Text style={styles.navigateIcon}>🧭</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
  },

  // Search Styles
  searchContainer: {
    backgroundColor: COLORS.WHITE + '20',
    borderRadius: 12,
    paddingHorizontal: SPACING.PADDING.MD,
  },
  searchInput: {
    height: 48,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },

  // Map Styles
  mapContainer: {
    flex: 1,
    margin: SPACING.MARGIN.LG,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  fullMapView: {
    flex: 1,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: SPACING.MARGIN.LG,
  },
  mapPinsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  mapPin: {
    position: 'absolute',
    fontSize: 24,
  },
  building: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buildingIcon: {
    fontSize: 32,
  },
  locationPopup: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: COLORS.WHITE,
    padding: SPACING.PADDING.MD,
    borderRadius: 12,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popupTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 4,
  },
  popupInfo: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },

  // Filter Styles
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.PADDING.XL,
    paddingVertical: SPACING.PADDING.MD,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  filterText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  filterTextActive: {
    color: COLORS.WHITE,
  },

  // Tree List Styles
  treeList: {
    maxHeight: 200,
    backgroundColor: COLORS.WHITE,
  },
  listTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingVertical: SPACING.PADDING.MD,
  },
  treeCard: {
    marginHorizontal: SPACING.MARGIN.LG,
    marginBottom: SPACING.MARGIN.MD,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: SPACING.PADDING.MD,
  },
  treeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.MARGIN.MD,
  },
  treeDetails: {
    flex: 1,
  },
  treeType: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 2,
  },
  treeLocation: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 2,
  },
  treePlanter: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 2,
  },
  treeDate: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_DISABLED,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  navigateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigateIcon: {
    fontSize: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
