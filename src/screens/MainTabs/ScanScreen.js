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

// Permission Modal Component
const PermissionModal = ({ visible, onRequestPermission, onCancel }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Camera Permission Required</Text>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>
              This app needs access to your camera to take photos.
              Please allow camera permission to continue.
            </Text>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.allowButton]}
              onPress={onRequestPermission}
            >
              <Text style={styles.allowButtonText}>Allow Camera</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function ScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const cameraRef = useRef(null);

  // Animation values
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

        Alert.alert('Photo Taken!', `Photo saved temporarily at: ${photo.uri}`);

      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      } finally {
        setIsCapturing(false);
      }
    }
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
          <Text style={styles.permissionHeaderTitle}>Camera Permission</Text>
          <View style={styles.permissionNavButton} />
        </View>

        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <CameraIcon color="#64748b" size={64} />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            To take photos, please allow camera access in your device settings.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestCameraPermission}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.permissionButtonGradient}
            >
              <Text style={styles.permissionButtonText}>Enable Camera</Text>
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
          <Text style={styles.loadingText}>Requesting camera permission...</Text>
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

            <Text style={styles.headerTitle}>Camera</Text>

            {/* Placeholder for symmetry */}
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
              <Text style={styles.frameGuideText}>Position subject within frame</Text>
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
    paddingBottom: 20,
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
    width: width * 0.7,
    height: height * 0.6, // Making it taller - using screen height for vertical extension
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
    borderStyle: 'dashed'
  },
  frameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  frameGuide: {
    marginTop: 20,
    alignItems: 'center',
  },
  frameGuideText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturingButton: {
    backgroundColor: '#059669',
    transform: [{ scale: 0.95 }],
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
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
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  allowButton: {
    backgroundColor: '#10b981',
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
});
