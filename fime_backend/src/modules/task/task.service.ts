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
import {
  Prisma,
  Task,
  TaskActivityType,
  TaskPriority,
  TaskStatus,
  TaskType,
  User,
} from '@prisma/client';
import { TaskBoardGateway } from '@/gateways/task-board/task-board.gateway';
import { TodoListDto } from '@/modules/task/dto/todo-list.dto';
import { JsonObject } from '@prisma/client/runtime/library';
import { UserViewDto } from '@/modules/user/dto/user-view.dto';
import { UserService } from '@/modules/user/user.service';
import {
  defaultSortBy,
  defaultSortOrder,
  TaskActivitiesPaginatedResponse,
  TaskActivityFilterType,
} from '@/modules/task/dto/task-activities-pagination';
import dayjs from 'dayjs';

const INVALID_POSITION_MESSAGE = 'Vị trí không hợp lệ!';

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly taskBoardGateway: TaskBoardGateway,
    private readonly userService: UserService,
  ) {}

  async create(workspaceId: string, userId: string) {
    const workspace = await this.prismaService.workspace.findFirst({
      where: {
        id: workspaceId,
      },
    });
    if (!workspace)
      throw new BadRequestException(
        'Workspace không tồn tại hoặc bạn không có quyền truy cập!',
      );

    const lastTaskOfTodoColumn = await this.prismaService.task.findFirst({
      where: {
        status: TaskStatus.TODO,
        workspaceId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newTask = await this.prismaService.task.create({
      data: {
        title: 'Công việc mới',
        position: (lastTaskOfTodoColumn?.position ?? 0) + 1000,
        workspaceId,
      },
    });

    await this.prismaService.taskActivity.create({
      data: {
        type: TaskActivityType.CREATE_CARD,
        content: '',
        userId,
        taskId: newTask.id,
      },
    });

    return newTask;
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

  async getAllSelectableAssignees(
    taskId: string,
  ): Promise<(UserViewDto & { isRecommended: boolean })[]> {
    const task = await this.findOne(taskId, ['id'], undefined, undefined);

    const allUsers = await this.prismaService.user.findMany({
      where: {
        status: {
          not: 'BANNED',
        },
        NOT: {
          role: {
            has: 'FORMER_MEMBER', // Lọc các user không phải cựu thành viên
          },
        },
      },
      include: {
        position: true,
        team: true,
        gen: true,
      },
    });

    let allUsersFreeOnDate: Pick<User, 'id'>[] = [];
    if (task.startDate && task.deadline) {
      allUsersFreeOnDate = await this.userService.getAllUsersFreeOnDate(
        task.startDate,
        task.deadline,
      );
    }

    return allUsers.map((user) => ({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      address: user.address,
      image: user.image,
      positionId: user.positionId,
      positionName: user.position?.name || null,
      teamId: user.teamId,
      teamName: user.team?.name || null,
      genId: user.genId,
      genName: user.gen?.name || null,
      role: user.role,
      status: user.status,
      isRecommended: allUsersFreeOnDate.some((u) => u.id === user.id),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
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

  async moveCard(data: MoveCardDto, userId: string) {
    const { workspaceId, cardId, cardBeforeId, cardAfterId, column } = data;

    // Kiểm tra trùng Id
    if (cardBeforeId === cardId || cardAfterId === cardId) {
      throw new BadRequestException(INVALID_POSITION_MESSAGE);
    }
    if (cardBeforeId && cardAfterId && cardBeforeId === cardAfterId) {
      throw new BadRequestException(INVALID_POSITION_MESSAGE);
    }

    const prev_task = await this.findOne(cardId, ['id'], workspaceId);
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

    // Thêm TaskActivity nếu có thay đổi trạng thái
    if (prev_task.status !== column) {
      await this.prismaService.taskActivity.create({
        data: {
          type: TaskActivityType.MOVE_CARD,
          content: column,
          userId,
          taskId: cardId,
        },
      });
    }

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

  async changeTitle(taskId: string, title: string, userId: string) {
    await this.findOne(taskId, ['id']); // Kiểm tra task có tồn tại không
    const updatedTask = await this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
      },
    });

    await this.prismaService.taskActivity.create({
      data: {
        type: TaskActivityType.CHANGE_TITLE,
        content: title,
        userId,
        taskId,
      },
    });
    return updatedTask;
  }

  async addAssignee(taskId: string, assigneeId: string, userId: string) {
    const task = await this.findOne(taskId, ['id']); // Kiểm tra task có tồn tại không

    const assignee = await this.prismaService.user.findFirst({
      where: {
        id: assigneeId,
      },
    });
    if (!assignee) {
      throw new BadRequestException('Người dùng không tồn tại!');
    }

    const updatedTask = await this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: {
        users: {
          connect: { id: assigneeId },
        },
      },
    });

    await this.prismaService.workspace.update({
      where: {
        id: task.workspaceId,
      },
      data: {
        users: {
          connect: { id: assigneeId },
        },
      },
    });

    await this.prismaService.taskActivity.create({
      data: {
        type: TaskActivityType.ADD_ASSIGNEE,
        content: assigneeId + '@' + assignee.fullname,
        userId,
        taskId,
      },
    });

    return updatedTask;
  }

  async removeAssignee(taskId: string, assigneeId: string, userId: string) {
    await this.findOne(taskId, ['id']); // Kiểm tra task có tồn tại không
    const assignee = await this.prismaService.user.findFirst({
      where: {
        id: assigneeId,
      },
    });
    if (!assignee) {
      throw new BadRequestException('Người dùng không tồn tại!');
    }
    const updatedTask = await this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: {
        users: {
          disconnect: { id: assigneeId },
        },
      },
    });

    await this.prismaService.taskActivity.create({
      data: {
        type: TaskActivityType.REMOVE_ASSIGNEE,
        content: assigneeId + '@' + assignee.fullname,
        userId,
        taskId,
      },
    });

    return updatedTask;
  }

  async changePriority(taskId: string, priority: TaskPriority, userId: string) {
    await this.findOne(taskId, ['id']); // Kiểm tra task có tồn tại không
    const updatedTask = await this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: {
        priority,
      },
    });
    await this.prismaService.taskActivity.create({
      data: {
        type: TaskActivityType.CHANGE_PRIORITY,
        content: priority,
        userId,
        taskId,
      },
    });
    return updatedTask;
  }

  async changeType(taskId: string, type: TaskType, userId: string) {
    await this.findOne(taskId, ['id']); // Kiểm tra task có tồn tại không
    const updatedTask = await this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: {
        type,
      },
    });

    await this.prismaService.taskActivity.create({
      data: {
        type: TaskActivityType.CHANGE_TYPE,
        content: type,
        userId,
        taskId,
      },
    });
    return updatedTask;
  }

  async changeDate(
    taskId: string,
    startDate: Date | null,
    deadline: Date | null,
    userId: string,
  ) {
    await this.findOne(taskId, ['id']); // Kiểm tra task có tồn tại không
    const updatedTask = await this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: {
        startDate,
        deadline,
      },
    });

    await this.prismaService.taskActivity.create({
      data: {
        type: TaskActivityType.CHANGE_DATE,
        content: `${dayjs(startDate).format('DD/MM/YYYY')} - ${dayjs(deadline).format('DD/MM/YYYY')}`,
        userId,
        taskId,
      },
    });
    return updatedTask;
  }

  async syncTodos(taskId: string, newTodos: TodoListDto[], userId: string) {
    // Lấy danh sách TodoIds hiện tại của Task
    const existingIds = new Set(
      (
        await this.prismaService.todoList.findMany({
          where: { taskId },
          select: { id: true },
        })
      ).map((todo) => todo.id),
    );

    // Lấy danh sách ID từ `newTodos`
    const newIds = newTodos.map((todo) => todo.id).filter((id) => !!id);

    // Danh sách cần xóa (có trong DB nhưng không có trong newTodos)
    const toDelete = [...existingIds].filter((id) => !newIds.includes(id));

    // Thực hiện transaction:
    await this.prismaService.$transaction([
      // Upsert từng Todo
      ...newTodos.map((todo) =>
        this.prismaService.todoList.upsert({
          where: { id: todo.id ?? '' },
          update: {
            content: todo.content,
            isDone: todo.isDone,
            order: todo.order,
            startDate: todo.startDate,
            deadline: todo.deadline,
            User: {
              set: todo.userIds.map((userId) => ({ id: userId })),
            },
          },
          create: {
            id: todo.id ?? undefined, // Prisma sẽ tự tạo ID nếu không có
            content: todo.content,
            isDone: todo.isDone,
            order: todo.order,
            startDate: todo.startDate,
            deadline: todo.deadline,
            taskId: taskId,
            User: {
              connect: todo.userIds.map((userId) => ({ id: userId })),
            },
          },
        }),
      ),
      // Xóa những Todo không còn tồn tại
      this.prismaService.todoList.deleteMany({
        where: {
          id: {
            in: toDelete,
          },
        },
      }),
    ]);

    await this.prismaService.taskActivity.create({
      data: {
        type: TaskActivityType.SYNC_TODO,
        content: '',
        userId,
        taskId,
      },
    });

    return {
      message: 'Cập nhật danh sách todo thành công!',
    };
  }

  async syncNote(taskId: string, note: JsonObject, userId: string) {
    await this.findOne(taskId, ['id']); // Kiểm tra task có tồn tại không
    const updatedTask = await this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: {
        note,
      },
    });

    await this.prismaService.taskActivity.create({
      data: {
        type: TaskActivityType.SYNC_NOTE,
        content: '',
        userId,
        taskId,
      },
    });
    return updatedTask;
  }

  async softDeleteTask(taskId: string, userId: string) {
    await this.findOne(taskId, ['id']); // Kiểm tra task có tồn tại không
    const updatedTask = await this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: {
        isDeleted: true,
      },
    });

    await this.prismaService.taskActivity.create({
      data: {
        type: TaskActivityType.DELETE_CARD,
        content: '',
        userId,
        taskId,
      },
    });
    return updatedTask;
  }

  async getSchedule(userId: string) {
    const tasks = await this.prismaService.task.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
        status: {
          not: TaskStatus.DONE,
        },
        startDate: {
          not: null,
        },
        deadline: {
          not: null,
        },
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        deadline: true,
        status: true,
        type: true,
        priority: true,
        workspaceId: true,
        users: {
          select: {
            id: true,
            fullname: true,
          },
        },
        todoLists: {
          select: {
            isDone: true,
          },
        },
      },
    });

    const todos = await this.prismaService.todoList.findMany({
      where: {
        User: {
          some: {
            id: userId,
          },
        },
        isDone: false,
        startDate: {
          not: null,
        },
        deadline: {
          not: null,
        },
      },
      select: {
        id: true,
        content: true,
        startDate: true,
        deadline: true,
        User: {
          select: {
            id: true,
            fullname: true,
          },
        },
        Task: {
          select: {
            id: true,
            title: true,
            status: true,
            type: true,
            priority: true,
            workspaceId: true,
          },
        },
      },
    });

    const todoTaskIds = new Set(todos.map((todo) => todo.Task.id));
    const filteredTasks = tasks.filter((task) => !todoTaskIds.has(task.id));

    return [
      ...filteredTasks,
      ...todos.map((todo) => ({
        id: todo.id,
        taskId: todo.Task.id,
        workspaceId: todo.Task.workspaceId,
        title: `${todo.content} (${todo.Task.title})`,
        startDate: todo.startDate,
        deadline: todo.deadline,
        status: todo.Task.status,
        type: todo.Task.type,
        priority: todo.Task.priority,
        users: todo.User.map((user) => ({
          id: user.id,
          fullname: user.fullname,
        })),
      })),
    ];
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

  async findOneWithDetails(id: string, fields: string[], workspaceId?: string) {
    const validFields = ['id'];
    fields.forEach((f) => {
      if (!validFields.includes(f)) {
        throw new InternalServerErrorException('Trường tìm kiếm không hợp lệ!');
      }
    });

    const task = await this.prismaService.task.findFirst({
      where: {
        OR: fields.map((f) => ({ [f]: id })),
        workspaceId,
      },
      include: {
        users: {
          select: {
            id: true,
            fullname: true,
            email: true,
            image: true,
            position: {
              select: {
                id: true,
                name: true,
              },
            },
            team: {
              select: {
                id: true,
                name: true,
              },
            },
            gen: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        todoLists: {
          include: {
            User: {
              select: {
                id: true,
                fullname: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        // monthlySegment: true,
        taskActivities: true,
        taskComments: true,
        taskAttachments: true,
        workspace: true,
      },
    });

    if (!task) {
      throw new BadRequestException('Task không tồn tại!');
    }

    return {
      ...task,
      todoLists: task.todoLists.map((todo) => ({
        ...todo,
        User: undefined,
        users: todo.User.map((user) => user),
      })),
    };
  }

  async getTaskActivities(
    params: TaskActivityFilterType,
    taskId: string,
  ): Promise<TaskActivitiesPaginatedResponse> {
    await this.findOne(taskId, ['id']); // Kiểm tra task có tồn tại không

    const search = params.search || '';
    const pageSize = Number(params.pageSize) || 6;
    const page = Number(params.page) || 1;
    // Không dùng skip nữa, lấy từ đầu đến hết trang hiện tại
    const take = pageSize * page;
    const sortBy = defaultSortBy;
    const sortOrder: Prisma.SortOrder = defaultSortOrder;

    const where = {
      taskId,
      OR: [
        { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ],
    };

    const orderBy = { [sortBy]: sortOrder };

    const taskActivities = await this.prismaService.taskActivity.findMany({
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
    const total = await this.prismaService.taskActivity.count({ where });

    return {
      data: taskActivities.map((activity) => ({
        id: activity.id,
        content: activity.content,
        type: activity.type,
        user: {
          id: activity.user.id,
          fullname: activity.user.fullname,
          image: activity.user.image,
        },
        createdAt: activity.createdAt,
      })),
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
      hasNextPage: total > page * pageSize,
      hasPreviousPage: page > 1,
    };
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
