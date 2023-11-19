import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dashboard } from './dashboard.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Dashboard)
    private dashboardRepository: Repository<Dashboard>,
  ) {}

  async findAll(filterExerciseCategoryId?: string) {
    const query = this.dashboardRepository.createQueryBuilder('dashboard');

    if (filterExerciseCategoryId) {
      query.andWhere('dashboard.exerciseCategoryId = :exerciseCategoryId', {
        exerciseCategoryId: filterExerciseCategoryId,
      });
    }

    return await query.getMany();
  }
}
