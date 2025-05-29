import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLatestPublicationDto } from './dto/create-latest-publication.dto';
import { UpdateLatestPublicationDto } from './dto/update-latest-publication.dto';
import {
  defaultSortBy,
  defaultSortOrder,
  PublicationFilterType,
  PublicationPaginatedResponse,
  validSortByFields,
} from '@/modules/latest-publication/dto/publication-pagination';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma.service';
import { PublicationViewDto } from '@/modules/latest-publication/dto/publication-view.dto';
import { IAccessTokenPayload } from '@/interfaces/access-token-payload.interface';

@Injectable()
export class LatestPublicationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createLatestPublicationDto: CreateLatestPublicationDto,
    manager: IAccessTokenPayload,
  ) {
    const newPublication = await this.prismaService.latestPublication.create({
      data: {
        title: createLatestPublicationDto.title,
        note: createLatestPublicationDto.note || null,
        embed_code: createLatestPublicationDto.embed_code,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'ADD_LATEST_PUBLICATION',
        content: JSON.stringify({
          id: newPublication.id,
          title: newPublication.title,
        }),
        userId: manager.sub,
      },
    });

    return newPublication;
  }

  async findAll(
    params: PublicationFilterType,
  ): Promise<PublicationPaginatedResponse> {
    const search = params.search || '';
    const pageSize = Number(params.pageSize) || 10;
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
          embed_code: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
      ],
    };

    const orderBy = validSortByFields.includes(sortBy)
      ? { [sortBy]: sortOrder }
      : { [defaultSortBy]: sortOrder };

    const publications = await this.prismaService.latestPublication.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
    });
    const total = await this.prismaService.latestPublication.count({ where });

    return {
      data: publications.map((publication) => ({
        id: publication.id,
        title: publication.title,
        note: publication.note || null,
        embed_code: publication.embed_code || '',
        isActive: publication.isActive,
        createdAt: publication.createdAt,
        updatedAt: publication.updatedAt,
      })),
      page,
      pageSize,
      total,
      totalPage: Math.ceil(total / pageSize),
      hasNextPage: total > page * pageSize,
      hasPreviousPage: page > 1,
    };
  }

  async getActivePublic(): Promise<PublicationViewDto> {
    const publication = await this.prismaService.latestPublication.findFirst({
      where: { isActive: true },
    });

    if (!publication)
      throw new BadRequestException('Không có ấn phẩm nào được kích hoạt');

    return {
      id: publication.id,
      title: publication.title,
      note: publication.note,
      embed_code: publication.embed_code,
      isActive: publication.isActive,
      createdAt: publication.createdAt,
      updatedAt: publication.updatedAt,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} latestPublication`;
  }

  async update(
    id: string,
    updateLatestPublicationDto: UpdateLatestPublicationDto,
    manager: IAccessTokenPayload,
  ) {
    const publicationToUpdate =
      await this.prismaService.latestPublication.findUnique({
        where: { id },
      });
    if (!publicationToUpdate) {
      throw new BadRequestException('Không tìm thấy ấn phẩm để cập nhật');
    }

    const publication = await this.prismaService.latestPublication.update({
      where: { id },
      data: {
        title: updateLatestPublicationDto.title,
        note: updateLatestPublicationDto.note || null,
        embed_code: updateLatestPublicationDto.embed_code,
      },
    });

    await this.prismaService.userActions.create({
      data: {
        type: 'EDIT_LATEST_PUBLICATION',
        content: JSON.stringify({
          id: publicationToUpdate.id,
          title: publicationToUpdate.title,
        }),
        userId: manager.sub,
      },
    });

    return publication;
  }

  async activePublication(id: string, manager: IAccessTokenPayload) {
    const publication = await this.prismaService.latestPublication.findUnique({
      where: { id },
    });

    if (!publication) {
      throw new BadRequestException('Không tìm thấy ấn phẩm');
    }

    const currentActivePublication =
      await this.prismaService.latestPublication.findMany({
        where: { isActive: true },
      });

    if (currentActivePublication.length > 0) {
      await this.prismaService.latestPublication.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const updatedPublication =
      await this.prismaService.latestPublication.update({
        where: { id },
        data: { isActive: true },
      });

    await this.prismaService.userActions.create({
      data: {
        type: 'ACTIVE_LATEST_PUBLICATION',
        content: JSON.stringify({
          id: updatedPublication.id,
          title: updatedPublication.title,
        }),
        userId: manager.sub,
      },
    });

    return updatedPublication;
  }

  async remove(id: string, manager: IAccessTokenPayload) {
    const publicationToDelete =
      await this.prismaService.latestPublication.findUnique({
        where: { id },
      });
    if (!publicationToDelete) {
      throw new BadRequestException('Không tìm thấy ấn phẩm để xóa');
    }

    const deletedPublication =
      await this.prismaService.latestPublication.delete({
        where: { id },
      });

    await this.prismaService.userActions.create({
      data: {
        type: 'REMOVE_LATEST_PUBLICATION',
        content: JSON.stringify({
          id: deletedPublication.id,
          title: deletedPublication.title,
        }),
        userId: manager.sub,
      },
    });

    return deletedPublication;
  }
}
