import {
  defaultSortBy,
  defaultSortOrder,
  UserActionFilterType,
  UserActionsPaginatedResponse,
} from '@/modules/statistic/dto/user-actions-pagination';
import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class StatisticService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserActions(
    params: UserActionFilterType,
  ): Promise<UserActionsPaginatedResponse> {
    const search = params.search || '';
    const pageSize = Number(params.pageSize) || 6;
    const page = Number(params.page) || 1;
    // Không dùng skip nữa, lấy từ đầu đến hết trang hiện tại
    const take = pageSize * page;
    const sortBy = defaultSortBy;
    const sortOrder: Prisma.SortOrder = defaultSortOrder;

    const where = {
      OR: [
        { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ],
    };

    const orderBy = { [sortBy]: sortOrder };

    const taskActivities = await this.prismaService.userActions.findMany({
      where,
      take,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            image: true,
          },
        },
      },
    });
    const total = await this.prismaService.userActions.count({ where });

    return {
      data: taskActivities.map((userAction) => ({
        id: userAction.id,
        content: userAction.content,
        type: userAction.type,
        user: {
          id: userAction.user.id,
          fullname: userAction.user.fullname,
          image: userAction.user.image,
        },
        createdAt: userAction.createdAt,
      })),
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
      hasNextPage: total > page * pageSize,
      hasPreviousPage: page > 1,
    };
  }

  async getTaskStatistics() {
    const totalTasks = await this.prismaService.task.count();
    const totalCompletedTasks = await this.prismaService.task.count({
      where: { status: 'DONE' },
    });
    const totalHighPriorityTasks = await this.prismaService.task.count({
      where: { priority: 'HIGH', status: { not: 'DONE' } },
    });
    const totalOverdueTasks = await this.prismaService.task.count({
      where: {
        deadline: {
          lt: new Date(),
        },
        status: {
          not: 'DONE',
        },
      },
    });

    return {
      totalTasks,
      totalCompletedTasks,
      totalHighPriorityTasks,
      totalOverdueTasks,
    };
  }
}
