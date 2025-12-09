import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { NewestProductService } from './newest-product.service';
import { CreateNewestProductDto } from './dto/create-newest-product.dto';
import { UpdateNewestProductDto } from './dto/update-newest-product.dto';
import {
  NewestProductFilterType,
  NewestProductPaginatedResponse,
} from '@/modules/newest-product/dto/newest-product-pagination';
import { FileInterceptor } from '@nestjs/platform-express';
import { UuidParam } from '@/common/decorators/uuid-param.decorator';
import { NewestProductViewDto } from '@/modules/newest-product/dto/newest-product-view.dto';
import { Public } from '@/common/decorators/public-route.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { User } from '@/common/decorators/user.decorator';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';
import {
  imageFileFilter,
  memoryStorage,
  NEWEST_PRODUCT_IMAGE_MAX_SIZE,
  VALID_IMAGE_MIME_TYPES,
} from '@/configs/multer.config';
import {
  ValidateImageOptions,
  ValidateImagePipe,
} from '@/common/pipes/validate-image.pipe';

@Controller('newest-products')
export class NewestProductController {
  constructor(private readonly newestProductService: NewestProductService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage,
      limits: {
        fileSize: NEWEST_PRODUCT_IMAGE_MAX_SIZE,
      },
      fileFilter: imageFileFilter,
    }),
  )
  @Roles(Role.MANAGER)
  async create(
    @Body() createNewestProductDto: CreateNewestProductDto,
    @UploadedFile(
      new ValidateImagePipe({
        maxBytes: NEWEST_PRODUCT_IMAGE_MAX_SIZE,
        allowedMimes: VALID_IMAGE_MIME_TYPES,
        allowNullFile: true,
      } as ValidateImageOptions),
    )
    file: Express.Multer.File,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Tạo sản phẩm mới thành công!',
      data: await this.newestProductService.create(
        createNewestProductDto,
        user,
        file,
      ),
    };
  }

  @Get()
  findAll(
    @Query() params: NewestProductFilterType,
  ): Promise<NewestProductPaginatedResponse> {
    return this.newestProductService.findAll(params);
  }

  @Get('all')
  @Public()
  findAllWithoutPagination(): Promise<NewestProductViewDto[]> {
    return this.newestProductService.findAllWithoutPagination();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newestProductService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage,
      limits: {
        fileSize: NEWEST_PRODUCT_IMAGE_MAX_SIZE,
      },
      fileFilter: imageFileFilter,
    }),
  )
  @Roles(Role.MANAGER)
  async update(
    @UuidParam() id: string,
    @Body() updateNewestProductDto: UpdateNewestProductDto,
    @UploadedFile(
      new ValidateImagePipe({
        maxBytes: NEWEST_PRODUCT_IMAGE_MAX_SIZE,
        allowedMimes: VALID_IMAGE_MIME_TYPES,
        allowNullFile: true,
      } as ValidateImageOptions),
    )
    file: Express.Multer.File,
    @User() user: IAccessTokenPayload,
  ) {
    return {
      message: 'Cập nhật sản phẩm thành công!',
      data: await this.newestProductService.update(
        id,
        updateNewestProductDto,
        user,
        file,
      ),
    };
  }

  @Delete(':id')
  @Roles(Role.MANAGER)
  async remove(@UuidParam('id') id: string, @User() user: IAccessTokenPayload) {
    return {
      message: 'Xóa sản phẩm thành công!',
      data: await this.newestProductService.remove(id, user),
    };
  }
}
