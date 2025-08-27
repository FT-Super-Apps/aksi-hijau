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
  Modal,
  Animated,
  Image,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import Svg, { Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Custom SVG Icons
const BackIcon = ({ color = '#333', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19L5 12L12 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MoreIcon = ({ color = '#333', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CameraIcon = ({ color = '#fff', size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={2} />
  </Svg>
);

const CheckIcon = ({ color = '#fff', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17L4 12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TrashIcon = ({ color = '#fff', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6H5H21"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const RetakeIcon = ({ color = '#fff', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C9.5 3 7.26 4.04 5.64 5.64L3 3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 3L3 9L9 9"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Permission Modal Component
const PermissionModal = ({ visible, onRequestPermission, onCancel }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: opacityAnim }]}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalIconContainer}>
              <CameraIcon color="#10b981" size={48} />
            </View>
            <Text style={styles.modalTitle}>Izin Kamera Diperlukan</Text>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>
              Aplikasi ini memerlukan akses kamera untuk mengambil foto.
              Silakan berikan izin kamera untuk melanjutkan.
            </Text>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.allowButton]}
              onPress={onRequestPermission}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.allowButtonGradient}
              >
                <Text style={styles.allowButtonText}>Izinkan Kamera</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// Photo Confirmation Modal Component
const PhotoConfirmationModal = ({ visible, photoUri, onConfirm, onDelete, onRetake }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDelete}
    >
      <Animated.View style={[styles.photoModalOverlay, { opacity: opacityAnim }]}>
        <Animated.View
          style={[
            styles.photoModalContent,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.photoModalHeader}>
            <View style={styles.photoModalIndicator} />
            <Text style={styles.photoModalTitle}>Pratinjau Foto</Text>
            <Text style={styles.photoModalSubtitle}>Apakah Anda ingin menyimpan foto ini?</Text>
          </View>

          <View style={styles.photoPreviewContainer}>
            {photoUri && (
              <Animated.View style={[styles.photoPreviewWrapper, { transform: [{ scale: scaleAnim }] }]}>
                <Image
                  source={{ uri: photoUri }}
                  style={styles.photoPreview}
                  resizeMode="cover"
                />
                <View style={styles.photoPreviewOverlay}>
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.photoPreviewGradient}
                  />
                </View>
              </Animated.View>
            )}
          </View>

          <View style={styles.photoModalActions}>
            {/* Secondary Actions Row */}
            <View style={styles.secondaryActionsRow}>
              <TouchableOpacity
                style={[styles.photoActionButton, styles.deleteButton]}
                onPress={onDelete}
              >
                <View style={styles.buttonIconContainer}>
                  <TrashIcon color="#ef4444" size={18} />
                </View>
                <Text style={styles.deleteButtonText}>Hapus</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.photoActionButton, styles.retakeButton]}
                onPress={onRetake}
              >
                <View style={styles.buttonIconContainer}>
                  <RetakeIcon color="#f59e0b" size={18} />
                </View>
                <Text style={styles.retakeButtonText}>Ambil Ulang</Text>
              </TouchableOpacity>
            </View>

            {/* Primary Action */}
            <TouchableOpacity
              style={[styles.photoActionButton, styles.saveButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.buttonIconContainer}>
                  <CheckIcon color="#fff" size={20} />
                </View>
                <Text style={styles.saveButtonText}>Simpan Foto</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default function CameraScreenn({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showPhotoConfirmation, setShowPhotoConfirmation] = useState(false);

  const cameraRef = useRef(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    requestCameraPermission();
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });

        // Simpan foto dan tampilkan modal konfirmasi
        setCapturedPhoto(photo);
        setShowPhotoConfirmation(true);

      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Kesalahan', 'Gagal mengambil foto');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleConfirmPhoto = () => {
    setShowPhotoConfirmation(false);
    Alert.alert(
      'Foto Tersimpan!',
      `Foto berhasil disimpan!`,
      [
        {
          text: 'OK',
          onPress: () => {
            setCapturedPhoto(null);
            // Anda bisa menambahkan logika penyimpanan foto di sini
            // misalnya menyimpan ke galeri atau upload ke server
          }
        }
      ]
    );
  };

  const handleDeletePhoto = () => {
    setShowPhotoConfirmation(false);
    setCapturedPhoto(null);
    // Foto akan otomatis terhapus dari state
  };

  const handleRetakePhoto = () => {
    setShowPhotoConfirmation(false);
    setCapturedPhoto(null);
    // Kembali ke mode kamera untuk mengambil foto ulang
  };

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status !== 'granted') {
        setShowPermissionModal(true);
      } else {
        setShowPermissionModal(false);
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
      setShowPermissionModal(true);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    // Remove this function since we're not scanning anymore
  };

  const handlePermissionRequest = () => {
    setShowPermissionModal(false);
    requestCameraPermission();
  };

  const handlePermissionCancel = () => {
    setShowPermissionModal(false);
    navigation?.goBack();
  };

  const handleGoBack = () => {
    navigation?.goBack();
  };

  // Show permission modal if permission is denied
  if (hasPermission === false) {
    return (
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0']}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        {/* Header */}
        <View style={styles.permissionHeader}>
          <TouchableOpacity style={styles.permissionNavButton} onPress={handleGoBack}>
            <BackIcon color="#333" size={24} />
          </TouchableOpacity>
          <Text style={styles.permissionHeaderTitle}>Izin Kamera</Text>
          <View style={styles.permissionNavButton} />
        </View>

        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <CameraIcon color="#64748b" size={64} />
          </View>
          <Text style={styles.permissionTitle}>Akses Kamera Diperlukan</Text>
          <Text style={styles.permissionMessage}>
            Untuk mengambil foto, silakan berikan akses kamera pada pengaturan perangkat Anda.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestCameraPermission}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.permissionButtonGradient}
            >
              <Text style={styles.permissionButtonText}>Aktifkan Kamera</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <PermissionModal
          visible={showPermissionModal}
          onRequestPermission={handlePermissionRequest}
          onCancel={handlePermissionCancel}
        />
      </LinearGradient>
    );
  }

  // Show loading if permission is still being requested
  if (hasPermission === null) {
    return (
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0']}
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIcon}>
            <CameraIcon color="#64748b" size={48} />
          </View>
          <Text style={styles.loadingText}>Meminta izin kamera...</Text>
        </View>

        <PermissionModal
          visible={showPermissionModal}
          onRequestPermission={handlePermissionRequest}
          onCancel={handlePermissionCancel}
        />
      </LinearGradient>
    );
  }

  // Main scanner interface
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        {/* Header Navigation */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.navButton} onPress={handleGoBack}>
              <BackIcon color="#fff" size={24} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Kamera</Text>
            <View style={styles.navButton} />
          </View>
        </LinearGradient>

        {/* Camera Preview with Photo Frame */}
        <View style={styles.cameraPreview}>
          {/* Photo frame with dashed border */}
          <View style={styles.photoFrameContainer}>
            <View style={styles.photoFrame}>
              {/* Dashed border corners */}
              <View style={[styles.frameCorner, styles.topLeft]} />
              <View style={[styles.frameCorner, styles.topRight]} />
              <View style={[styles.frameCorner, styles.bottomLeft]} />
              <View style={[styles.frameCorner, styles.bottomRight]} />
            </View>

            {/* Guide text */}
            <View style={styles.frameGuide}>
              <Text style={styles.frameGuideText}>Posisikan objek di dalam bingkai</Text>
              <Text style={styles.frameGuideSubtext}>Pastikan pencahayaan cukup untuk hasil terbaik</Text>
            </View>
          </View>
        </View>

        {/* Bottom camera controls */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.bottomGradient}
        >
          <View style={styles.bottomSection}>
            <View style={styles.cameraControls}>
              {/* Placeholder for symmetry */}
              <View style={styles.placeholderButton} />

              {/* Photo capture button */}
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={isCapturing}
              >
                <Animated.View style={[
                  styles.captureButtonInner,
                  { transform: [{ scale: pulseAnim }] },
                  isCapturing && styles.capturingButton
                ]}>
                  <CameraIcon color="#fff" size={32} />
                </Animated.View>
              </TouchableOpacity>

              {/* Placeholder for symmetry */}
              <View style={styles.placeholderButton} />
            </View>
          </View>
        </LinearGradient>
      </CameraView>

      {/* Permission Modal */}
      <PermissionModal
        visible={showPermissionModal}
        onRequestPermission={handlePermissionRequest}
        onCancel={handlePermissionCancel}
      />

      {/* Photo Confirmation Modal */}
      <PhotoConfirmationModal
        visible={showPhotoConfirmation}
        photoUri={capturedPhoto?.uri}
        onConfirm={handleConfirmPhoto}
        onDelete={handleDeletePhoto}
        onRetake={handleRetakePhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  scanFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoFrame: {
    width: width * 0.75,
    height: height * 0.6, // Making it taller - using screen height for vertical extension
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
    borderStyle: 'dashed'
  },
  frameCorner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#fff',
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  frameGuide: {
    marginTop: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  frameGuideText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  frameGuideSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  capturingButton: {
    backgroundColor: '#059669',
    transform: [{ scale: 0.92 }],
  },
  placeholderButton: {
    width: 50,
    height: 50,
  },
  // Permission states
  permissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  permissionHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    flex: 1,
  },
  permissionNavButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  permissionButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '500',
  },
  // Modal styles - updated for modern design
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  modalMessage: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  allowButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  allowButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  allowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Photo Confirmation Modal styles
  photoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  photoModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    maxHeight: height * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  photoModalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  photoModalHeader: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  photoModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  photoModalSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  photoPreviewContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  photoPreviewWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  photoPreview: {
    width: width * 0.85,
    height: height * 0.5,
    backgroundColor: '#f3f4f6',
  },
  photoPreviewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  photoPreviewGradient: {
    flex: 1,
  },
  photoModalActions: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 16,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  photoActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    minHeight: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIconContainer: {
    marginRight: 2,
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#fee2e2',
    shadowColor: '#ef4444',
  },
  retakeButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#fef3c7',
    shadowColor: '#f59e0b',
  },
  saveButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    minHeight: 56,
  },
  deleteButtonText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  retakeButtonText: {
    color: '#d97706',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
