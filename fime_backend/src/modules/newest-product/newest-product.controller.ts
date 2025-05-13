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

@Controller('newest-products')
export class NewestProductController {
  constructor(private readonly newestProductService: NewestProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createNewestProductDto: CreateNewestProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      message: 'Tạo sản phẩm mới thành công!',
      data: await this.newestProductService.create(
        createNewestProductDto,
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newestProductService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UuidParam() id: string,
    @Body() updateNewestProductDto: UpdateNewestProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      message: 'Cập nhật sản phẩm thành công!',
      data: await this.newestProductService.update(
        id,
        updateNewestProductDto,
        file,
      ),
    };
  }

  @Delete(':id')
  async remove(@UuidParam('id') id: string) {
    return {
      message: 'Xóa sản phẩm thành công!',
      data: await this.newestProductService.remove(id),
    };
  }
}
