import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { User } from '@/common/decorators/user.decorator';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';
import { UuidParam } from '@/common/decorators/uuid-param.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Tạo workspace mới thành công!',
      data: await this.workspaceService.create(createWorkspaceDto, user.sub),
    };
  }

  @Get('my')
  async findAllPersonal(@User() user: IAccessTokenPayload) {
    return await this.workspaceService.findAllPersonal(user);
  }

  @Get(':id')
  async findOne(@UuidParam('id') id: string) {
    return {
      message: 'Lấy thông tin workspace thành công!',
      data: await this.workspaceService.findOne(id),
    };
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async rename(
    @UuidParam('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return {
      message: 'Đổi tên workspace thành công!',
      data: await this.workspaceService.update(id, updateWorkspaceDto),
    };
  }

  @Delete(':workspaceId')
  @Roles(Role.ADMIN)
  async remove(
    @UuidParam('workspaceId') workspaceId: string,
    @Body('password') password: string,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Xóa workspace thành công!',
      data: await this.workspaceService.remove(workspaceId, password, user.sub),
    };
  }
}
