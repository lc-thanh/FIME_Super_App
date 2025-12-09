import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Bucket } from '@google-cloud/storage';

interface UploadParams {
  file: Express.Multer.File;
  folder?: string;
  fileName?: string;
  isPublic?: boolean;
}

@Injectable()
export class FirebaseService {
  private readonly bucket: Bucket;

  constructor(
    // Inject token 'FIREBASE_APP' vào đây
    // Việc này ép NestJS phải chạy initializeApp() xong mới được tạo Service này
    @Inject('FIREBASE_APP') private readonly firebaseApp: admin.app.App,
  ) {
    this.bucket = this.firebaseApp.storage().bucket();
  }

  async uploadImage({
    file,
    folder = 'images',
    fileName,
    isPublic = true,
  }: UploadParams): Promise<{ publicUrl: string; filePath: string }> {
    try {
      // 1. Tạo tên file unique (thêm timestamp để tránh trùng)
      // Nếu folder có dấu / đầu hoặc cuối thì loại bỏ
      const normalizedFolder = folder.replace(/^\/+/, '').replace(/\/$/, '');
      // Nếu người dùng truyền fileName thì dùng tên đó, nếu không thì tạo tên ngẫu nhiên
      const filePath =
        normalizedFolder +
        '/' +
        (fileName ?? `${Date.now()}-${file.originalname}`);
      const fileRef = this.bucket.file(filePath);

      // 2. Upload file
      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype, // Quan trọng: Để trình duyệt hiển thị ảnh thay vì tải về
        },
      });

      // 3. Cấp quyền Public cho file này
      // Việc này cho phép bất kỳ ai cũng có thể xem qua link storage.googleapis.com
      if (isPublic) await fileRef.makePublic();

      // 4. Trả về Link CDN
      const publicUrl = this.getPublicUrl(filePath);

      return {
        filePath,
        publicUrl,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(`Failed to upload image to firebase: ${error.message}`);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra khi tải ảnh lên storage. Vui lòng thử lại sau!',
      );
    }
  }

  async deleteImage(
    imagePathOrUrl: string,
    ignoreNotFound: boolean = true,
  ): Promise<void> {
    try {
      // 1. Xử lý đầu vào: Tách lấy path chuẩn nếu người dùng truyền vào full URL
      const path = this.extractPathFromUrl(imagePathOrUrl);

      // 2. Tham chiếu đến file
      const file = this.bucket.file(path);

      // 3. Xóa file
      // ignoreNotFound: true giúp không báo lỗi nếu file đã bị xóa từ trước (tránh crash app)
      await file.delete({ ignoreNotFound });

      // Có thể log response nếu cần kiểm tra
      // console.log(`Deleted file: ${path}`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(`Failed to delete image from firebase: ${error.message}`);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra khi xóa ảnh khỏi storage. Vui lòng thử lại sau!',
      );
    }
  }

  extractPathFromUrl(url: string): string {
    const bucketName = this.bucket.name;
    const prefix = `https://storage.googleapis.com/${bucketName}/`;

    // Nếu chuỗi bắt đầu bằng domain google storage -> Cắt bỏ để lấy path
    if (url.startsWith(prefix)) {
      // Cắt bỏ phần domain
      let path = url.replace(prefix, '');

      // Quan trọng: Vì lúc upload dùng encodeURIComponent,
      // nên lúc xóa phải decode để lấy lại tên gốc (ví dụ: %20 -> khoảng trắng)
      path = decodeURIComponent(path);
      return path;
    }

    // Nếu không phải URL mà là path sẵn (ví dụ: images/abc.jpg) -> Trả về nguyên vẹn
    return url;
  }

  getPublicUrl(filePath: string): string {
    // Định dạng: https://storage.googleapis.com/<BUCKET_NAME>/<FILE_PATH>
    // Lưu ý: Cần encode tên file vì URL không chứa ký tự đặc biệt
    return `https://storage.googleapis.com/${this.bucket.name}/${encodeURIComponent(filePath)}`;
  }
}
