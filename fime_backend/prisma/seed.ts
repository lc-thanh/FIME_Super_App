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
    where: { id: '20354d7a-e4fe-47af-8ff6-187bca92f3f9' },
    update: {},
    create: {
      id: '20354d7a-e4fe-47af-8ff6-187bca92f3f9',
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
      birthday: new Date('2003-02-02'),
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
      title: 'Chỉnh ảnh Đại hội',
      position: 1000,
      type: TaskType.TODO,
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      startDate: dayjs().set('hour', 0).set('minute', 0).toDate(),
      deadline: dayjs().set('hour', 23).set('minute', 59).toDate(),
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
      startDate: dayjs()
        .subtract(7, 'day')
        .set('hour', 0)
        .set('minute', 0)
        .toDate(),
      deadline: dayjs()
        .subtract(1, 'day')
        .set('hour', 23)
        .set('minute', 59)
        .toDate(),
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
      startDate: dayjs()
        .subtract(2, 'day')
        .set('hour', 0)
        .set('minute', 0)
        .toDate(),
      deadline: dayjs()
        .add(2, 'day')
        .set('hour', 23)
        .set('minute', 59)
        .toDate(),
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
      startDate: dayjs()
        .subtract(1, 'day')
        .set('hour', 0)
        .set('minute', 0)
        .toDate(),
      deadline: dayjs()
        .add(1, 'day')
        .set('hour', 23)
        .set('minute', 59)
        .toDate(),
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

const seedLandingPage = async () => {
  await prisma.latestPublication.upsert({
    where: { id: 'cdada2b7-86de-42cf-bc9d-d8c282fc9f91' },
    update: {},
    create: {
      id: 'cdada2b7-86de-42cf-bc9d-d8c282fc9f91',
      title: 'IT FESTIVAL 2025',
      embed_code: `<iframe
              src="https://www.facebook.com/plugins/video.php?height=314&href=https://www.facebook.com/fitmediahaui/videos/1224055816008338%2F&show_text=false&width=560&t=0"
              style={{
                border: "none",
                overflow: "hidden",
                width: "100%",
                height: "auto",
                aspectRatio: "16/9",
              }}
              scrolling="no"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen={true}
            ></iframe>`,
    },
  });

  await prisma.latestPublication.upsert({
    where: { id: '851b0739-bb3e-4967-8ab8-b7422f27b6aa' },
    update: {},
    create: {
      id: '851b0739-bb3e-4967-8ab8-b7422f27b6aa',
      title:
        'ĐẠI HỘI ĐẠI BIỂU LIÊN CHI HỘI SINH VIÊN VIỆT NAM TRƯỜNG CNTT & TT LẦN THỨ I, NHIỆM KỲ 2025 - 2028',
      embed_code: `<iframe
              src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Ffitmediahaui%2Fvideos%2F1220048349718752%2F&show_text=false&width=560&t=0"
              style={{
                border: "none",
                overflow: "hidden",
                width: "100%",
                height: "auto",
                aspectRatio: "16/9",
              }}
              scrolling="no"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen={true}
            ></iframe>`,
    },
  });

  await prisma.newestProducts.upsert({
    where: { id: '00bc1450-f7e9-47dc-9140-f6c341e0408d' },
    update: {},
    create: {
      id: '00bc1450-f7e9-47dc-9140-f6c341e0408d',
      title: '8.5 Đại hội đại Biểu LCH khóa I',
      note: 'Vào ngày 08/05/2025, tại hội trường tầng 2 – nhà A3, Đại hội Đại biểu Liên chi Hội Sinh viên Trường Công nghệ Thông tin và Truyền thông lần thứ I, nhiệm kỳ 2025 – 2028 đã được long trọng tổ chức trong không khí trang nghiêm và đầy tinh thần trách nhiệm',
      date: new Date('2025-05-08'),
      image: 'newest-product-1747191174208-871050879.jpg',
      link: 'https://drive.google.com/drive/folders/1KLOq1x29iE9KWSTAiEqg_UK0lIDA14LQ?usp=drive_link',
    },
  });

  await prisma.newestProducts.upsert({
    where: { id: 'f3b0c1a2-4c5e-4f6b-8c7d-9e5f3b1c2d3e' },
    update: {},
    create: {
      id: 'f3b0c1a2-4c5e-4f6b-8c7d-9e5f3b1c2d3e',
      title: 'Gala IT Festival 2025',
      note: 'Đêm Gala là sân khấu của vòng chung kết SICT’s Got Talent với những tiết mục đặc sắc, bùng nổ, sáng tạo và đầy ý nghĩa từ các thí sinh tài năng. Bên cạnh đó, lễ trao giải cho các cuộc thi trước đó đã vinh danh những nỗ lực xuất sắc, khép lại hành trình IT Festival 2025 bằng một dấu son trọn vẹn.',
      date: new Date('2025-04-05'),
      image: 'newest-product-1747190741150-980401952.jpg',
      link: 'https://drive.google.com/drive/folders/1cPPOrxvdN-SGktaho0utV2ZTD6-ig2Qp?usp=drive_link',
    },
  });
};

const main = async () => {
  await seedUsers();
  await seedTasks();
  await seedLandingPage();
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
