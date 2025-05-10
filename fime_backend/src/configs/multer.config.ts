/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const userAvatarsStorage = diskStorage({
  destination: join(process.cwd(), 'public', 'users', 'avatars'), // thư mục lưu file avatar
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExt = extname(file.originalname);
    callback(null, `user-${uniqueSuffix}${fileExt}`);
  },
});

export const imageFileFilter = (req, file, callback) => {
  // Chỉ cho phép .jpg, .jpeg, .png, .webp
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return callback(
      new BadRequestException('Chỉ hỗ trợ ảnh .jpg, .jpeg, .png, .webp'),
      false,
    );
  }
  callback(null, true);
};

export const userAvatarLimits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};
