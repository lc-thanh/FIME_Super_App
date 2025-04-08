import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPasswordHelper } from '@/helpers/util';
import { PrismaService } from '@/prisma.service';
import { User, Prisma } from '@prisma/client';
import {
  UserFilterType,
  UserPaginatedResponse,
} from '@/modules/user/dto/user-pagination';

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

  async create(createUserDto: CreateUserDto): Promise<User> {
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
    return newUser;
  }

  async findAll(params: UserFilterType): Promise<UserPaginatedResponse> {
    const search = params.search || '';
    const pageSize = Number(params.pageSize) || 10;
    const page = Number(params.page) || 1;
    const skip = pageSize * (page - 1);

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
      orderBy: { createdAt: 'desc' },
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
