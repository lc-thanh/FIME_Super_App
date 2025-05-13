import { Module } from '@nestjs/common';
import { NewestProductService } from './newest-product.service';
import { NewestProductController } from './newest-product.controller';
import { PrismaService } from '@/prisma.service';

@Module({
  controllers: [NewestProductController],
  providers: [NewestProductService, PrismaService],
})
export class NewestProductModule {}
