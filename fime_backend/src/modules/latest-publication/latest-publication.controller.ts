import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { LatestPublicationService } from './latest-publication.service';
import { CreateLatestPublicationDto } from './dto/create-latest-publication.dto';
import { UpdateLatestPublicationDto } from './dto/update-latest-publication.dto';
import {
  PublicationFilterType,
  PublicationPaginatedResponse,
} from '@/modules/latest-publication/dto/publication-pagination';
import { UuidParam } from '@/common/decorators/uuid-param.decorator';

@Controller('latest-publications')
export class LatestPublicationController {
  constructor(
    private readonly latestPublicationService: LatestPublicationService,
  ) {}

  @Post()
  async create(@Body() createLatestPublicationDto: CreateLatestPublicationDto) {
    return {
      message: 'Tạo ấn phẩm mới thành công!',
      data: await this.latestPublicationService.create(
        createLatestPublicationDto,
      ),
    };
  }

  @Get()
  findAll(
    @Query() params: PublicationFilterType,
  ): Promise<PublicationPaginatedResponse> {
    return this.latestPublicationService.findAll(params);
  }

  @Get(':id')
  findOne(@UuidParam('id') id: string) {
    return this.latestPublicationService.findOne(+id);
  }

  @Put(':id')
  async update(
    @UuidParam('id') id: string,
    @Body() updateLatestPublicationDto: UpdateLatestPublicationDto,
  ) {
    return {
      message: 'Cập nhật thông tin ấn phẩm thành công!',
      data: await this.latestPublicationService.update(
        id,
        updateLatestPublicationDto,
      ),
    };
  }

  @Post(':id/active')
  async active(@UuidParam('id') id: string) {
    return {
      message: 'Kích hoạt ấn phẩm thành công!',
      data: await this.latestPublicationService.activePublication(id),
    };
  }

  @Delete(':id')
  async remove(@UuidParam('id') id: string) {
    return {
      message: 'Xóa ấn phẩm thành công!',
      data: await this.latestPublicationService.remove(id),
    };
  }
}
