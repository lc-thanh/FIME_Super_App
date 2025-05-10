import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPasswordHelper } from '@/helpers/util';
import { PrismaService } from '@/prisma.service';
import { Prisma, UserStatus } from '@prisma/client';
import {
  defaultSortBy,
  defaultSortOrder,
  UserFilterType,
  UserPaginatedResponse,
  validSortByFields,
} from '@/modules/user/dto/user-pagination';
import { SignUpDto } from '@/modules/auth/dto/signUp.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import { extname, join } from 'path';
import fs from 'fs/promises';

@Injectable()
export class UserService {
  private avatarsUploadDirectory = join(
    process.cwd(),
    'public',
    'users',
    'avatars',
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async isEmailExist(email: string): Promise<boolean> {
    return this.prismaService.user
      .findUnique({ where: { email } })
      .then((user) => !!user);
  }

  async isPhoneExist(phone: string): Promise<boolean> {
    return this.prismaService.user
      .findUnique({ where: { phone } })
      .then((user) => !!user);
  }

  async create(
    createUserDto: CreateUserDto,
    imageToUpload?: Express.Multer.File,
  ) {
    if (await this.isEmailExist(createUserDto.email)) {
      throw new UnprocessableEntityException([
        { field: 'email', error: 'Đã tồn tại email này!' },
      ]);
    }
    if (await this.isPhoneExist(createUserDto.phone)) {
      throw new UnprocessableEntityException([
        { field: 'phone', error: 'Đã tồn tại số điện thoại này!' },
      ]);
    }

    const hashedPassword = await hashPasswordHelper(
      this.configService.get<string>('DEFAULT_PASSWORD') || '123456',
    );
    if (!hashedPassword) {
      throw new HttpException(
        'Có lỗi xảy ra trong quá trình mã hóa mật khẩu!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let imageName = '';
    if (imageToUpload) {
      imageName = await this.uploadAvatar(imageToUpload);
      if (!imageName) {
        throw new InternalServerErrorException(
          'Có lỗi xảy ra trong quá trình tải lên ảnh đại diện!',
        );
      }
    }

    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        image: imageName || null,
        password: hashedPassword,
      },
    });

    return newUser;
  }

  async findAll(params: UserFilterType): Promise<UserPaginatedResponse> {
    const search = params.search || '';
    const pageSize = Number(params.pageSize) || 10;
    const page = Number(params.page) || 1;
    const skip = pageSize * (page - 1);
    const sortBy = params.sortBy || defaultSortBy;
    const sortOrder: Prisma.SortOrder =
      params.sortOrder === 'asc' || params.sortOrder === 'desc'
        ? params.sortOrder
        : defaultSortOrder;

    const where = {
      OR: [
        { fullname: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ],
    };

    const users = await this.prismaService.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        [validSortByFields.includes(sortBy) ? sortBy : defaultSortBy]:
          sortOrder,
      },
      include: {
        position: true,
        team: true,
        gen: true,
      },
    });
    const total = await this.prismaService.user.count({ where });

    return {
      data: users.map((user) => ({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        image: user.image,
        positionId: user.positionId,
        positionName: user.position?.name || null,
        teamId: user.teamId,
        teamName: user.team?.name || null,
        genId: user.genId,
        genName: user.gen?.name || null,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
      hasNextPage: total > page * pageSize,
      hasPreviousPage: page > 1,
    };
  }

  async findOne(searchString: string, fields: string[]) {
    const validFields = ['id', 'email', 'phone'];
    fields.forEach((f) => {
      if (!validFields.includes(f)) {
        throw new InternalServerErrorException('Trường tìm kiếm không hợp lệ!');
      }
    });

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: fields.map((f) => ({ [f]: searchString })),
      },
      include: {
        position: true,
        team: true,
        gen: true,
      },
    });

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    imageToUpload?: Express.Multer.File,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    if (
      updateUserDto.email !== user.email &&
      (await this.isEmailExist(updateUserDto.email))
    )
      throw new UnprocessableEntityException([
        { field: 'email', error: 'Đã tồn tại email này!' },
      ]);
    if (
      updateUserDto.phone !== user.phone &&
      (await this.isPhoneExist(updateUserDto.phone))
    )
      throw new UnprocessableEntityException([
        { field: 'email', error: 'Đã tồn tại số điện thoại này!' },
      ]);

    let imageName = '';
    if (updateUserDto.isImageChanged || imageToUpload) {
      if (user.image) {
        await this.deleteAvatar(user.image);
      }
      if (imageToUpload) {
        imageName = await this.uploadAvatar(imageToUpload);
        if (!imageName) {
          throw new InternalServerErrorException(
            'Có lỗi xảy ra trong quá trình tải lên ảnh đại diện!',
          );
        }
      }
    }

    const userUpdate = await this.prismaService.user.update({
      where: { id },
      data: {
        fullname: updateUserDto.fullname,
        email: updateUserDto.email,
        phone: updateUserDto.phone,
        address: updateUserDto.address || null,
        positionId: updateUserDto.positionId || null,
        teamId: updateUserDto.teamId || null,
        genId: updateUserDto.genId || null,
        role: updateUserDto.role,
        image: imageName
          ? imageName
          : updateUserDto.isImageChanged
            ? null
            : undefined,
      },
    });
    return {
      message: 'Cập nhật người dùng thành công!',
      data: userUpdate,
    };
  }

  async remove(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    const deletedUser = await this.prismaService.user.delete({ where: { id } });
    if (user.image) await this.deleteAvatar(user.image);

    return {
      message: 'Xóa người dùng thành công!',
      data: deletedUser,
    };
  }

  async handleRegister(signUpDto: SignUpDto) {
    if (await this.isEmailExist(signUpDto.email)) {
      throw new BadRequestException('Đã tồn tại email này!');
    }
    if (await this.isPhoneExist(signUpDto.phone)) {
      throw new BadRequestException('Đã tồn tại số điện thoại này!');
    }

    const hashedPassword = await hashPasswordHelper(signUpDto.password);
    if (!hashedPassword) {
      throw new HttpException(
        'Có lỗi xảy ra trong quá trình mã hóa mật khẩu!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const newUser = await this.prismaService.user.create({
      data: {
        ...signUpDto,
        password: hashedPassword,
        status: UserStatus.BANNED,
        codeId: uuidv4(),
        codeExpiredAt: dayjs().add(30, 'minute').toDate(),
      },
    });
    return {
      message: 'Đăng ký thành công!',
      data: newUser,
    };
  }

  async uploadAvatar(file: Express.Multer.File, condition?: boolean) {
    if (condition === false) {
      throw new BadRequestException('Không đủ điều kiện để upload file!');
    }

    if (!file) {
      throw new BadRequestException('Không tìm thấy file để upload!');
    }

    // Tạo tên file ngẫu nhiên
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExt = extname(file.originalname);
    const fileName = `user-${uniqueSuffix}${fileExt}`;

    // Đường dẫn lưu file
    const filePath = join(this.avatarsUploadDirectory, fileName);

    // Tạo thư mục nếu chưa tồn tại
    await fs.mkdir(this.avatarsUploadDirectory, { recursive: true });

    // Lưu file vào thư mục
    await fs.writeFile(filePath, file.buffer);

    // Trả về đường dẫn để truy cập
    return fileName;
  }

  async deleteAvatar(filename: string) {
    // Đường dẫn tuyệt đối đến file
    const filePath = join(this.avatarsUploadDirectory, filename);

    try {
      // Kiểm tra xem file có tồn tại không
      await fs.stat(filePath);
      // Xóa file
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      // Nếu không tồn tại hoặc lỗi khác
      return false;
    }
  }
}
