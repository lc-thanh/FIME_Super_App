import { Module } from '@nestjs/common';
import { GenService } from './gen.service';
import { GenController } from './gen.controller';
import { PrismaService } from '@/prisma.service';

@Module({
  controllers: [GenController],
  providers: [GenService, PrismaService],
})
export class GenModule {}
