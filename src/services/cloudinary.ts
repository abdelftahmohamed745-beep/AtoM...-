/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Cloudinary Media Service Integration
// Provides real direct image uploads to Cloudinary with secure signature generation.

import { getCloudinaryCloudName, getCloudinaryApiKey, getCloudinaryApiSecret } from './config';

export interface ICloudinaryService {
  uploadImage(file: File): Promise<string>;
  deleteImage(url: string): Promise<boolean>;
  getOptimizedUrl(url: string, width?: number, height?: number): string;
}

export class CloudinaryService implements ICloudinaryService {
  private async computeSha1(string: string): Promise<string> {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-1', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  async uploadImage(file: File): Promise<string> {
    const cloudName = getCloudinaryCloudName();
    const apiKey = getCloudinaryApiKey();
    const apiSecret = getCloudinaryApiSecret();

    if (!cloudName) {
      throw new Error('Cloudinary Cloud Name is not configured. Please check your API Settings.');
    }
    if (!apiKey) {
      throw new Error('Cloudinary API Key is not configured. Please check your API Settings.');
    }
    if (!apiSecret) {
      throw new Error('Cloudinary API Secret is not configured. Please check your API Settings.');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    // Sort parameters alphabetically to sign: timestamp is the only parameter here
    const stringToSign = `timestamp=${timestamp}${apiSecret}`;
    const signature = await this.computeSha1(stringToSign);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        let errMsg = 'Upload failed';
        try {
          const parsed = JSON.parse(errText);
          if (parsed?.error?.message) {
            errMsg = parsed.error.message;
          }
        } catch {
          errMsg = errText || response.statusText;
        }
        throw new Error(`Cloudinary Error: ${errMsg}`);
      }

      const data = await response.json();
      if (!data.secure_url) {
        throw new Error('Cloudinary secure_url was not returned from the server.');
      }

      return data.secure_url;
    } catch (err: any) {
      console.error('[Cloudinary Service] Upload failure:', err);
      throw new Error(err.message || 'Network error connecting to Cloudinary API.');
    }
  }

  async deleteImage(url: string): Promise<boolean> {
    const cloudName = getCloudinaryCloudName();
    const apiKey = getCloudinaryApiKey();
    const apiSecret = getCloudinaryApiSecret();

    if (!cloudName || !apiKey || !apiSecret) {
      return false;
    }

    try {
      // Extract public_id from Cloudinary URL
      // E.g., https://res.cloudinary.com/cloudname/image/upload/v1234567/public_id.jpg
      const parts = url.split('/upload/');
      if (parts.length !== 2) return false;
      
      // Remove version segment (starts with 'v' followed by digits)
      let pathAfterUpload = parts[1];
      const versionRegex = /^v\d+\//;
      if (versionRegex.test(pathAfterUpload)) {
        pathAfterUpload = pathAfterUpload.replace(versionRegex, '');
      }
      
      // Strip extension to get pure publicId
      const publicId = pathAfterUpload.substring(0, pathAfterUpload.lastIndexOf('.'));

      const timestamp = Math.floor(Date.now() / 1000);
      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = await this.computeSha1(stringToSign);

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn('[Cloudinary Service] Destroy response error:', errText);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Cloudinary Service] Failed to destroy image:', err);
      return false;
    }
  }

  getOptimizedUrl(url: string, width: number = 800, height?: number): string {
    if (!url) return '';
    if (!url.includes('cloudinary.com')) {
      return url;
    }
    
    // Add Cloudinary transformation parameters dynamically
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transform = height 
        ? `w_${width},h_${height},c_fill,q_auto,f_auto` 
        : `w_${width},c_limit,q_auto,f_auto`;
      return `${parts[0]}/upload/${transform}/${parts[1]}`;
    }
    return url;
  }
}

export const cloudinaryService = new CloudinaryService();
