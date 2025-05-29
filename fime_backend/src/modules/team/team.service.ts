import { BadRequestException, Injectable } from '@nestjs/common';
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
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';

@Injectable()
export class TeamService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTeamDto: CreateTeamDto, admin: IAccessTokenPayload) {
    const newTeam = await this.prismaService.team.create({
      data: {
        name: createTeamDto.name,
        description: createTeamDto.description,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'ADD_TEAM',
        content: JSON.stringify({
          id: newTeam.id,
          name: newTeam.name,
        }),
        userId: admin.sub,
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

  async update(
    id: string,
    updateTeamDto: UpdateTeamDto,
    admin: IAccessTokenPayload,
  ) {
    const teamToUpdate = await this.prismaService.team.findUnique({
      where: { id },
    });
    if (!teamToUpdate) {
      throw new BadRequestException('Ban không tồn tại!');
    }

    const team = await this.prismaService.team.update({
      where: { id },
      data: {
        name: updateTeamDto.name,
        description: updateTeamDto.description || null,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'EDIT_TEAM',
        content: JSON.stringify({
          id: teamToUpdate.id,
          name: teamToUpdate.name,
        }),
        userId: admin.sub,
      },
    });

    return team;
  }

  async remove(id: string, admin: IAccessTokenPayload) {
    const teamToDelete = await this.prismaService.team.findUnique({
      where: { id },
    });
    if (!teamToDelete) {
      throw new BadRequestException('Ban không tồn tại!');
    }

    const team = await this.prismaService.team.delete({
      where: { id },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'REMOVE_TEAM',
        content: JSON.stringify({
          id: team.id,
          name: team.name,
        }),
        userId: admin.sub,
      },
    });

    return team;
  }
}
