import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { config } from '../../../config';
import { ApiError } from '../../../shared/ApiError';
import { ERROR_MESSAGES } from '../../../shared/errorMessages.constants';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
}

export class CloudinaryService {
  async uploadBuffer(
    buffer: Buffer,
    mimeType: string,
    folder = 'nutrilens/meals'
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const resourceType = 'image';
      const format = mimeType.split('/')[1] ?? 'jpg';

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          format,
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            reject(ApiError.internal(ERROR_MESSAGES.CLOUDINARY.UPLOAD_FAILED(error?.message ?? 'Unknown error')));
            return;
          }
          resolve({
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      // Convert Buffer to Readable stream and pipe into Cloudinary
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    } catch {
      // Log but don't throw — cleanup failure should not surface to user
      console.error(`[CloudinaryService] Failed to delete asset: ${publicId}`);
    }
  }
}
