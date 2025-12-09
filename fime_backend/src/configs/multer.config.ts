import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import multer from 'multer';

export const memoryStorage = multer.memoryStorage();

export const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  // Chỉ cho phép .jpg, .jpeg, .png, .webp
  if (!VALID_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Chỉ chấp nhận JPG/JPEG/PNG/WEBP cho file ảnh'),
      false,
    );
  }
  callback(null, true);
};

export const VALID_IMAGE_MIME_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const USER_AVATAR_MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const USER_AVATAR_FOLDER = 'users/avatars';

export const NEWEST_PRODUCT_IMAGE_MAX_SIZE = 20 * 1024 * 1024; // 20MB

export const NEWEST_PRODUCT_IMAGE_FOLDER = 'newest-products/images';
