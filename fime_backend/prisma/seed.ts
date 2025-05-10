import dayjs from 'dayjs';
import { hashPasswordHelper } from '../src/helpers/util';
import {
  PrismaClient,
  Role,
  TaskPriority,
  TaskStatus,
  TaskType,
} from '@prisma/client';

const prisma = new PrismaClient();

const seedUsers = async () => {
  const gen_8 = await prisma.gen.upsert({
    where: { id: '8d3f1a2b-4c5e-4f6b-8c7d-9e5f3b1c2d3e' },
    update: {},
    create: {
      id: '8d3f1a2b-4c5e-4f6b-8c7d-9e5f3b1c2d3e',
      name: 'Gen 8',
    },
  });

  const gen_9 = await prisma.gen.upsert({
    where: { id: '9e5f3b1c-2d3e-4f6b-8c7d-9e5f3b1c2d3e' },
    update: {},
    create: {
      id: '9e5f3b1c-2d3e-4f6b-8c7d-9e5f3b1c2d3e',
      name: 'Gen 9',
    },
  });

  const gen_10 = await prisma.gen.upsert({
    where: { id: '10f3b1c2-d3e-4f6b-8c7d-9e5f3b1c2d3e' },
    update: {},
    create: {
      id: '10f3b1c2-d3e-4f6b-8c7d-9e5f3b1c2d3e',
      name: 'Gen 10',
    },
  });

  const team_ky_thuat = await prisma.team.upsert({
    where: { id: '5b2cd76b-7598-4a09-a4f4-8d4a259150c3' },
    update: {},
    create: {
      id: '5b2cd76b-7598-4a09-a4f4-8d4a259150c3',
      name: 'Ban kỹ thuật',
      description:
        'Quay, chụp tại tất cả các chương trình của khoa, của trường Edit ảnh, video sau mỗi sự kiện. Sản xuất các chuyên mục hàng tháng của Bộ phận.',
    },
  });

  const team_bien_tap = await prisma.team.upsert({
    where: { id: 'b0f2a1c3-4d8e-4c5b-8f7d-6a9e5f3b1c2d' },
    update: {},
    create: {
      id: 'b0f2a1c3-4d8e-4c5b-8f7d-6a9e5f3b1c2d',
      name: 'Ban biên tập',
      description:
        'Phụ trách content truyền thông trên các nền tảng Facebook, Tik Tok. Hoàn thiện kịch bản cho các ấn phẩm truyền thông, video Tik Tok và các chương trình lớn nhỏ. MC cho các chương trình, sự kiện.',
    },
  });

  const team_tcsk = await prisma.team.upsert({
    where: { id: 'd3f2a1c3-4d8e-4c5b-8f7d-6a9e5f3b1c2d' },
    update: {},
    create: {
      id: 'd3f2a1c3-4d8e-4c5b-8f7d-6a9e5f3b1c2d',
      name: 'Ban TCSK',
      description:
        'Lên ý tưởng cho các chương trình, sự kiện trong và ngoài. Bộ phận Tổ chức các chương trình gắn kết các thành viên.',
    },
  });

  const position_ctv = await prisma.position.upsert({
    where: { id: '8073f874-8b1c-4621-9e5c-f5b83a16dc5d' },
    update: {},
    create: {
      id: '8073f874-8b1c-4621-9e5c-f5b83a16dc5d',
      name: 'CTV',
      description: 'Cộng tác viên Bộ phận Truyền thông FIT Media',
    },
  });

  const position_thanh_vien = await prisma.position.upsert({
    where: { id: '8723c7af-444c-4922-8019-741cf03c12a9' },
    update: {},
    create: {
      id: '8723c7af-444c-4922-8019-741cf03c12a9',
      name: 'Thành viên',
      description: 'Thành viên Bộ phận Truyền thông FIT Media',
    },
  });

  const lc_thanh = await prisma.user.upsert({
    where: { email: 'lcthanh.htvn@gmail.com' },
    update: {},
    create: {
      id: 'ca6f15f2-b5bd-4ff2-a640-ffaa4325d4ae',
      email: 'lcthanh.htvn@gmail.com',
      fullname: 'LC Thành',
      password: (await hashPasswordHelper('123456')) as string,
      phone: '0987654321',
      image: 'user-1746865309099-238469757.jpg',
      genId: gen_8.id,
      teamId: team_ky_thuat.id,
      positionId: position_thanh_vien.id,
      role: [Role.MEMBER, Role.ADMIN],
      address: 'Hà Tĩnh',
    },
  });

  const ld_quoc = await prisma.user.upsert({
    where: { email: 'quoc.ld@gmail.com' },
    update: {},
    create: {
      id: 'cf92fda2-2eab-4097-b3e8-c9a661e277f3',
      email: 'quoc.ld@gmail.com',
      fullname: 'LD Quốc',
      password: (await hashPasswordHelper('123456')) as string,
      phone: '0987654323',
      genId: gen_9.id,
      teamId: team_bien_tap.id,
      positionId: position_thanh_vien.id,
      role: [Role.MEMBER, Role.ADMIN],
      address: 'Hà Tĩnh',
    },
  });

  const pd_tan = await prisma.user.upsert({
    where: { email: 'tan.pd@gmail.com' },
    update: {},
    create: {
      id: 'e882771d-ee75-48fe-9385-f3989b583cf3',
      email: 'tan.pd@gmail.com',
      fullname: 'PD Tân',
      password: (await hashPasswordHelper('123456')) as string,
      phone: '0987654322',
      genId: gen_10.id,
      teamId: team_tcsk.id,
      positionId: position_ctv.id,
      role: [Role.MEMBER],
      address: 'Hà Tĩnh',
    },
  });

  console.log({ lc_thanh, ld_quoc, cc_cuong: pd_tan });
};

const seedTasks = async () => {
  const task1_TODO = await prisma.task.create({
    data: {
      title:
        'Chỉnh ảnh lorem ipsum dolor sit amet consectetur adipisicing elit',
      position: 1000,
      type: TaskType.TODO,
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      startDate: dayjs().add(1, 'day').toDate(),
      deadline: dayjs().add(3, 'day').toDate(),
      workspace: {
        create: {
          id: 'b01e48e2-495e-4305-8cc8-0b9fb6820d66',
          name: 'Công việc',
        },
      },
    },
  });

  const task2_TODO = await prisma.task.create({
    data: {
      title: 'FIT News',
      position: 2000,
      type: TaskType.MONTHLY_SEGMENTS,
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      startDate: dayjs().subtract(2, 'day').toDate(),
      deadline: dayjs().add(2, 'day').toDate(),
      workspace: {
        connect: {
          id: task1_TODO.workspaceId,
        },
      },
    },
  });

  const task3_IN_PROGRESS = await prisma.task.create({
    data: {
      title: 'FIT Fun',
      position: 1000,
      type: TaskType.MONTHLY_SEGMENTS,
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      startDate: dayjs().subtract(2, 'day').toDate(),
      deadline: dayjs().add(2, 'day').toDate(),
      workspace: {
        connect: {
          id: task1_TODO.workspaceId,
        },
      },
    },
  });

  const task4_IN_REVIEW = await prisma.task.create({
    data: {
      title: 'Ảnh hội thảo',
      position: 1000,
      type: TaskType.EVENT,
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.HIGH,
      startDate: dayjs().subtract(1, 'day').toDate(),
      deadline: dayjs().add(1, 'day').toDate(),
      workspace: {
        connect: {
          id: task1_TODO.workspaceId,
        },
      },
    },
  });

  await prisma.user.update({
    where: {
      email: 'lcthanh.htvn@gmail.com',
    },
    data: {
      tasks: {
        connect: [
          { id: task1_TODO.id },
          { id: task2_TODO.id },
          { id: task3_IN_PROGRESS.id },
        ],
      },
      workspaces: {
        connect: {
          id: task1_TODO.workspaceId,
        },
      },
    },
  });

  await prisma.user.update({
    where: {
      email: 'tan.pd@gmail.com',
    },
    data: {
      tasks: {
        connect: [
          { id: task1_TODO.id },
          { id: task3_IN_PROGRESS.id },
          { id: task4_IN_REVIEW.id },
        ],
      },
      workspaces: {
        connect: {
          id: task1_TODO.workspaceId,
        },
      },
    },
  });
};

const main = async () => {
  await seedUsers();
  await seedTasks();
  console.log('Seeding completed!');
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
