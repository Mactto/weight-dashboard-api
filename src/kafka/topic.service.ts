import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dashboard, ExerciseCategory } from 'src/dashboard/dashboard.entity';
import { Repository } from 'typeorm';

const parseMessage = (message: string) => {
  return JSON.parse(message).after;
};

@Injectable()
export class DailyLogTopicService {
  constructor(
    @InjectRepository(Dashboard)
    private readonly dashboardRepository: Repository<Dashboard>,
  ) {}

  async handle(message: string): Promise<void> {
    const data = await parseMessage(message);

    const dashboard = new Dashboard();
    dashboard.id = data.id;
    dashboard.date = new Date(data.date * 86400000);

    await this.dashboardRepository.save(dashboard);
  }
}

@Injectable()
export class ExerciseCategoryTopicService {
  constructor(
    @InjectRepository(ExerciseCategory)
    private readonly exerciseCategoryRepository: Repository<ExerciseCategory>,
  ) {}

  async handle(message: string): Promise<void> {
    const data = await parseMessage(message);

    const exerciseCategory = new ExerciseCategory();
    exerciseCategory.id = data.id;
    exerciseCategory.name = data.name;

    await this.exerciseCategoryRepository.save(exerciseCategory);
  }
}

@Injectable()
export class PerformanceLogTopicService {
  constructor(
    @InjectRepository(Dashboard)
    private readonly dashboardRepository: Repository<Dashboard>,
    @InjectRepository(ExerciseCategory)
    private readonly exerciseCategoryRepository: Repository<ExerciseCategory>,
  ) {}

  async handle(message: string): Promise<void> {
    const data = await parseMessage(message);

    const dashboard = await this.dashboardRepository.findOne({
      where: {
        id: data.daily_log_id,
      },
    });

    const exerciseCategory = await this.exerciseCategoryRepository.findOne({
      where: {
        id: data.exercise_category_id,
      },
    });

    dashboard.sum_count = dashboard.sum_count + data.count;
    dashboard.sum_weight = dashboard.sum_weight + data.weight;
    dashboard.exercise_type = exerciseCategory.name;

    await this.dashboardRepository.save(dashboard);
  }
}
