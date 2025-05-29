import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PrismaService } from '@/prisma.service';
import {
  defaultSortBy,
  defaultSortOrder,
  PositionFilterType,
  PositionPaginatedResponse,
  validSortByFields,
} from '@/modules/position/dto/position-pagination';
import { Prisma } from '@prisma/client';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';

@Injectable()
export class PositionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createPositionDto: CreatePositionDto,
    admin: IAccessTokenPayload,
  ) {
    const newPosition = await this.prismaService.position.create({
      data: {
        name: createPositionDto.name,
        description: createPositionDto.description,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'ADD_POSITION',
        content: JSON.stringify({
          id: newPosition.id,
          name: newPosition.name,
        }),
        userId: admin.sub,
      },
    });

    return newPosition;
  }

  async findAll(
    params: PositionFilterType,
  ): Promise<PositionPaginatedResponse> {
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

    const positions = await this.prismaService.position.findMany({
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
    const total = await this.prismaService.team.count({ where });

    return {
      data: positions.map((position) => ({
        id: position.id,
        name: position.name,
        description: position.description,
        usersCount: position._count.users,
        createdAt: position.createdAt,
        updatedAt: position.updatedAt,
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
    return this.prismaService.position.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findOne(id: string) {
    const position = await this.prismaService.position.findUnique({
      where: { id },
    });
    return position;
  }

  async update(
    id: string,
    updatePositionDto: UpdatePositionDto,
    admin: IAccessTokenPayload,
  ) {
    const positionToUpdate = await this.prismaService.position.findUnique({
      where: { id },
    });
    if (!positionToUpdate) {
      throw new BadRequestException('Chức vụ không tồn tại!');
    }

    const position = await this.prismaService.position.update({
      where: { id },
      data: {
        name: updatePositionDto.name,
        description: updatePositionDto.description || null,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'EDIT_POSITION',
        content: JSON.stringify({
          id: positionToUpdate.id,
          name: positionToUpdate.name,
        }),
        userId: admin.sub,
      },
    });

    return position;
  }

  async remove(id: string, admin: IAccessTokenPayload) {
    const positionToDelete = await this.prismaService.position.findUnique({
      where: { id },
    });
    if (!positionToDelete) {
      throw new BadRequestException('Chức vụ không tồn tại!');
    }

    const position = await this.prismaService.position.delete({
      where: { id },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'REMOVE_POSITION',
        content: JSON.stringify({
          id: position.id,
          name: position.name,
        }),
        userId: admin.sub,
      },
    });

    return position;
  }
}
