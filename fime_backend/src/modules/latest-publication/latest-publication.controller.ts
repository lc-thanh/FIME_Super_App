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
import { Public } from '@/common/decorators/public-route.decorator';
import { PublicationViewDto } from '@/modules/latest-publication/dto/publication-view.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { User } from '@/common/decorators/user.decorator';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';

@Controller('latest-publications')
export class LatestPublicationController {
  constructor(
    private readonly latestPublicationService: LatestPublicationService,
  ) {}

  @Post()
  @Roles(Role.MANAGER)
  async create(
    @Body() createLatestPublicationDto: CreateLatestPublicationDto,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Tạo ấn phẩm mới thành công!',
      data: await this.latestPublicationService.create(
        createLatestPublicationDto,
        user,
      ),
    };
  }

  @Get()
  findAll(
    @Query() params: PublicationFilterType,
  ): Promise<PublicationPaginatedResponse> {
    return this.latestPublicationService.findAll(params);
  }

  @Get('public')
  @Public()
  getPublic(): Promise<PublicationViewDto> {
    return this.latestPublicationService.getActivePublic();
  }

  @Get(':id')
  findOne(@UuidParam('id') id: string) {
    return this.latestPublicationService.findOne(+id);
  }

  @Put(':id')
  @Roles(Role.MANAGER)
  async update(
    @UuidParam('id') id: string,
    @Body() updateLatestPublicationDto: UpdateLatestPublicationDto,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Cập nhật thông tin ấn phẩm thành công!',
      data: await this.latestPublicationService.update(
        id,
        updateLatestPublicationDto,
        user,
      ),
    };
  }

  @Post(':id/active')
  @Roles(Role.MANAGER)
  async active(@UuidParam('id') id: string, @User() user: IAccessTokenPayload) {
    return {
      message: 'Kích hoạt ấn phẩm thành công!',
      data: await this.latestPublicationService.activePublication(id, user),
    };
  }

  @Delete(':id')
  @Roles(Role.MANAGER)
  async remove(@UuidParam('id') id: string, @User() user: IAccessTokenPayload) {
    return {
      message: 'Xóa ấn phẩm thành công!',
      data: await this.latestPublicationService.remove(id, user),
    };
  }
}
