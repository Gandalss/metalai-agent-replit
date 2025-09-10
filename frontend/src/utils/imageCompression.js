/**
 * Client-side image compression utility
 * Compresses images to a maximum file size before upload to prevent
 * 413 Request Entity Too Large errors
 */

/**
 * Compress an image file to a maximum size
 * @param {File} file - The image file to compress
 * @param {number} maxSizeBytes - Maximum file size in bytes (default: 1MB)
 * @param {number} quality - JPEG quality (0.1 to 1.0, default: 0.8)
 * @param {number} maxWidth - Maximum width in pixels (default: 1920)
 * @param {number} maxHeight - Maximum height in pixels (default: 1920)
 * @returns {Promise<File>} - Promise that resolves to compressed file
 */
export const compressImage = async (
  file,
  maxSizeBytes = 1024 * 1024, // 1MB default
  quality = 0.8,
  maxWidth = 1920,
  maxHeight = 1920
) => {
  return new Promise((resolve, reject) => {
    // Check if file is already small enough
    if (file.size <= maxSizeBytes) {
      resolve(file);
      return;
    }

    // Create canvas and context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress the image
      ctx.drawImage(img, 0, 0, width, height);

      // Start with the specified quality
      let currentQuality = quality;
      let attempts = 0;
      const maxAttempts = 10;

      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (blob.size <= maxSizeBytes || attempts >= maxAttempts || currentQuality <= 0.1) {
              // Success or reached limits
              const compressedFile = new File(
                [blob],
                file.name,
                {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                }
              );
              resolve(compressedFile);
            } else {
              // Try with lower quality
              attempts++;
              currentQuality -= 0.1;
              tryCompress();
            }
          },
          'image/jpeg',
          currentQuality
        );
      };

      tryCompress();
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    // Load the image
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Compress multiple images
 * @param {FileList|Array<File>} files - Array of image files
 * @param {number} maxSizeBytes - Maximum file size in bytes per file
 * @returns {Promise<Array<File>>} - Promise that resolves to array of compressed files
 */
export const compressImages = async (files, maxSizeBytes = 1024 * 1024) => {
  const filesArray = Array.from(files);
  const compressionPromises = filesArray.map(file => compressImage(file, maxSizeBytes));
  
  try {
    return await Promise.all(compressionPromises);
  } catch (error) {
    throw new Error(`Failed to compress images: ${error.message}`);
  }
};

/**
 * Get human-readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string} - Human readable size (e.g., "1.2 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate image file type
 * @param {File} file - File to validate
 * @returns {boolean} - True if file is a supported image type
 */
export const isValidImageFile = (file) => {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return supportedTypes.includes(file.type);
};

/**
 * Compress image with progress callback
 * @param {File} file - The image file to compress
 * @param {Function} onProgress - Progress callback (receives percentage)
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Promise that resolves to compressed file
 */
export const compressImageWithProgress = async (file, onProgress, options = {}) => {
  const {
    maxSizeBytes = 1024 * 1024,
    quality = 0.8,
    maxWidth = 1920,
    maxHeight = 1920
  } = options;

  onProgress?.(0);

  try {
    const compressedFile = await compressImage(file, maxSizeBytes, quality, maxWidth, maxHeight);
    onProgress?.(100);
    return compressedFile;
  } catch (error) {
    onProgress?.(0);
    throw error;
  }
};

export default {
  compressImage,
  compressImages,
  formatFileSize,
  isValidImageFile,
  compressImageWithProgress
};