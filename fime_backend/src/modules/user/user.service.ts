import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPasswordHelper } from '@/helpers/util';
import { PrismaService } from '@/prisma.service';
import { Prisma } from '@prisma/client';
import { UserFilterType, UserPaginatedResponse } from './dto/user-pagination';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async create(createUserDto: CreateUserDto) {
    if (await this.isEmailExist(createUserDto.email)) {
      throw new BadRequestException('Đã tồn tại email này!');
    }
    if (await this.isPhoneExist(createUserDto.phone)) {
      throw new BadRequestException('Đã tồn tại số điện thoại này!');
    }

    const hashedPassword = await hashPasswordHelper(createUserDto.password);
    if (!hashedPassword) {
      throw new HttpException(
        'Có lỗi xảy ra trong quá trình mã hóa mật khẩu!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
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
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';
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
        [validSortByFields.includes(sortBy) ? sortBy : 'createdAt']:
          sortOrder === 'asc' ? 'asc' : 'desc',
      },
    });
    const total = await this.prismaService.user.count({ where });

    return {
      data: users,
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
      hasNextPage: total > page * pageSize,
      hasPreviousPage: page > 1,
    };
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

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
}
