/**
 * Contoh Penggunaan ImageImporter
 * Professional Image Import Examples for React Native/Expo
 */

import ImageImporter, {
  importFromGallery,
  takePhoto,
  importImageWithChoice,
  importMultipleFromGallery,
  importFromURL
} from './ImageImporter';

/**
 * Contoh 1: Import gambar dari galeri perangkat
 */
export const importFromGalleryExample = async () => {
  try {
    const result = await importFromGallery({
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1], // Square crop
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    if (!result.canceled && result.assets) {
      console.log('Image imported from gallery:', result.assets[0]);
      return result.assets[0];
    }

    console.log('Gallery import canceled');
    return null;
  } catch (error) {
    console.error('Failed to import from gallery:', error);
    throw error;
  }
};

/**
 * Contoh 2: Mengambil foto dengan kamera
 */
export const takePhotoExample = async () => {
  try {
    const result = await takePhoto({
      quality: 0.9,
      allowsEditing: true,
      aspect: [16, 9], // Widescreen
    });

    if (!result.canceled && result.assets) {
      console.log('Photo taken:', result.assets[0]);
      return result.assets[0];
    }

    console.log('Camera capture canceled');
    return null;
  } catch (error) {
    console.error('Failed to take photo:', error);
    throw error;
  }
};

/**
 * Contoh 3: Menampilkan pilihan antara kamera dan galeri
 */
export const importWithChoiceExample = async () => {
  try {
    const result = await importImageWithChoice({
      quality: 0.8,
      allowsEditing: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    if (!result.canceled && result.assets) {
      console.log(`Image imported from ${result.source}:`, result.assets[0]);
      return result.assets[0];
    }

    console.log('Image import canceled');
    return null;
  } catch (error) {
    console.error('Failed to import image:', error);
    throw error;
  }
};

/**
 * Contoh 4: Import multiple gambar dari galeri
 */
export const importMultipleImagesExample = async () => {
  try {
    const result = await importMultipleFromGallery({
      quality: 0.7,
      allowsEditing: false,
      selectionLimit: 5,
      maxFileSize: 8 * 1024 * 1024, // 8MB per image
    });

    if (!result.canceled && result.assets) {
      console.log(`${result.count} images imported:`, result.assets);
      return result.assets;
    }

    console.log('Multiple import canceled');
    return [];
  } catch (error) {
    console.error('Failed to import multiple images:', error);
    throw error;
  }
};

/**
 * Contoh 5: Import gambar dari URL
 */
export const importFromURLExample = async () => {
  try {
    const imageUrl = 'https://picsum.photos/800/600';

    const result = await importFromURL(imageUrl, {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      validateFormat: true,
      supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      timeout: 15000, // 15 seconds
    });

    if (!result.canceled && result.assets) {
      console.log('Image imported from URL:', result.assets[0]);
      return result.assets[0];
    }

    return null;
  } catch (error) {
    console.error('Failed to import from URL:', error);
    throw error;
  }
};

/**
 * Contoh 6: Save gambar ke galeri perangkat
 */
export const saveToGalleryExample = async (imageUri) => {
  try {
    const result = await ImageImporter.saveToGallery(imageUri, {
      albumName: 'Aksi Hijau Photos'
    });

    console.log('Image saved to gallery:', result);
    return result;
  } catch (error) {
    console.error('Failed to save to gallery:', error);
    throw error;
  }
};

/**
 * Contoh 7: Request permissions secara manual
 */
export const checkPermissionsExample = async () => {
  try {
    const permissions = await ImageImporter.requestPermissions();

    console.log('Permission status:', permissions);

    if (!permissions.allGranted) {
      console.warn('Not all permissions granted');
      if (!permissions.camera) console.warn('Camera permission missing');
      if (!permissions.mediaLibrary) console.warn('Media library permission missing');
      if (!permissions.imagePicker) console.warn('Image picker permission missing');
    }

    return permissions;
  } catch (error) {
    console.error('Failed to check permissions:', error);
    throw error;
  }
};

/**
 * Contoh penggunaan lengkap dalam komponen React Native
 */
export const completeUsageExample = `
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator
} from 'react-native';
import ImageImporter, { importImageWithChoice } from '../utils/ImageImporter';

const ImagePickerComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const perms = await ImageImporter.requestPermissions();
      setPermissions(perms);

      if (!perms.allGranted) {
        Alert.alert(
          'Permissions Required',
          'This app needs camera and photo library access to work properly.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check permissions: ' + error.message);
    }
  };

  const selectImage = async () => {
    try {
      setLoading(true);

      const result = await importImageWithChoice({
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
        maxFileSize: 5 * 1024 * 1024, // 5MB limit
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        setSelectedImage(image);

        // Optionally save to gallery
        if (result.source === 'camera') {
          await ImageImporter.saveToGallery(image.uri, {
            albumName: 'Aksi Hijau'
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Picker Example</Text>

      {/* Permission Status */}
      {permissions && (
        <Text style={styles.permissionText}>
          Permissions: {permissions.allGranted ? '✅ All Granted' : '❌ Missing'}
        </Text>
      )}

      {/* Image Display */}
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
          <Text style={styles.imageInfo}>
            Size: {selectedImage.width}x{selectedImage.height}
          </Text>
          <Text style={styles.imageInfo}>
            Format: {selectedImage.format || 'Unknown'}
          </Text>
          <Text style={styles.imageInfo}>
            Source: {selectedImage.source || 'Unknown'}
          </Text>
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <Text style={styles.buttonText}>Remove Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}

      {/* Select Button */}
      <TouchableOpacity
        style={[styles.selectButton, loading && styles.disabledButton]}
        onPress={selectImage}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Select Image</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  placeholder: {
    width: 250,
    height: 250,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  selectButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImagePickerComponent;
`;

/**
 * Contoh advanced: Batch processing multiple images
 */
export const batchProcessingExample = async () => {
  try {
    // Import multiple images
    const result = await importMultipleFromGallery({
      selectionLimit: 10,
      quality: 0.7,
    });

    if (result.canceled || !result.assets) {
      return [];
    }

    // Process each image
    const processedImages = [];
    for (const image of result.assets) {
      // Add custom metadata
      const processedImage = {
        ...image,
        processed: true,
        processedAt: new Date().toISOString(),
        thumbnail: image.uri, // In real app, create thumbnail
      };

      processedImages.push(processedImage);
    }

    console.log(`Processed ${processedImages.length} images`);
    return processedImages;
  } catch (error) {
    console.error('Batch processing failed:', error);
    throw error;
  }
};
