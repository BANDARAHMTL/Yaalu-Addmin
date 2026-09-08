/**
 * Cloudinary Direct Upload Service for Yaalu Admin with Auto-Fallback
 */

export const CLOUDINARY_CONFIG = {
  cloudName: 'yaalu',
  uploadPreset: 'yaalu_preset',
  apiKey: '138828845892141',
};

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function uploadToCloudinary(file: File, folder = 'yaalu_admin'): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      }
    }
  } catch (err) {
    console.warn('Direct Cloudinary upload failed, falling back to base64 encoding:', err);
  }

  // Fallback: Convert image to Base64 Data URL so upload never fails
  return await fileToBase64(file);
}
