import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const client = new PrismaClient();

    // Extend tự thêm isDeleted: false vào tất cả các query find của bảng task
    // Nếu không muốn có isDeleted: false thì truyền vào isDeleted: undefined khi truy vấn
    const extendedClient = client.$extends({
      name: 'taskSoftDeleteFilter',
      query: {
        task: {
          findMany({ args, query }) {
            args.where = {
              ...args.where,
              isDeleted: false,
              ...args.where, // merge vào sau cùng để dev override nếu cần
            };
            return query(args);
          },
          findFirst({ args, query }) {
            args.where = {
              ...args.where,
              isDeleted: false,
              ...args.where,
            };
            return query(args);
          },
          findUnique({ args, query }) {
            args.where = {
              ...args.where,
              isDeleted: false,
              ...args.where,
            };
            return query(args);
          },
        },
      },
    });

    // super constructor
    super();
    Object.assign(this, extendedClient); // Gán extension vào service
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
