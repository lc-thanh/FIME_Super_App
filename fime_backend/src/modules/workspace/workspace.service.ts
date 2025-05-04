import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createWorkspaceDto: CreateWorkspaceDto) {
    return 'This action adds a new workspace';
  }

  findAll() {
    return `This action returns all workspace`;
  }

  async findAllPersonal(userId: string) {
    const workspaces = await this.prismaService.workspace.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    return {
      message: 'Lấy danh sách workspace cá nhân thành công!',
      data: workspaces,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
