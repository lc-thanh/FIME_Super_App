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
import { UserFilterType, UserPaginatedResponse } from './dto/user-pagination';
import { SignUpDto } from '@/modules/auth/dto/signUp.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
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

  async create(createUserDto: CreateUserDto, image?: string) {
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

    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        image,
        password: hashedPassword,
      },
    });
    return {
      message: 'Tạo người dùng mới thành công!',
      data: newUser,
    };
  }

  async findAll(params: UserFilterType): Promise<UserPaginatedResponse> {
    const search = params.search || '';
    const pageSize = Number(params.pageSize) || 10;
    const page = Number(params.page) || 1;
    const skip = pageSize * (page - 1);
    const sortBy = params.sortBy || 'status';
    const sortOrder = params.sortOrder || 'asc';
    const validSortByFields = ['fullname', 'email', 'phone', 'createdAt'];

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
        [validSortByFields.includes(sortBy) ? sortBy : 'status']:
          sortOrder === 'asc' ? 'asc' : 'desc',
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
        positionName: user.position?.name || null,
        teamName: user.team?.name || null,
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

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    if (updateUserDto.email && (await this.isEmailExist(updateUserDto.email)))
      throw new BadRequestException('Đã tồn tại email này!');
    if (updateUserDto.phone && (await this.isPhoneExist(updateUserDto.phone)))
      throw new BadRequestException('Đã tồn tại số điện thoại này!');

    const userUpdate = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
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
}
