import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { GenService } from './gen.service';
import { CreateGenDto } from './dto/create-gen.dto';
import { UpdateGenDto } from './dto/update-gen.dto';
import { UuidParam } from '@/common/decorators/uuid-param.decorator';
import {
  GenFilterType,
  GenPaginatedResponse,
} from '@/modules/gen/dto/gen-pagination';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('gens')
export class GenController {
  constructor(private readonly genService: GenService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createGenDto: CreateGenDto) {
    return {
      message: 'Tạo gen mới thành công!',
      data: await this.genService.create(createGenDto),
    };
  }

  @Get()
  findAll(@Query() params: GenFilterType): Promise<GenPaginatedResponse> {
    return this.genService.findAll(params);
  }

  @Get('selectors')
  findAllSelectors() {
    return this.genService.findAllSelectors();
  }

  @Get(':id')
  async findOne(@UuidParam('id') id: string) {
    return {
      message: 'Lấy thông tin gen thành công!',
      data: await this.genService.findOne(id),
    };
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async update(
    @UuidParam('id') id: string,
    @Body() updateGenDto: UpdateGenDto,
  ) {
    return {
      message: 'Cập nhật thông tin gen thành công!',
      data: await this.genService.update(id, updateGenDto),
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@UuidParam('id') id: string) {
    return {
      message: 'Xóa gen thành công!',
      data: await this.genService.remove(id),
    };
  }
}
