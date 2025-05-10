import { Injectable } from '@nestjs/common';
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

@Injectable()
export class GenService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createGenDto: CreateGenDto) {
    const newGen = await this.prismaService.gen.create({
      data: {
        name: createGenDto.name,
        description: createGenDto.description,
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

  async update(id: string, updateGenDto: UpdateGenDto) {
    const gen = await this.prismaService.gen.update({
      where: { id },
      data: {
        name: updateGenDto.name,
        description: updateGenDto.description || null,
      },
    });
    return gen;
  }

  async remove(id: string) {
    const gen = await this.prismaService.gen.delete({
      where: { id },
    });

    return gen;
  }
}
