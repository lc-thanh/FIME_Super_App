import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '@/prisma.service';
import { TaskColumnDto } from '@/modules/task/dto/task-card.dto';
import { MoveCardDto } from '@/modules/task/dto/move-card.dto';
import { Task, TaskStatus } from '@prisma/client';
import { TaskBoardGateway } from '@/gateways/task-board/task-board.gateway';

const INVALID_POSITION_MESSAGE = 'Vị trí không hợp lệ!';

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly taskBoardGateway: TaskBoardGateway,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  async getTaskCards(userId: string, workspaceId: string) {
    const workspace = await this.prismaService.workspace.findFirst({
      where: {
        id: workspaceId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (!workspace)
      throw new BadRequestException(
        'Workspace không tồn tại hoặc bạn không có quyền truy cập!',
      );

    const tasks = await this.prismaService.task.findMany({
      where: {
        workspaceId,
      },
      include: {
        users: {
          include: {
            position: {
              select: { name: true },
            },
            team: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    // Khởi tạo cấu trúc các cột
    const columns = [
      { id: 'TODO', title: 'Việc cần làm', cards: [] },
      { id: 'IN_PROGRESS', title: 'Đang thực hiện', cards: [] },
      { id: 'IN_REVIEW', title: 'Chờ đánh giá', cards: [] },
      { id: 'DONE', title: 'Hoàn thành', cards: [] },
    ] as TaskColumnDto[];

    // Phân loại các task vào cột tương ứng
    tasks.forEach((task) => {
      const card = {
        id: task.id,
        title: task.title,
        position: task.position,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        type: task.type,
        users: task.users.map((user) => ({
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          image: user.image,
          positionName: user.position?.name,
          teamName: user.team?.name,
        })),
      };

      const column = columns.find((col) => col.id === task.status);
      if (column) {
        column.cards.push(card);
      }
    });

    return columns;
  }

  async calcTaskNewPosition({
    taskBefore,
    taskAfter,
    column,
    workspaceId,
  }: {
    taskBefore: Task | null;
    taskAfter: Task | null;
    column: TaskStatus;
    workspaceId: string;
  }): Promise<{ newPosition: number; shouldReIndex: boolean }> {
    if (!taskBefore && !taskAfter) {
      // Trường hợp 1: Cột trống
      // Phải kiểm tra nếu cột vẫn chứa task thì throw lỗi
      const check = await this.prismaService.task.findFirst({
        where: {
          status: column,
          workspaceId,
        },
      });
      if (check) {
        throw new BadRequestException(INVALID_POSITION_MESSAGE);
      }
      return { newPosition: 1000, shouldReIndex: false };
    } else if (taskBefore && !taskAfter) {
      // Trường hợp 2: Di chuyển task xuống cuối cột (không có taskAfter)
      // Nếu còn task nào nằm sau taskBefore thì throw lỗi
      const check = await this.prismaService.task.findFirst({
        where: {
          status: column,
          workspaceId,
          position: {
            gt: taskBefore.position,
          },
        },
      });
      if (check) {
        throw new BadRequestException(INVALID_POSITION_MESSAGE);
      }
      return {
        newPosition: Math.round(taskBefore.position + 1000),
        shouldReIndex: false,
      };
    } else if (!taskBefore && taskAfter) {
      // Trường hợp 3: Di chuyển task lên đầu cột (không có taskBefore)
      // Nếu còn task nào nằm trước taskAfter thì throw lỗi
      const check = await this.prismaService.task.findFirst({
        where: {
          status: column,
          workspaceId,
          position: {
            lt: taskAfter.position,
          },
        },
      });
      if (check) {
        throw new BadRequestException(INVALID_POSITION_MESSAGE);
      }
      return {
        newPosition: taskAfter.position / 2,
        shouldReIndex: taskAfter.position < 0.0001,
      };
    } else if (taskBefore && taskAfter) {
      // Trường hợp 4: Di chuyển task vào giữa 2 task khác
      // Nếu taskBefore.position >= taskAfter.position thì throw lỗi
      // Nếu còn task nào nằm giữa taskBefore và taskAfter thì throw lỗi
      if (taskBefore.position >= taskAfter.position) {
        throw new BadRequestException(INVALID_POSITION_MESSAGE);
      }
      const check = await this.prismaService.task.findFirst({
        where: {
          status: column,
          workspaceId,
          position: {
            gt: taskBefore.position,
            lt: taskAfter.position,
          },
        },
      });
      if (check) {
        throw new BadRequestException(INVALID_POSITION_MESSAGE);
      }
      return {
        newPosition: (taskBefore.position + taskAfter.position) / 2,
        shouldReIndex: taskAfter.position - taskBefore.position < 0.0001,
      };
    }

    return {
      newPosition: 1,
      shouldReIndex: true,
    };
  }

  async reIndexTaskCardsByColumn(columnId: TaskStatus) {
    const tasks = await this.prismaService.task.findMany({
      where: { status: columnId },
      orderBy: { position: 'asc' },
    });

    await this.prismaService.$transaction(
      tasks.map((task, index) =>
        this.prismaService.task.update({
          where: { id: task.id },
          data: { position: (index + 1) * 1000 },
        }),
      ),
    );
  }

  async moveCard(data: MoveCardDto) {
    const { workspaceId, cardId, cardBeforeId, cardAfterId, column } = data;

    // Kiểm tra trùng Id
    if (cardBeforeId === cardId || cardAfterId === cardId) {
      throw new BadRequestException(INVALID_POSITION_MESSAGE);
    }
    if (cardBeforeId && cardAfterId && cardBeforeId === cardAfterId) {
      throw new BadRequestException(INVALID_POSITION_MESSAGE);
    }

    await this.findOne(cardId, ['id'], workspaceId);
    const taskBefore = cardBeforeId
      ? await this.findOne(cardBeforeId, ['id'], workspaceId, column)
      : null;
    const taskAfter = cardAfterId
      ? await this.findOne(cardAfterId, ['id'], workspaceId, column)
      : null;

    const { newPosition, shouldReIndex } = await this.calcTaskNewPosition({
      taskBefore,
      taskAfter,
      column,
      workspaceId,
    });

    // Cập nhật vị trí của task
    await this.prismaService.task.update({
      where: {
        id: cardId,
      },
      data: {
        position: newPosition,
        status: column,
      },
    });

    if (shouldReIndex) {
      await this.reIndexTaskCardsByColumn(column);
    }

    // Gửi thông báo đến các user khác trong cùng workspace
    // để tự động cập nhật lại task board bằng socket.io
    this.taskBoardGateway.server
      .to(`workspace-${workspaceId}`)
      // .except(data.socketId || '')
      .emit('board-updated');

    return {
      message: 'Di chuyển task thành công!',
    };
  }

  findAll() {
    return `This action returns all task`;
  }

  async findOne(
    searchString: string,
    fields: string[],
    workspaceId?: string,
    status?: TaskStatus,
  ) {
    const validFields = ['id'];
    fields.forEach((f) => {
      if (!validFields.includes(f)) {
        throw new InternalServerErrorException('Trường tìm kiếm không hợp lệ!');
      }
    });

    const task = await this.prismaService.task.findFirst({
      where: {
        OR: fields.map((f) => ({ [f]: searchString })),
        workspaceId,
        status,
      },
    });

    if (!task) {
      throw new BadRequestException('Task không tồn tại!');
    }

    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
