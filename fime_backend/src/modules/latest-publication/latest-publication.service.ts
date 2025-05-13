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

@Injectable()
export class LatestPublicationService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createLatestPublicationDto: CreateLatestPublicationDto) {
    const newPublication = this.prismaService.latestPublication.create({
      data: {
        title: createLatestPublicationDto.title,
        note: createLatestPublicationDto.note || null,
        embed_code: createLatestPublicationDto.embed_code,
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
      ? sortBy === 'users'
        ? { users: { _count: sortOrder } }
        : { [sortBy]: sortOrder }
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

  findOne(id: number) {
    return `This action returns a #${id} latestPublication`;
  }

  async update(
    id: string,
    updateLatestPublicationDto: UpdateLatestPublicationDto,
  ) {
    const publication = await this.prismaService.latestPublication.update({
      where: { id },
      data: {
        title: updateLatestPublicationDto.title,
        note: updateLatestPublicationDto.note || null,
        embed_code: updateLatestPublicationDto.embed_code,
      },
    });
    return publication;
  }

  async activePublication(id: string) {
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

    return updatedPublication;
  }

  async remove(id: string) {
    const publication = await this.prismaService.latestPublication.delete({
      where: { id },
    });
    return publication;
  }
}
