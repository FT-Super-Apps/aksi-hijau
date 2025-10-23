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
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_FAMILIES, FONT_SIZES } from '../../constants/typography';

const { width, height } = Dimensions.get('window');

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [facing, setFacing] = useState('back');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const cameraRef = useRef(null);

  // Form data
  const [formData, setFormData] = useState({
    treeType: '',
    location: 'Mengambil lokasi...',
    coordinates: null,
    notes: ''
  });

  const treeTypes = [
    'Mahoni',
    'Mangga',
    'Ketapang',
    'Tabebuya',
    'Flamboyan',
    'Angsana',
    'Lainnya...'
  ];

  useEffect(() => {
    getCameraPermissions();
    getCurrentLocation();

    // Reset navigation state ketika screen mendapat focus
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

      // Check if location permission is granted
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setFormData(prev => ({
          ...prev,
          location: 'Izin lokasi tidak diberikan'
        }));
        setLocationLoading(false);
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocoding to get address
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

        // Ambil foto dengan quality yang lebih rendah untuk kecepatan
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.6, // Turunkan dari 0.8 ke 0.6 untuk lebih cepat
          base64: false,
          exif: true, // Include EXIF data with location if available
          skipProcessing: true, // Skip post-processing untuk kecepatan
        });

        // Gunakan lokasi yang sudah ada atau yang sedang loading
        const photoWithLocation = {
          ...photo,
          location: formData.coordinates,
          timestamp: new Date().toISOString(),
          address: formData.location
        };

        // Set navigating state dan navigasi langsung ke preview (cepat)
        setIsNavigating(true);
        navigation.navigate('PhotoPreview', {
          photoData: photoWithLocation,
          formData: formData
        });

        // Update lokasi di background (untuk foto berikutnya)
        getCurrentLocation().catch(console.error);

      } catch (error) {
        Alert.alert('Error', 'Gagal mengambil foto');
        setIsNavigating(false);
      } finally {
        setCapturing(false);
        // Reset navigating state setelah 2 detik
        setTimeout(() => setIsNavigating(false), 2000);
      }
    }
  };

  const renderForm = () => (
    <View style={styles.formContainer}>
      {/* Header dengan tombol kembali */}
      <View style={styles.formHeader}>
        <TouchableOpacity
          style={styles.backButtonForm}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIconForm}>←</Text>
        </TouchableOpacity>
        <Text style={styles.formTitle}>Informasi Penanaman</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Jenis Pohon:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.treeTypeScroll}
        >
          {treeTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.treeTypeButton,
                formData.treeType === type && styles.treeTypeButtonActive
              ]}
              onPress={() => setFormData({ ...formData, treeType: type })}
            >
              <Text style={[
                styles.treeTypeText,
                formData.treeType === type && styles.treeTypeTextActive
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.formField}>
        <View style={styles.locationHeader}>
          <Text style={styles.fieldLabel}>Lokasi: 📍</Text>
          <TouchableOpacity
            style={styles.refreshLocationButton}
            onPress={getCurrentLocation}
            disabled={locationLoading}
          >
            <Text style={styles.refreshLocationText}>
              {locationLoading ? '🔄' : '📍 Refresh'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.locationText}>{formData.location}</Text>
        <Text style={[styles.gpsStatus, { color: formData.coordinates ? COLORS.SUCCESS : COLORS.WARNING }]}>
          {formData.coordinates ? '✓ GPS Terverifikasi' : locationLoading ? '⏳ Mengambil lokasi...' : '⚠️ Lokasi tidak tersedia'}
        </Text>
        {formData.coordinates && (
          <Text style={styles.coordinatesText}>
            Lat: {formData.coordinates.latitude.toFixed(6)}, Lng: {formData.coordinates.longitude.toFixed(6)}
          </Text>
        )}
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Catatan:</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Ditanam bersama komunitas..."
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => setShowForm(false)}
        disabled={!formData.treeType}
      >
        <LinearGradient
          colors={formData.treeType ? [COLORS.PRIMARY, COLORS.PRIMARY_DARK] : [COLORS.GRAY_200, COLORS.GRAY_300]}
          style={styles.cameraButtonGradient}
        >
          <Text style={styles.cameraButtonIcon}>📷</Text>
          <Text style={styles.cameraButtonText}>Ambil Foto</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        {/* Header Controls */}
        <View style={styles.cameraHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.cameraTitle}>Dokumentasi Pohon</Text>

          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
          >
            <Text style={styles.flipIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Location Info Overlay */}
        <View style={styles.locationOverlay}>
          <Text style={styles.overlayText}>📍 {formData.location}</Text>
          {formData.coordinates && (
            <Text style={styles.overlayText}>
              🧭 Lat: {formData.coordinates.latitude.toFixed(4)}, Lng: {formData.coordinates.longitude.toFixed(4)}
            </Text>
          )}
          <Text style={styles.overlayText}>🕐 {new Date().toLocaleTimeString('id-ID')}</Text>
        </View>

        {/* Grid Lines */}
        <View style={styles.gridLines}>
          <View style={styles.gridLine} />
          <View style={[styles.gridLine, styles.gridLineVertical]} />
          <View style={[styles.gridLine, styles.gridLineHorizontal1]} />
          <View style={[styles.gridLine, styles.gridLineHorizontal2]} />
        </View>

        {/* Camera Controls */}
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.flashButton}>
            <Text style={styles.controlText}>⚡ Flash</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureButton, (capturing || isNavigating) && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={capturing || isNavigating}
          >
            <View style={styles.captureButtonInner}>
              <Text style={styles.captureIcon}>
                {capturing ? '📸' : isNavigating ? '➡️' : '📷'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton}>
            <Text style={styles.controlText}>🖼️ Gallery</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Meminta izin kamera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.noPermissionContainer}>
        <Text style={styles.noPermissionText}>
          Akses kamera tidak diberikan
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={getCameraPermissions}
        >
          <Text style={styles.permissionButtonText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />

      {showForm ? renderForm() : renderCameraView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
  },

  // Loading & Permission Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.PADDING.XL,
  },
  noPermissionText: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    textAlign: 'center',
    marginBottom: SPACING.MARGIN.XL,
  },
  permissionButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingVertical: SPACING.PADDING.MD,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Form Styles
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.PADDING.XL,
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
  },
  formTitle: {
    fontSize: FONT_SIZES.H4,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textAlign: 'center',
    flex: 1,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.MARGIN.XL,
  },
  backButtonForm: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backIconForm: {
    fontSize: 24,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  headerSpacer: {
    width: 40,
  },
  formField: {
    marginBottom: SPACING.MARGIN.XL,
  },
  fieldLabel: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    marginBottom: SPACING.MARGIN.SM,
  },
  treeTypeScroll: {
    flexGrow: 0,
  },
  treeTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    marginRight: SPACING.MARGIN.SM,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  treeTypeButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  treeTypeText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  treeTypeTextActive: {
    color: COLORS.WHITE,
  },
  locationText: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    backgroundColor: COLORS.WHITE,
    padding: SPACING.PADDING.MD,
    borderRadius: 12,
    marginBottom: SPACING.MARGIN.SM,
  },
  gpsStatus: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.SUCCESS,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.SM,
  },
  refreshLocationButton: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  refreshLocationText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  coordinatesText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    fontStyle: 'italic',
    marginTop: SPACING.MARGIN.XS,
  },
  notesInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.PADDING.MD,
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  cameraButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: SPACING.MARGIN.XL,
  },
  cameraButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.PADDING.LG,
  },
  cameraButtonIcon: {
    fontSize: 24,
    marginRight: SPACING.MARGIN.SM,
  },
  cameraButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },

  // Camera Styles
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
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: SPACING.PADDING.MD,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  cameraTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    textAlign: 'center',
    flex: 1,
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipIcon: {
    fontSize: 20,
  },
  locationOverlay: {
    position: 'absolute',
    top: 150,
    left: SPACING.PADDING.XL,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: SPACING.PADDING.SM,
    borderRadius: 8,
  },
  overlayText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
    marginBottom: 2,
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  gridLineVertical: {
    width: 1,
    height: '100%',
    left: '50%',
  },
  gridLineHorizontal1: {
    height: 1,
    width: '100%',
    top: '33%',
  },
  gridLineHorizontal2: {
    height: 1,
    width: '100%',
    top: '66%',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.PADDING.XL,
  },
  flashButton: {
    flex: 1,
    alignItems: 'center',
  },
  controlText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.MARGIN.XL,
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureIcon: {
    fontSize: 32,
  },
  galleryButton: {
    flex: 1,
    alignItems: 'center',
  },

  // Preview Styles
  previewContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingHorizontal: SPACING.PADDING.XL,
    paddingBottom: SPACING.PADDING.MD,
    backgroundColor: COLORS.WHITE,
  },
  previewTitle: {
    fontSize: FONT_SIZES.H5,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
    flex: 1,
    textAlign: 'center',
  },
  retakeButton: {
    padding: SPACING.PADDING.SM,
  },
  retakeText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  verificationInfo: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.PADDING.LG,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.SM,
  },
  checkIcon: {
    fontSize: 20,
    color: COLORS.SUCCESS,
    marginRight: SPACING.MARGIN.SM,
  },
  verificationText: {
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.REGULAR,
  },
  previewActions: {
    padding: SPACING.PADDING.XL,
    backgroundColor: COLORS.WHITE,
  },
  uploadButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: SPACING.MARGIN.MD,
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.PADDING.LG,
  },
  uploadButtonIcon: {
    fontSize: 24,
    marginRight: SPACING.MARGIN.SM,
  },
  uploadButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILIES.SORA.BOLD,
  },
  editButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    paddingVertical: SPACING.PADDING.LG,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },

  // Location styles
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MARGIN.XS,
  },
  refreshLocationButton: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    paddingHorizontal: SPACING.PADDING.SM,
    paddingVertical: SPACING.PADDING.XS,
    borderRadius: 8,
  },
  refreshLocationText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
  },
  coordinatesText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILIES.KULIM_PARK.REGULAR,
    marginTop: SPACING.MARGIN.XS,
  },
});
