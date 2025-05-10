import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from '@/prisma.service';
import {
  defaultSortBy,
  defaultSortOrder,
  TeamFilterType,
  TeamPaginatedResponse,
  validSortByFields,
} from '@/modules/team/dto/team-pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTeamDto: CreateTeamDto) {
    const newTeam = await this.prismaService.team.create({
      data: {
        name: createTeamDto.name,
        description: createTeamDto.description,
      },
    });

    return newTeam;
  }

  async findAll(params: TeamFilterType): Promise<TeamPaginatedResponse> {
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

    const teams = await this.prismaService.team.findMany({
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
      data: teams.map((team) => ({
        id: team.id,
        name: team.name,
        description: team.description,
        usersCount: team._count.users,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
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
    return this.prismaService.team.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findOne(id: string) {
    const team = this.prismaService.team.findUnique({
      where: { id },
    });
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const team = await this.prismaService.team.update({
      where: { id },
      data: {
        name: updateTeamDto.name,
        description: updateTeamDto.description || null,
      },
    });
    return team;
  }

  async remove(id: string) {
    const team = await this.prismaService.team.delete({
      where: { id },
    });
    return team;
  }
}
