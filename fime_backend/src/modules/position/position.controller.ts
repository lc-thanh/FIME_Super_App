import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import {
  PositionFilterType,
  PositionPaginatedResponse,
} from '@/modules/position/dto/position-pagination';
import { UuidParam } from '@/common/decorators/uuid-param.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { User } from '@/common/decorators/user.decorator';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createPositionDto: CreatePositionDto,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Tạo chức vụ mới thành công!',
      data: await this.positionService.create(createPositionDto, user),
    };
  }

  @Get()
  async findAll(
    @Query() params: PositionFilterType,
  ): Promise<PositionPaginatedResponse> {
    return this.positionService.findAll(params);
  }

  @Get('selectors')
  findAllSelectors() {
    return this.positionService.findAllSelectors();
  }

  @Get(':id')
  async findOne(@UuidParam('id') id: string) {
    return {
      message: 'Lấy thông tin ban thành công!',
      data: await this.positionService.findOne(id),
    };
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @UuidParam('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Cập nhật chức vụ thành công!',
      data: await this.positionService.update(id, updatePositionDto, user),
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@UuidParam('id') id: string, @User() user: IAccessTokenPayload) {
    return {
      message: 'Xóa chức vụ thành công!',
      data: await this.positionService.remove(id, user),
    };
  }
}
