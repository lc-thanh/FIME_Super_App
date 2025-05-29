import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import {
  TeamFilterType,
  TeamPaginatedResponse,
} from '@/modules/team/dto/team-pagination';
import { UuidParam } from '@/common/decorators/uuid-param.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { User } from '@/common/decorators/user.decorator';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Tạo ban mới thành công!',
      data: await this.teamService.create(createTeamDto, user),
    };
  }

  @Get()
  findAll(@Query() params: TeamFilterType): Promise<TeamPaginatedResponse> {
    return this.teamService.findAll(params);
  }

  @Get('selectors')
  findAllSelectors() {
    return this.teamService.findAllSelectors();
  }

  @Get(':id')
  async findOne(@UuidParam('id') id: string) {
    return {
      message: 'Lấy thông tin ban thành công!',
      data: await this.teamService.findOne(id),
    };
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @UuidParam('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Cập nhật thông tin ban thành công!',
      data: await this.teamService.update(id, updateTeamDto, user),
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@UuidParam('id') id: string, @User() user: IAccessTokenPayload) {
    return {
      message: 'Xóa ban thành công!',
      data: await this.teamService.remove(id, user),
    };
  }
}
