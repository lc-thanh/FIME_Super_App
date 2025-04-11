import { hashPasswordHelper } from '../src/helpers/util';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const seedUsers = async () => {
  const lc_thanh = await prisma.user.upsert({
    where: { email: 'lcthanh.htvn@gmail.com' },
    update: {},
    create: {
      email: 'lcthanh.htvn@gmail.com',
      fullname: 'LC Thành',
      password: (await hashPasswordHelper('123456')) as string,
      phone: '0987654321',
      role: [Role.MEMBER, Role.ADMIN],
      address: 'Hà Tĩnh',
    },
  });

  const cc_cuong = await prisma.user.upsert({
    where: { email: 'cuong.cc@gmail.com' },
    update: {},
    create: {
      email: 'cuong.cc@gmail.com',
      fullname: 'CC Cường',
      password: (await hashPasswordHelper('123456')) as string,
      phone: '0987654322',
      role: [Role.MEMBER],
      address: 'Hà Tĩnh',
    },
  });

  console.log({ lc_thanh, cc_cuong });
};

const main = async () => {
  await seedUsers();
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
