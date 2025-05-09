import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import {
  TeamFilterType,
  TeamPaginatedResponse,
} from '@/modules/team/dto/team-pagination';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    return {
      message: 'Tạo ban mới thành công!',
      data: await this.teamService.create(createTeamDto),
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
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}
