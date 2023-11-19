import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiQuery({ name: 'filterExerciseCategoryId', required: false })
  async findAll(
    @Query('filterExerciseCategoryId') filterExerciseCategoryId?: string,
  ) {
    return this.dashboardService.findAll(filterExerciseCategoryId);
  }
}
