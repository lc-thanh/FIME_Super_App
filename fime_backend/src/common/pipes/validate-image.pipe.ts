// src/uploads/validate-image.pipe.ts
import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import FileType from 'file-type';
import sharp from 'sharp';

export type FileWithMeta = Express.Multer.File & {
  __imageMeta?: sharp.Metadata;
};

export type ValidateImageOptions = {
  maxBytes: number;
  allowedMimes?: string[]; // e.g. ['image/png','image/jpeg']
  maxWidth?: number; // optional pixel limit
  maxHeight?: number;
  allowNullFile?: boolean; // default false
};

@Injectable()
export class ValidateImagePipe implements PipeTransform {
  constructor(private readonly opts: ValidateImageOptions) {}

  async transform(value: any, _metadata: ArgumentMetadata) {
    const file = value as Express.Multer.File;
    if (this.opts.allowNullFile && !file) {
      return null;
    }
    if (!file)
      throw new BadRequestException('File không hợp lệ hoặc không được phép');

    const buffer = file.buffer;
    if (!buffer || buffer.length === 0)
      throw new BadRequestException('File rỗng!');

    // 1. Kiểm tra kích thước bytes (double-check)
    if (buffer.length > this.opts.maxBytes) {
      throw new BadRequestException(
        `File quá lớn. Giới hạn ${this.opts.maxBytes} bytes`,
      );
    }

    try {
      // 2. Kiểm tra magic bytes => xác định mime thực
      const ft = await FileType.fileTypeFromBuffer(buffer);
      if (!ft) throw new BadRequestException('Không thể nhận diện loại file');
      const allowed = this.opts.allowedMimes ?? [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      if (!allowed.includes(ft.mime)) {
        throw new BadRequestException(`Loại file không hợp lệ: ${ft.mime}`);
      }

      // 3. Nếu là ảnh: kiểm tra pixel và thử đọc metadata
      const meta = await sharp(buffer).metadata();

      if (this.opts.maxWidth && meta.width && meta.width > this.opts.maxWidth) {
        throw new BadRequestException(
          `Chiều rộng ảnh tối đa ${this.opts.maxWidth}px`,
        );
      }
      if (
        this.opts.maxHeight &&
        meta.height &&
        meta.height > this.opts.maxHeight
      ) {
        throw new BadRequestException(
          `Chiều cao ảnh tối đa ${this.opts.maxHeight}px`,
        );
      }

      // attach metadata to file for later use
      (file as FileWithMeta).__imageMeta = meta;
      // update file.mimetype to real mime
      file.mimetype = ft.mime;
    } catch (_err) {
      throw new BadRequestException('Ảnh không hợp lệ hoặc bị lỗi');
    }

    return file;
  }
}
