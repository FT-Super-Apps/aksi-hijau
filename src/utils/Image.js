import { Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';

/**
 * Professional Image Import Utility Class
 * Provides comprehensive image import functionality from gallery, camera, and external sources
 */
class ImageImporter {
import { Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';

/**
 * Professional Image Import Utility Class
 * Provides functionality to import images from device gallery, camera, and external sources
 */
class ImageImporter {
  /**
   * Request all necessary permissions for image operations
   * @returns {Promise<object>} Permission status object
   */
  static async requestPermissions() {
    try {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      const imagePickerPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      return {
        camera: cameraPermission.status === 'granted',
        mediaLibrary: mediaLibraryPermission.status === 'granted',
        imagePicker: imagePickerPermission.status === 'granted',
        allGranted: cameraPermission.status === 'granted' &&
          mediaLibraryPermission.status === 'granted' &&
          imagePickerPermission.status === 'granted'
      };
    } catch (error) {
      throw new Error(`Permission request failed: ${error.message}`);
    }
  }

  /**
   * Import image from device gallery
   * @param {object} options - Configuration options for image picker
   * @returns {Promise<object>} Selected image object
   */
  static async importFromGallery(options = {}) {
    try {
      // Request permissions first
      const permissions = await this.requestPermissions();
      if (!permissions.imagePicker) {
        throw new Error('Gallery access permission not granted');
      }

      const defaultOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
        selectionLimit: 1,
        ...options
      };

      const result = await ImagePicker.launchImageLibraryAsync(defaultOptions);

      if (result.canceled) {
        return { canceled: true, assets: null };
      }

      // Process the selected image(s)
      const processedAssets = await this._processPickerAssets(result.assets, options);

      return {
        canceled: false,
        assets: processedAssets,
        source: 'gallery',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Gallery import failed: ${error.message}`);
    }
  }

  /**
   * Take photo using device camera
   * @param {object} options - Configuration options for camera
   * @returns {Promise<object>} Captured image object
   */
  static async takePhoto(options = {}) {
    try {
      // Request permissions first
      const permissions = await this.requestPermissions();
      if (!permissions.camera) {
        throw new Error('Camera access permission not granted');
      }

      const defaultOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        ...options
      };

      const result = await ImagePicker.launchCameraAsync(defaultOptions);

      if (result.canceled) {
        return { canceled: true, assets: null };
      }

      // Process the captured image
      const processedAssets = await this._processPickerAssets(result.assets, options);

      return {
        canceled: false,
        assets: processedAssets,
        source: 'camera',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Camera capture failed: ${error.message}`);
    }
  }

  /**
   * Show action sheet to choose between camera and gallery
   * @param {object} options - Configuration options
   * @returns {Promise<object>} Selected/captured image object
   */
  static async importWithChoice(options = {}) {
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Select Image Source',
        'Choose how you want to add an image',
        [
          {
            text: 'Camera',
            onPress: async () => {
              try {
                const result = await this.takePhoto(options);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            }
          },
          {
            text: 'Gallery',
            onPress: async () => {
              try {
                const result = await this.importFromGallery(options);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            }
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve({ canceled: true, assets: null })
          }
        ]
      );
    });
  }

  /**
   * Import multiple images from gallery
   * @param {object} options - Configuration options
   * @returns {Promise<object>} Multiple selected images object
   */
  static async importMultipleFromGallery(options = {}) {
    try {
      const permissions = await this.requestPermissions();
      if (!permissions.imagePicker) {
        throw new Error('Gallery access permission not granted');
      }

      const defaultOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 10,
        ...options
      };

      const result = await ImagePicker.launchImageLibraryAsync(defaultOptions);

      if (result.canceled) {
        return { canceled: true, assets: null };
      }

      // Process all selected images
      const processedAssets = await this._processPickerAssets(result.assets, options);

      return {
        canceled: false,
        assets: processedAssets,
        source: 'gallery',
        count: processedAssets.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Multiple gallery import failed: ${error.message}`);
    }
  }

  /**
   * Import image from URL
   * @param {string} url - Image URL
   * @param {object} options - Configuration options
   * @returns {Promise<object>} Downloaded image object
   */
  static async importFromURL(url, options = {}) {
    try {
      const defaultOptions = {
        validateFormat: true,
        supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        maxFileSize: 10 * 1024 * 1024, // 10MB
        timeout: 30000, // 30 seconds
        ...options
      };

      // Validate URL format
      if (!this._isValidURL(url)) {
        throw new Error('Invalid URL format');
      }

      // Download and validate the image
      const downloadResult = await this._downloadImage(url, defaultOptions);

      return {
        canceled: false,
        assets: [downloadResult],
        source: 'url',
        originalUrl: url,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`URL import failed: ${error.message}`);
    }
  }

  /**
   * Process picker assets with additional metadata
   * @private
   */
  static async _processPickerAssets(assets, options) {
    const processedAssets = [];

    for (const asset of assets) {
      const processedAsset = {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type || 'image',
        fileSize: asset.fileSize,
        fileName: asset.fileName || this._generateFileName(),
        base64: asset.base64 || null,
        exif: asset.exif || null,
        aspectRatio: asset.width / asset.height,
        orientation: this._getOrientation(asset.width, asset.height),
        timestamp: new Date().toISOString()
      };

      // Validate file size if specified
      if (options.maxFileSize && processedAsset.fileSize > options.maxFileSize) {
        throw new Error(`Image file size (${processedAsset.fileSize}) exceeds maximum limit (${options.maxFileSize})`);
      }

      // Add format validation
      if (options.validateFormat) {
        const format = this._getImageFormat(processedAsset.uri);
        if (options.supportedFormats && !options.supportedFormats.includes(format)) {
          throw new Error(`Unsupported image format: ${format}`);
        }
        processedAsset.format = format;
      }

      processedAssets.push(processedAsset);
    }

    return processedAssets;
  }

  /**
   * Download image from URL
   * @private
   */
  static async _downloadImage(url, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'image/*'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > options.maxFileSize) {
        throw new Error('Image file size exceeds maximum limit');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('URL does not point to a valid image');
      }

      // For now, return the URL as uri (in real app, you might want to download to local storage)
      return {
        uri: url,
        type: contentType,
        fileSize: contentLength ? parseInt(contentLength) : null,
        fileName: this._extractFileNameFromURL(url),
        downloadedAt: new Date().toISOString()
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Validate URL format
   * @private
   */
  static _isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Extract filename from URL
   * @private
   */
  static _extractFileNameFromURL(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('/').pop() || 'downloaded_image';
    } catch (_) {
      return 'downloaded_image';
    }
  }

  /**
   * Generate unique filename
   * @private
   */
  static _generateFileName() {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 8);
    return `image_${timestamp}_${random}.jpg`;
  }

  /**
   * Get image format from URI
   * @private
   */
  static _getImageFormat(uri) {
    const extension = uri.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  }

  /**
   * Determine image orientation
   * @private
   */
  static _getOrientation(width, height) {
    if (width > height) return 'landscape';
    if (height > width) return 'portrait';
    return 'square';
  }

  /**
   * Save imported image to device gallery
   * @param {string} uri - Image URI to save
   * @param {object} options - Save options
   * @returns {Promise<object>} Save result
   */
  static async saveToGallery(uri, options = {}) {
    try {
      const permissions = await this.requestPermissions();
      if (!permissions.mediaLibrary) {
        throw new Error('Media library permission not granted');
      }

      const asset = await MediaLibrary.createAssetAsync(uri);

      if (options.albumName) {
        let album = await MediaLibrary.getAlbumAsync(options.albumName);
        if (!album) {
          album = await MediaLibrary.createAlbumAsync(options.albumName, asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      }

      return {
        success: true,
        asset,
        album: options.albumName || null,
        savedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to save image to gallery: ${error.message}`);
    }
  }

  /**
   * Get image metadata and information
   * @param {string} uri - Image URI
   * @returns {Promise<object>} Image metadata
   */
  static async getImageInfo(uri) {
    try {
      if (Platform.OS === 'web') {
        return { width: null, height: null, type: null };
      }

      // This would require additional libraries like expo-image-manipulator
      // For now, return basic info
      return {
        uri,
        timestamp: new Date().toISOString(),
        platform: Platform.OS
      };
    } catch (error) {
      throw new Error(`Failed to get image info: ${error.message}`);
    }
  }
}

// Export the class and simplified functions
export default ImageImporter;

/**
 * Quick function to import image from gallery
 * @param {object} options - Optional configuration
 * @returns {Promise<object>} Selected image object
 */
export const importFromGallery = (options) => ImageImporter.importFromGallery(options);

/**
 * Quick function to take photo with camera
 * @param {object} options - Optional configuration
 * @returns {Promise<object>} Captured image object
 */
export const takePhoto = (options) => ImageImporter.takePhoto(options);

/**
 * Quick function to show image source choice
 * @param {object} options - Optional configuration
 * @returns {Promise<object>} Selected/captured image object
 */
export const importImageWithChoice = (options) => ImageImporter.importWithChoice(options);

/**
 * Quick function to import multiple images from gallery
 * @param {object} options - Optional configuration
 * @returns {Promise<object>} Multiple selected images object
 */
export const importMultipleImages = (options) => ImageImporter.importMultipleFromGallery(options);

/**
 * Quick function to import image from URL
 * @param {string} url - Image URL
 * @param {object} options - Optional configuration
 * @returns {Promise<object>} Downloaded image object
 */
export const importFromURL = (url, options) => ImageImporter.importFromURL(url, options);
}

// Export the class and a simplified function for basic usage
export default ImageManager;

/**
 * Simplified function for basic image import
 * @param {string|object} source - Image source
 * @param {object} options - Optional configuration
 * @returns {Promise<object>} Processed image object
 */
export const importImage = (source, options) => ImageManager.importImage(source, options);

/**
 * Quick function to import multiple images
 * @param {Array} sources - Array of image sources
 * @param {object} options - Optional configuration
 * @returns {Promise<Array>} Array of processed image objects
 */
export const importMultipleImages = (sources, options) => ImageManager.importMultipleImages(sources, options);

/**
 * Quick function to save image to gallery
 * @param {string} uri - Image URI
 * @param {object} options - Save options
 * @returns {Promise<object>} Save result
 */
export const saveImageToGallery = (uri, options) => ImageManager.saveToGallery(uri, options);
