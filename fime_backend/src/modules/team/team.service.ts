import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class TeamService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createTeamDto: CreateTeamDto) {
    return 'This action adds a new team';
  }

  findAll() {
    return `This action returns all team`;
  }

  findAllSelectors() {
    return this.prismaService.team.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
