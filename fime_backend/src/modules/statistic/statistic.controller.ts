import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { UserActionFilterType } from '@/modules/statistic/dto/user-actions-pagination';

@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('user-actions')
  async getUserActions(@Query() params: UserActionFilterType) {
    return this.statisticService.getUserActions(params);
  }

  @Get('task')
  async getTaskStatistics() {
    return await this.statisticService.getTaskStatistics();
  }
}
