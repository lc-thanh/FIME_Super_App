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
import { User } from '@/common/decorators/user.decorator';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';

@Controller('gens')
export class GenController {
  constructor(private readonly genService: GenService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createGenDto: CreateGenDto,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Tạo gen mới thành công!',
      data: await this.genService.create(createGenDto, user),
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
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Cập nhật thông tin gen thành công!',
      data: await this.genService.update(id, updateGenDto, user),
    };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@UuidParam('id') id: string, @User() user: IAccessTokenPayload) {
    return {
      message: 'Xóa gen thành công!',
      data: await this.genService.remove(id, user),
    };
  }
}
