import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPasswordHelper, processAvatar } from '@/helpers/util';
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
import { UserViewDto } from '@/modules/user/dto/user-view.dto';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';
import { UserDetailsDto } from '@/modules/user/dto/user-details.dto';
import { FirebaseService } from '@/modules/firebase/firebase.service';
import { USER_AVATAR_FOLDER } from '@/configs/multer.config';

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
    private readonly firebaseService: FirebaseService,
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
    admin: IAccessTokenPayload,
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
      throw new InternalServerErrorException(
        'Có lỗi xảy ra trong quá trình mã hóa mật khẩu!',
      );
    }

    let imagePath = '';
    if (imageToUpload) {
      imagePath = await this.uploadAvatar(imageToUpload);
    }

    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        image: imagePath || null,
        password: hashedPassword,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        userId: admin.sub,
        type: 'ADD_MEMBER',
        content: JSON.stringify({
          id: newUser.id,
          fullname: newUser.fullname,
        }),
      },
    });

    return {
      ...newUser,
      password: undefined, // Không trả về mật khẩu
    };
  }

  async findAll(): Promise<UserViewDto[]> {
    const users = await this.prismaService.user.findMany({
      include: {
        position: true,
        team: true,
        gen: true,
      },
    });

    return users.map((user) => ({
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
    }));
  }

  async findAllPaginated(
    params: UserFilterType,
  ): Promise<UserPaginatedResponse> {
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
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    return user;
  }

  async findOneDetails(searchString: string, fields: string[]) {
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

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    return user;
  }

  async getUserProfile(id: string): Promise<UserDetailsDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        position: true,
        team: true,
        gen: true,
        _count: {
          select: {
            tasks: true,
            todoLists: true,
            taskAttachment: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      address: user.address || null,
      birthday: user.birthday || null,
      image: user.image || null,

      positionId: user.positionId || null,
      positionName: user.position?.name || null,
      teamId: user.teamId || null,
      teamName: user.team?.name || null,
      genId: user.genId || null,
      genName: user.gen?.name || null,

      role: user.role,
      status: user.status,

      taskCount: user._count.tasks,
      todoListCount: user._count.todoLists,
      taskAttachmentCount: user._count.taskAttachment,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getAllUsersFreeOnDate(startDate: Date, deadline: Date) {
    const users = await this.prismaService.user.findMany({
      where: {
        tasks: {
          none: {
            status: { not: 'DONE' },
            isDeleted: false,
            OR: [
              {
                startDate: { lte: deadline },
                deadline: { gte: startDate },
              },
              {
                startDate: { gte: startDate },
                deadline: { lte: deadline },
              },
            ],
          },
        },
      },
      select: {
        id: true,
      },
    });

    return users;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    admin: IAccessTokenPayload,
    imageToUpload?: Express.Multer.File,
  ) {
    const userToUpdate = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!userToUpdate) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    if (
      updateUserDto.email !== userToUpdate.email &&
      (await this.isEmailExist(updateUserDto.email))
    )
      throw new UnprocessableEntityException([
        { field: 'email', error: 'Đã tồn tại email này!' },
      ]);
    if (
      updateUserDto.phone !== userToUpdate.phone &&
      (await this.isPhoneExist(updateUserDto.phone))
    )
      throw new UnprocessableEntityException([
        { field: 'phone', error: 'Đã tồn tại số điện thoại này!' },
      ]);

    let imagePath = '';
    if (updateUserDto.isImageChanged || imageToUpload) {
      if (userToUpdate.image) {
        await this.firebaseService.deleteImage(userToUpdate.image, true);
      }
      if (imageToUpload) {
        imagePath = await this.uploadAvatar(imageToUpload);
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
        image: imagePath
          ? imagePath
          : updateUserDto.isImageChanged
            ? null
            : undefined,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        userId: admin.sub,
        type: 'EDIT_MEMBER',
        content: JSON.stringify({
          id: userToUpdate.id,
          fullname: userToUpdate.fullname,
        }),
      },
    });

    return {
      ...userUpdate,
      password: undefined, // Không trả về mật khẩu
    };
  }

  async updatePassword(id: string, newPassword: string) {
    await this.findOne(id, ['id']); // Kiểm tra người dùng có tồn tại

    const hashedPassword = await hashPasswordHelper(newPassword);
    if (!hashedPassword) {
      throw new InternalServerErrorException(
        'Có lỗi xảy ra trong quá trình mã hóa mật khẩu!',
      );
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return {
      ...updatedUser,
      password: undefined, // Không trả về mật khẩu
    };
  }

  async resetPassword(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    const hashedPassword = await hashPasswordHelper(
      this.configService.get<string>('DEFAULT_PASSWORD') || '123456',
    );
    if (!hashedPassword) {
      throw new InternalServerErrorException(
        'Có lỗi xảy ra trong quá trình mã hóa mật khẩu!',
      );
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return {
      ...updatedUser,
      password: undefined, // Không trả về mật khẩu
    };
  }

  async lock(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: { status: UserStatus.BANNED },
    });

    return {
      ...updatedUser,
      password: undefined, // Không trả về mật khẩu
    };
  }

  async unlock(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: { status: UserStatus.INACTIVE },
    });

    return {
      ...updatedUser,
      password: undefined, // Không trả về mật khẩu
    };
  }

  async remove(id: string, admin: IAccessTokenPayload) {
    const userToDelete = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!userToDelete) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    const deletedUser = await this.prismaService.user.delete({ where: { id } });
    if (deletedUser.image)
      await this.firebaseService.deleteImage(deletedUser.image, true);

    await this.prismaService.userActions.create({
      data: {
        userId: admin.sub,
        type: 'REMOVE_MEMBER',
        content: JSON.stringify({
          id: deletedUser.id,
          fullname: deletedUser.fullname,
        }),
      },
    });

    return {
      ...deletedUser,
      password: undefined, // Không trả về mật khẩu
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
      throw new InternalServerErrorException(
        'Có lỗi xảy ra trong quá trình mã hóa mật khẩu!',
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
      data: {
        ...newUser,
        password: undefined, // Không trả về mật khẩu
      },
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

    // Xử lý ảnh: resize, nén,...
    const processed = await processAvatar(file.buffer);

    const uploadResult = await this.firebaseService.uploadImage({
      file: {
        ...file,
        buffer: processed,
      },
      folder: USER_AVATAR_FOLDER,
      fileName,
      isPublic: true,
    });

    // Trả về đường dẫn để lưu vào database
    return uploadResult.filePath;
  }

  async uploadAvatarLocal(file: Express.Multer.File, condition?: boolean) {
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

  async deleteAvatarLocal(filename: string) {
    // Đường dẫn tuyệt đối đến file
    const filePath = join(this.avatarsUploadDirectory, filename);

    try {
      // Kiểm tra xem file có tồn tại không
      await fs.stat(filePath);
      // Xóa file
      await fs.unlink(filePath);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Nếu không tồn tại hoặc lỗi khác
      return false;
    }
  }
}
