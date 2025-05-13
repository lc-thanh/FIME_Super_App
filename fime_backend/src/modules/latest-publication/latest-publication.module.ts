import { Module } from '@nestjs/common';
import { LatestPublicationService } from './latest-publication.service';
import { LatestPublicationController } from './latest-publication.controller';
import { PrismaService } from '@/prisma.service';

@Module({
  controllers: [LatestPublicationController],
  providers: [LatestPublicationService, PrismaService],
})
export class LatestPublicationModule {}
