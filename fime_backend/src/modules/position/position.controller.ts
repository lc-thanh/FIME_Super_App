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

@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  async create(@Body() createPositionDto: CreatePositionDto) {
    return {
      message: 'Tạo ban mới thành công!',
      data: await this.positionService.create(createPositionDto),
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
  async update(
    @UuidParam('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return {
      message: 'Cập nhật chức vụ thành công!',
      data: await this.positionService.update(id, updatePositionDto),
    };
  }

  @Delete(':id')
  async remove(@UuidParam('id') id: string) {
    return {
      message: 'Xóa chức vụ thành công!',
      data: await this.positionService.remove(id),
    };
  }
}
