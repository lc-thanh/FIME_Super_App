import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGenDto } from './dto/create-gen.dto';
import { UpdateGenDto } from './dto/update-gen.dto';
import { PrismaService } from '@/prisma.service';
import {
  defaultSortBy,
  defaultSortOrder,
  GenFilterType,
  GenPaginatedResponse,
  validSortByFields,
} from '@/modules/gen/dto/gen-pagination';
import { Prisma } from '@prisma/client';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';

@Injectable()
export class GenService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createGenDto: CreateGenDto, admin: IAccessTokenPayload) {
    const newGen = await this.prismaService.gen.create({
      data: {
        name: createGenDto.name,
        description: createGenDto.description,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'ADD_GEN',
        content: JSON.stringify({
          id: newGen.id,
          name: newGen.name,
        }),
        userId: admin.sub,
      },
    });

    return newGen;
  }

  async findAll(params: GenFilterType): Promise<GenPaginatedResponse> {
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
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          description: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
      ],
    };

    const orderBy = validSortByFields.includes(sortBy)
      ? sortBy === 'users'
        ? { users: { _count: sortOrder } }
        : { [sortBy]: sortOrder }
      : { [defaultSortBy]: sortOrder };

    const gens = await this.prismaService.gen.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });
    const total = await this.prismaService.gen.count({ where });

    return {
      data: gens.map((gen) => ({
        id: gen.id,
        name: gen.name,
        description: gen.description,
        usersCount: gen._count.users,
        createdAt: gen.createdAt,
        updatedAt: gen.updatedAt,
      })),
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
      hasNextPage: total > page * pageSize,
      hasPreviousPage: page > 1,
    };
  }

  findAllSelectors() {
    return this.prismaService.gen.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findOne(id: string) {
    const gen = await this.prismaService.gen.findUnique({
      where: { id },
    });
    return gen;
  }

  async update(
    id: string,
    updateGenDto: UpdateGenDto,
    admin: IAccessTokenPayload,
  ) {
    const genToUpdate = await this.prismaService.gen.findUnique({
      where: { id },
    });
    if (!genToUpdate) {
      throw new BadRequestException('Gen không tồn tại!');
    }

    const gen = await this.prismaService.gen.update({
      where: { id },
      data: {
        name: updateGenDto.name,
        description: updateGenDto.description || null,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'EDIT_GEN',
        content: JSON.stringify({
          id: genToUpdate.id,
          name: genToUpdate.name,
        }),
        userId: admin.sub,
      },
    });

    return gen;
  }

  async remove(id: string, admin: IAccessTokenPayload) {
    const genToDelete = await this.prismaService.gen.findUnique({
      where: { id },
    });
    if (!genToDelete) {
      throw new BadRequestException('Gen không tồn tại!');
    }

    const gen = await this.prismaService.gen.delete({
      where: { id },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'REMOVE_GEN',
        content: JSON.stringify({
          id: gen.id,
          name: gen.name,
        }),
        userId: admin.sub,
      },
    });

    return gen;
  }
}
