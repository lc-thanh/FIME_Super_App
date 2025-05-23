import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { PrismaService } from '@/prisma.service';
import { comparePasswordHelper } from '@/helpers/util';
import { ViewWorkspaceDto } from '@/modules/workspace/dto/view-workspace.dto';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';
import { Role } from '@prisma/client';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createWorkspaceDto: CreateWorkspaceDto, userId: string) {
    const { name } = createWorkspaceDto;
    const workspace = this.prismaService.workspace.create({
      data: {
        name,
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return workspace;
  }

  async findAllPersonal(user: IAccessTokenPayload) {
    // Admin có thể xem tất cả workspace
    if (user.role.some((role) => role === Role.ADMIN)) {
      const workspaces = await this.prismaService.workspace.findMany();
      return {
        message: 'Lấy danh sách workspace thành công!',
        data: workspaces,
      };
    }

    // Người dùng bình thường chỉ có thể xem workspace của mình
    const workspaces = await this.prismaService.workspace.findMany({
      where: {
        users: {
          some: {
            id: user.sub,
          },
        },
      },
    });

    return {
      message: 'Lấy danh sách workspace cá nhân thành công!',
      data: workspaces,
    };
  }

  async findOne(id: string): Promise<ViewWorkspaceDto> {
    const workspace = await this.prismaService.workspace.findUnique({
      where: {
        id,
      },
      include: {
        users: {
          select: {
            id: true,
            fullname: true,
            image: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new BadRequestException('Workspace không tồn tại');
    }

    return workspace;
  }

  async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    const updatedWorkspace = await this.prismaService.workspace.update({
      where: {
        id,
      },
      data: {
        name: updateWorkspaceDto.name,
      },
    });

    return updatedWorkspace;
  }

  async remove(workspaceId: string, password: string, userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const validPassword = await comparePasswordHelper(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    const workspace = await this.prismaService.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });
    if (!workspace) {
      throw new BadRequestException('Workspace không tồn tại');
    }
    const deletedWorkspace = await this.prismaService.workspace.delete({
      where: {
        id: workspaceId,
      },
    });

    return deletedWorkspace;
  }
}
