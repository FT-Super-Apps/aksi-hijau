import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  TextInput,
  ScrollView,
  FlatList,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../../constants/colors';
import { FONT_FAMILIES } from '../../constants/typography';
import { TREE_TYPES, TREE_CATEGORIES, getTreesByCategory, searchTreeTypes } from '../../store/treeStore';

const { width, height } = Dimensions.get('window');

// Soft pastel colors for sections
const SECTION_COLORS = {
  tree: '#E8F5E9',      // Soft mint green
  location: '#E3F2FD',  // Soft sky blue
  notes: '#FFF8E1',     // Soft cream yellow
  impact: '#F3E5F5',    // Soft lavender
};

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [showTreePicker, setShowTreePicker] = useState(false);
  const [facing, setFacing] = useState('back');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const cameraRef = useRef(null);

  const [formData, setFormData] = useState({
    treeType: null,
    location: 'Mengambil lokasi...',
    coordinates: null,
    notes: '',
    quantity: 1,
  });

  const getFilteredTrees = () => {
    let trees = getTreesByCategory(selectedCategory);
    if (searchQuery) {
      trees = searchTreeTypes(searchQuery);
      if (selectedCategory !== 'all') {
        trees = trees.filter(t => t.category === selectedCategory);
      }
    }
    return trees;
  };

  useEffect(() => {
    getCameraPermissions();
    getCurrentLocation();

    const unsubscribe = navigation.addListener('focus', () => {
      setIsNavigating(false);
    });

    return unsubscribe;
  }, [navigation]);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setFormData(prev => ({
          ...prev,
          location: 'Izin lokasi tidak diberikan'
        }));
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        const fullAddress = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim();

        setCurrentLocation(location);
        setFormData(prev => ({
          ...prev,
          location: fullAddress || `Lat: ${location.coords.latitude.toFixed(6)}, Lng: ${location.coords.longitude.toFixed(6)}`,
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        }));
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setFormData(prev => ({
        ...prev,
        location: 'Gagal mengambil lokasi'
      }));
    } finally {
      setLocationLoading(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && !capturing && !isNavigating) {
      try {
        setCapturing(true);

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.6,
          base64: false,
          exif: true,
          skipProcessing: true,
        });

        const photoWithLocation = {
          ...photo,
          location: formData.coordinates,
          timestamp: new Date().toISOString(),
          address: formData.location
        };

        setIsNavigating(true);
        navigation.navigate('PhotoPreview', {
          photoData: photoWithLocation,
          formData: {
            ...formData,
            treeType: formData.treeType?.id,
            typeName: formData.treeType?.name,
          }
        });

        getCurrentLocation().catch(console.error);

      } catch (error) {
        Alert.alert('Error', 'Gagal mengambil foto');
        setIsNavigating(false);
      } finally {
        setCapturing(false);
        setTimeout(() => setIsNavigating(false), 2000);
      }
    }
  };

  const selectTreeType = (tree) => {
    setFormData(prev => ({ ...prev, treeType: tree }));
    setShowTreePicker(false);
    setSearchQuery('');
  };

  // Tree Type Picker Modal
  const TreePickerModal = () => (
    <Modal
      visible={showTreePicker}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowTreePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          onPress={() => setShowTreePicker(false)}
          activeOpacity={1}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle}>
            <View style={styles.handleBar} />
          </View>

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Pilih Jenis Pohon</Text>
              <Text style={styles.sheetSubtitle}>{getFilteredTrees().length} jenis tersedia</Text>
            </View>
            <TouchableOpacity 
              style={styles.sheetCloseBtn}
              onPress={() => setShowTreePicker(false)}
            >
              <Text style={styles.sheetCloseIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari pohon..."
                placeholderTextColor={COLORS.GRAY_400}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {TREE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryPill,
                  selectedCategory === category.id && styles.categoryPillActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryPillIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryPillText,
                  selectedCategory === category.id && styles.categoryPillTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={getFilteredTrees()}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.treeGrid}
            columnWrapperStyle={styles.treeGridRow}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🌱</Text>
                <Text style={styles.emptyTitle}>Tidak Ditemukan</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.treeCard,
                  formData.treeType?.id === item.id && styles.treeCardActive
                ]}
                onPress={() => selectTreeType(item)}
                activeOpacity={0.7}
              >
                {formData.treeType?.id === item.id && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkIcon}>✓</Text>
                  </View>
                )}
                <View style={[
                  styles.treeIconCircle,
                  formData.treeType?.id === item.id && styles.treeIconCircleActive
                ]}>
                  <Text style={styles.treeEmoji}>{item.icon}</Text>
                </View>
                <Text style={styles.treeName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.treeScientific} numberOfLines={1}>{item.scientificName}</Text>
                <View style={styles.co2Badge}>
                  <Text style={styles.co2Text}>{item.co2PerYear} kg/th</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderForm = () => (
    <View style={styles.formContainer}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Pohon</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      {/* Form Content - Full Width Sections */}
      <KeyboardAvoidingView 
        style={styles.formWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}
        >
          {/* Section 1: Tree Selection - Full Width */}
          <View style={[styles.section, { backgroundColor: SECTION_COLORS.tree }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrapper}>
                <Text style={styles.sectionIcon}>🌳</Text>
              </View>
              <Text style={styles.sectionTitle}>Jenis Pohon</Text>
            </View>
            
            <TouchableOpacity
              style={styles.treeSelector}
              onPress={() => setShowTreePicker(true)}
              activeOpacity={0.8}
            >
              {formData.treeType ? (
                <View style={styles.selectedTreeRow}>
                  <Text style={styles.selectedTreeEmoji}>{formData.treeType.icon}</Text>
                  <View style={styles.selectedTreeInfo}>
                    <Text style={styles.selectedTreeName}>{formData.treeType.name}</Text>
                    <Text style={styles.selectedTreeCO2}>{formData.treeType.co2PerYear} kg CO₂/tahun</Text>
                  </View>
                  <View style={styles.changeBtn}>
                    <Text style={styles.changeBtnText}>Ubah</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.treePlaceholder}>
                  <Text style={styles.placeholderText}>Ketuk untuk memilih pohon</Text>
                  <Text style={styles.placeholderArrow}>→</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Quick Select */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.quickSelect}
            >
              {TREE_TYPES.slice(0, 5).map((tree) => (
                <TouchableOpacity
                  key={tree.id}
                  style={[
                    styles.quickChip,
                    formData.treeType?.id === tree.id && styles.quickChipActive
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, treeType: tree }))}
                >
                  <Text style={styles.quickChipEmoji}>{tree.icon}</Text>
                  <Text style={[
                    styles.quickChipText,
                    formData.treeType?.id === tree.id && styles.quickChipTextActive
                  ]}>
                    {tree.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Section 2: Location - Full Width */}
          <View style={[styles.section, { backgroundColor: SECTION_COLORS.location }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrapper, { backgroundColor: '#BBDEFB' }]}>
                <Text style={styles.sectionIcon}>📍</Text>
              </View>
              <Text style={styles.sectionTitle}>Lokasi</Text>
              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={getCurrentLocation}
                disabled={locationLoading}
              >
                <Text style={styles.refreshBtnText}>{locationLoading ? '...' : '↻'}</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.locationText} numberOfLines={2}>{formData.location}</Text>
            
            {formData.coordinates && (
              <View style={styles.coordsRow}>
                <View style={styles.coordBadge}>
                  <Text style={styles.coordText}>
                    {formData.coordinates.latitude.toFixed(5)}, {formData.coordinates.longitude.toFixed(5)}
                  </Text>
                </View>
                <View style={styles.gpsStatus}>
                  <View style={styles.gpsDot} />
                  <Text style={styles.gpsText}>GPS Aktif</Text>
                </View>
              </View>
            )}
          </View>

          {/* Section 3: Notes - Full Width */}
          <View style={[styles.section, { backgroundColor: SECTION_COLORS.notes }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrapper, { backgroundColor: '#FFE082' }]}>
                <Text style={styles.sectionIcon}>📝</Text>
              </View>
              <Text style={styles.sectionTitle}>Catatan</Text>
              <Text style={styles.optionalBadge}>Opsional</Text>
            </View>
            
            <TextInput
              style={styles.notesInput}
              placeholder="Tambahkan catatan tentang penanaman..."
              placeholderTextColor={COLORS.GRAY_400}
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Section 4: Impact Preview - Full Width */}
          {formData.treeType && (
            <View style={[styles.section, { backgroundColor: SECTION_COLORS.impact }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconWrapper, { backgroundColor: '#E1BEE7' }]}>
                  <Text style={styles.sectionIcon}>🌍</Text>
                </View>
                <Text style={styles.sectionTitle}>Estimasi Dampak</Text>
              </View>
              
              <View style={styles.impactGrid}>
                <View style={styles.impactBox}>
                  <Text style={styles.impactValue}>{formData.treeType.co2PerYear}</Text>
                  <Text style={styles.impactLabel}>kg CO₂/tahun</Text>
                </View>
                <View style={styles.impactBox}>
                  <Text style={styles.impactValue}>{(formData.treeType.co2PerYear * 0.73).toFixed(1)}</Text>
                  <Text style={styles.impactLabel}>kg O₂/tahun</Text>
                </View>
              </View>
            </View>
          )}

          {/* Section 5: CTA Button - Full Width */}
          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={[
                styles.ctaButton,
                !formData.treeType && styles.ctaButtonDisabled
              ]}
              onPress={() => setShowForm(false)}
              disabled={!formData.treeType}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={formData.treeType ? [COLORS.PRIMARY, COLORS.PRIMARY_DARK] : [COLORS.GRAY_300, COLORS.GRAY_400]}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaIcon}>📷</Text>
                <Text style={styles.ctaText}>
                  {formData.treeType ? `Foto ${formData.treeType.name}` : 'Pilih pohon dulu'}
                </Text>
                <Text style={styles.ctaArrow}>→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TreePickerModal />
    </View>
  );

  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.cameraHeader}>
          <TouchableOpacity
            style={styles.camBackBtn}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.camBackIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.camInfoPill}>
            <Text style={styles.camInfoEmoji}>{formData.treeType?.icon}</Text>
            <Text style={styles.camInfoText}>{formData.treeType?.name}</Text>
          </View>

          <TouchableOpacity
            style={styles.camFlipBtn}
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          >
            <Text style={styles.camFlipIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.camOverlay}>
          <View style={styles.camOverlayRow}>
            <Text style={styles.camOverlayIcon}>📍</Text>
            <Text style={styles.camOverlayText} numberOfLines={1}>{formData.location}</Text>
          </View>
        </View>

        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        <View style={styles.camTip}>
          <Text style={styles.camTipText}>Arahkan kamera ke pohon</Text>
        </View>

        <View style={styles.camControls}>
          <TouchableOpacity style={styles.camSideBtn}>
            <Text style={styles.camSideIcon}>⚡</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureBtn, (capturing || isNavigating) && styles.captureBtnDisabled]}
            onPress={takePicture}
            disabled={capturing || isNavigating}
          >
            <View style={styles.captureBtnRing}>
              <View style={styles.captureBtnInner} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.camSideBtn}>
            <Text style={styles.camSideIcon}>🖼️</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );

  if (hasPermission === null) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.loadingEmoji}>📷</Text>
        <Text style={styles.loadingText}>Meminta izin kamera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionScreen}>
        <Text style={styles.permissionEmoji}>📵</Text>
        <Text style={styles.permissionTitle}>Izin Kamera Diperlukan</Text>
        <Text style={styles.permissionText}>
          Aplikasi memerlukan akses kamera untuk dokumentasi.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={getCameraPermissions}>
          <Text style={styles.permissionBtnText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.PRIMARY} />
      {showForm ? renderForm() : renderCameraView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // Loading & Permission
  loadingScreen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  permissionScreen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 20,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionBtn: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: COLORS.WHITE,
    fontSize: 15,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Form
  formContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.WHITE,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 42,
  },

  formWrapper: {
    flex: 1,
  },
  formContent: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },

  // Sections - Full Width
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Tree Selection
  treeSelector: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY + '30',
    overflow: 'hidden',
  },
  treePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  placeholderText: {
    fontSize: 15,
    color: COLORS.GRAY_400,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  placeholderArrow: {
    fontSize: 20,
    color: COLORS.PRIMARY,
  },
  selectedTreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  selectedTreeEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  selectedTreeInfo: {
    flex: 1,
  },
  selectedTreeName: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  selectedTreeCO2: {
    fontSize: 13,
    color: COLORS.SUCCESS,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    marginTop: 2,
  },
  changeBtn: {
    backgroundColor: COLORS.PRIMARY + '15',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  changeBtnText: {
    fontSize: 13,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Quick Select
  quickSelect: {
    marginTop: 14,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '25',
  },
  quickChipActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  quickChipEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  quickChipText: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  quickChipTextActive: {
    color: COLORS.WHITE,
  },

  // Location
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshBtnText: {
    fontSize: 18,
    color: COLORS.PRIMARY,
  },
  locationText: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    lineHeight: 22,
    marginBottom: 12,
  },
  coordsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coordBadge: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  coordText: {
    fontSize: 12,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  gpsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.SUCCESS,
    marginRight: 6,
  },
  gpsText: {
    fontSize: 12,
    color: COLORS.SUCCESS,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Notes
  optionalBadge: {
    fontSize: 11,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  notesInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    minHeight: 70,
    lineHeight: 20,
  },

  // Impact
  impactGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  impactBox: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 24,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  impactLabel: {
    fontSize: 11,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 4,
  },

  // Bottom Spacer
  bottomSpacer: {
    height: 40,
  },

  // CTA Section - Inline with form
  ctaSection: {
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.GLOW_PRIMARY,
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  ctaIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  ctaText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  ctaArrow: {
    fontSize: 22,
    color: COLORS.WHITE,
    opacity: 0.8,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.85,
  },
  sheetHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.GRAY_300,
    borderRadius: 2,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginTop: 2,
  },
  sheetCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetCloseIcon: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },

  // Search
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_100,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    color: COLORS.TEXT_PRIMARY,
  },
  clearIcon: {
    fontSize: 14,
    color: COLORS.GRAY_400,
  },

  // Category Pills
  categoryScroll: {
    marginBottom: 14,
  },
  categoryScrollContent: {
    paddingHorizontal: 24,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_100,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  categoryPillIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryPillText: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  categoryPillTextActive: {
    color: COLORS.WHITE,
  },

  // Tree Grid
  treeGrid: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  treeGridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  treeCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.GRAY_50,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  treeCardActive: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: SECTION_COLORS.tree,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  treeIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  treeIconCircleActive: {
    backgroundColor: COLORS.PRIMARY + '20',
  },
  treeEmoji: {
    fontSize: 26,
  },
  treeName: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textAlign: 'center',
    marginBottom: 2,
  },
  treeScientific: {
    fontSize: 10,
    color: COLORS.TEXT_TERTIARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  co2Badge: {
    backgroundColor: COLORS.SUCCESS + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  co2Text: {
    fontSize: 11,
    color: COLORS.SUCCESS,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },

  // Camera View
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  camBackBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camBackIcon: {
    fontSize: 24,
    color: COLORS.WHITE,
  },
  camInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  camInfoEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  camInfoText: {
    fontSize: 15,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  camFlipBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camFlipIcon: {
    fontSize: 20,
  },
  camOverlay: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
  },
  camOverlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  camOverlayIcon: {
    fontSize: 14,
    marginRight: 10,
  },
  camOverlayText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  viewfinder: {
    position: 'absolute',
    top: '28%',
    left: '10%',
    right: '10%',
    bottom: '30%',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: COLORS.WHITE,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  camTip: {
    position: 'absolute',
    bottom: 160,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  camTipText: {
    fontSize: 13,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  camControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  camSideBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camSideIcon: {
    fontSize: 22,
  },
  captureBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  captureBtnDisabled: {
    opacity: 0.6,
  },
  captureBtnRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    borderColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.PRIMARY,
  },
});
