/**
 * Client-Side Fast Image Compression Utility
 * Drastically reduces upload payload size (from ~10MB+ down to ~150KB)
 * while maintaining pristine document readability and badge quality.
 */

export async function compressImage(fileOrBase64, options = {}) {
  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.8,
    mimeType = 'image/jpeg',
  } = options;

  if (!fileOrBase64) return fileOrBase64;

  // If it's a string and doesn't start with data:image or is already very small, return as is
  if (typeof fileOrBase64 === 'string') {
    if (!fileOrBase64.startsWith('data:image/')) {
      return fileOrBase64;
    }
    // If it's already under 120KB in base64 length (~90KB file), no need to re-compress
    if (fileOrBase64.length < 120 * 1024) {
      return fileOrBase64;
    }
  }

  // If it's a File and not an image (e.g. PDF), read as raw Data URL
  if (fileOrBase64 instanceof File || fileOrBase64 instanceof Blob) {
    if (fileOrBase64.type && !fileOrBase64.type.startsWith('image/')) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBase64);
      });
    }
  }

  return new Promise((resolve) => {
    // 1. Convert input to image source
    let src = '';
    let shouldRevoke = false;

    if (typeof fileOrBase64 === 'string') {
      src = fileOrBase64;
    } else if (fileOrBase64 instanceof File || fileOrBase64 instanceof Blob) {
      src = URL.createObjectURL(fileOrBase64);
      shouldRevoke = true;
    } else {
      return resolve(fileOrBase64);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let { width, height } = img;

        // Calculate aspect ratio preserving downscale
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (shouldRevoke) URL.revokeObjectURL(src);
          return resolve(src);
        }

        // Fill white background for transparent PNGs converting to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Draw image resized
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        if (shouldRevoke) URL.revokeObjectURL(src);

        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('Image compression fallback:', err);
        if (shouldRevoke) URL.revokeObjectURL(src);
        resolve(src);
      }
    };

    img.onerror = () => {
      if (shouldRevoke) URL.revokeObjectURL(src);
      resolve(src);
    };

    img.src = src;
  });
}
