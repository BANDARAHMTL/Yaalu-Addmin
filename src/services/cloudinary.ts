/**
 * Cloudinary Direct Upload Service for Yaalu Admin
 */

export const CLOUDINARY_CONFIG = {
  cloudName: 'yaalu',
  uploadPreset: 'yaalu_preset',
  apiKey: '138828845892141',
};

export async function uploadToCloudinary(file: File, folder = 'yaalu_admin'): Promise<string> {
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

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Failed to upload image to Cloudinary');
  }

  const data = await res.json();
  return data.secure_url;
}
