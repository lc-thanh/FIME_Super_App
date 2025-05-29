import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewestProductDto } from './dto/create-newest-product.dto';
import { UpdateNewestProductDto } from './dto/update-newest-product.dto';
import {
  defaultSortBy,
  defaultSortOrder,
  NewestProductFilterType,
  NewestProductPaginatedResponse,
  validSortByFields,
} from '@/modules/newest-product/dto/newest-product-pagination';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma.service';
import { extname, join } from 'path';
import fs from 'fs/promises';
import { NewestProductViewDto } from '@/modules/newest-product/dto/newest-product-view.dto';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';

@Injectable()
export class NewestProductService {
  private imagesUploadDirectory = join(
    process.cwd(),
    'public',
    'newest-products',
    'images',
  );

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createProductDto: CreateNewestProductDto,
    manager: IAccessTokenPayload,
    imageToUpload?: Express.Multer.File,
  ) {
    let imageName = '';
    if (imageToUpload) {
      imageName = await this.uploadImage(imageToUpload);
      if (!imageName) {
        throw new InternalServerErrorException(
          'Có lỗi xảy ra trong quá trình tải lên ảnh!',
        );
      }
    }

    const newProduct = await this.prismaService.newestProducts.create({
      data: {
        ...createProductDto,
        image: imageName || null,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'ADD_NEWEST_PRODUCT',
        content: JSON.stringify({
          id: newProduct.id,
          title: newProduct.title,
        }),
        userId: manager.sub,
      },
    });

    return newProduct;
  }

  async findAll(
    params: NewestProductFilterType,
  ): Promise<NewestProductPaginatedResponse> {
    const search = params.search || '';
    const pageSize = Number(params.pageSize) || 6;
    const page = Number(params.page) || 1;
    const skip = pageSize * (page - 1);
    const sortBy = params.sortBy || defaultSortBy;
    const sortOrder: Prisma.SortOrder =
      params.sortOrder === 'asc' || params.sortOrder === 'desc'
        ? params.sortOrder
        : defaultSortOrder;

    const where = {
      OR: [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          note: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
        {
          link: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
      ],
    };

    const orderBy = validSortByFields.includes(sortBy)
      ? { [sortBy]: sortOrder }
      : { [defaultSortBy]: sortOrder };

    const newestProducts = await this.prismaService.newestProducts.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
    });
    const total = await this.prismaService.newestProducts.count({ where });

    return {
      data: newestProducts.map((product) => ({
        id: product.id,
        title: product.title,
        date: product.date || null,
        note: product.note || null,
        image: product.image || null,
        link: product.link || null,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
      hasNextPage: total > page * pageSize,
      hasPreviousPage: page > 1,
    };
  }

  async findAllWithoutPagination(): Promise<NewestProductViewDto[]> {
    const newestProducts = await this.prismaService.newestProducts.findMany({
      orderBy: { date: 'desc' },
    });

    return newestProducts.map((product) => ({
      id: product.id,
      title: product.title,
      date: product.date,
      note: product.note,
      image: product.image,
      link: product.link,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }

  async uploadImage(file: Express.Multer.File, condition?: boolean) {
    if (condition === false) {
      throw new BadRequestException('Không đủ điều kiện để upload file!');
    }

    if (!file) {
      throw new BadRequestException('Không tìm thấy file để upload!');
    }

    // Tạo tên file ngẫu nhiên
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExt = extname(file.originalname);
    const fileName = `newest-product-${uniqueSuffix}${fileExt}`;

    // Đường dẫn lưu file
    const filePath = join(this.imagesUploadDirectory, fileName);

    // Tạo thư mục nếu chưa tồn tại
    await fs.mkdir(this.imagesUploadDirectory, { recursive: true });

    // Lưu file vào thư mục
    await fs.writeFile(filePath, file.buffer);

    // Trả về đường dẫn để truy cập
    return fileName;
  }

  async deleteImage(filename: string) {
    // Đường dẫn tuyệt đối đến file
    const filePath = join(this.imagesUploadDirectory, filename);

    try {
      // Kiểm tra xem file có tồn tại không
      await fs.stat(filePath);
      // Xóa file
      await fs.unlink(filePath);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Nếu không tồn tại hoặc lỗi khác
      return false;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} newestProduct`;
  }

  async update(
    id: string,
    updateProductDto: UpdateNewestProductDto,
    manager: IAccessTokenPayload,
    imageToUpload?: Express.Multer.File,
  ) {
    const productToUpdate = await this.prismaService.newestProducts.findUnique({
      where: { id },
    });
    if (!productToUpdate) {
      throw new NotFoundException('Sản phẩm không tồn tại!');
    }

    let imageName = '';
    if (updateProductDto.isImageChanged || imageToUpload) {
      if (productToUpdate.image) {
        await this.deleteImage(productToUpdate.image);
      }
      if (imageToUpload) {
        imageName = await this.uploadImage(imageToUpload);
        if (!imageName) {
          throw new InternalServerErrorException(
            'Có lỗi xảy ra trong quá trình tải lên ảnh!',
          );
        }
      }
    }

    const updatedProduct = await this.prismaService.newestProducts.update({
      where: { id },
      data: {
        title: updateProductDto.title,
        date: updateProductDto.date || null,
        note: updateProductDto.note || null,
        link: updateProductDto.link || null,
        image: imageName
          ? imageName
          : updateProductDto.isImageChanged
            ? null
            : undefined,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'EDIT_NEWEST_PRODUCT',
        content: JSON.stringify({
          id: productToUpdate.id,
          title: productToUpdate.title,
        }),
        userId: manager.sub,
      },
    });

    return updatedProduct;
  }

  async remove(id: string, manager: IAccessTokenPayload) {
    const productToDelete = await this.prismaService.newestProducts.findUnique({
      where: { id },
    });
    if (!productToDelete) {
      throw new NotFoundException('Sản phẩm không tồn tại!');
    }

    const deletedProduct = await this.prismaService.newestProducts.delete({
      where: { id },
    });
    if (productToDelete.image) await this.deleteImage(productToDelete.image);

    await this.prismaService.userActions.create({
      data: {
        type: 'REMOVE_NEWEST_PRODUCT',
        content: JSON.stringify({
          id: deletedProduct.id,
          title: deletedProduct.title,
        }),
        userId: manager.sub,
      },
    });

    return deletedProduct;
  }
}
