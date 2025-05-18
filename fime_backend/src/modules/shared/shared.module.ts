import { AccessControlService } from '@/modules/shared/access-control.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export class SharedModule {}
