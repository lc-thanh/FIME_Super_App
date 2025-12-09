import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@/prisma.service';
import { FirebaseModule } from '@/modules/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
