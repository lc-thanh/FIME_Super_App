// region Password hashing

import bcrypt from 'bcrypt';

// saltRounds is the cost factor for hashing, which determines how computationally expensive the hashing process is.
// A higher number means more security but also more time to hash.
const saltRounds = 10;

export const hashPasswordHelper = async (
  plainPassword: string,
): Promise<string | undefined> => {
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
};

export const comparePasswordHelper = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing password:', error);
    return false;
  }
};

// endregion

// region Image processing

import sharp from 'sharp';

export async function processAvatar(
  buffer: Buffer,
  size: number = 512,
): Promise<Buffer> {
  // avatar: vuông, tối đa 512x512, nén mạnh hơn
  const resized = await sharp(buffer)
    .rotate()
    .resize(size, size, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: 78, mozjpeg: true }) // chuyển sang jpeg để tối ưu
    .toBuffer();
  return resized;
}

export async function processCover(
  buffer: Buffer,
  meta?: sharp.Metadata,
  targetWidth: number = 1600,
): Promise<Buffer> {
  // cover: giữ tỉ lệ, giới hạn chiều rộng ví dụ 1600px, nén nhẹ
  const currentWidth = meta?.width ?? null;

  const pipeline = sharp(buffer).rotate();
  if (currentWidth && currentWidth > targetWidth) {
    pipeline.resize(targetWidth);
  }
  // giữ format gốc nếu muốn, nhưng thường jpeg/webp cho web
  const out = await pipeline.jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  return out;
}

// endregion
