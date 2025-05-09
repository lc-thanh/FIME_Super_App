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
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import {
  PositionFilterType,
  PositionPaginatedResponse,
} from '@/modules/position/dto/position-pagination';

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
  findOne(@Param('id') id: string) {
    return this.positionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionService.update(+id, updatePositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionService.remove(+id);
  }
}
