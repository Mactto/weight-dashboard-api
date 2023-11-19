import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DailyLog,
  Dashboard,
  ExerciseCategory,
} from 'src/dashboard/dashboard.entity';
import { Repository } from 'typeorm';

const parseMessage = (message: string) => {
  return JSON.parse(message).after;
};

@Injectable()
export class DailyLogTopicService {
  constructor(
    @InjectRepository(DailyLog)
    private readonly dailyLogRepository: Repository<DailyLog>,
  ) {}

  async handle(message: string): Promise<void> {
    const data = await parseMessage(message);

    const dailyLog = new DailyLog();
    dailyLog.id = data.id;
    dailyLog.date = new Date(data.date * 86400000);

    await this.dailyLogRepository.save(dailyLog);
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
    @InjectRepository(DailyLog)
    private readonly dailyLogRepository: Repository<DailyLog>,
  ) {}

  async handle(message: string): Promise<void> {
    const data = await parseMessage(message);

    const dailyLog = await this.dailyLogRepository.findOne({
      where: {
        id: data.daily_log_id,
      },
    });

    const dashboard = new Dashboard();
    dashboard.exerciseCategoryId = data.exercise_category_id;
    dashboard.count = data.count;
    dashboard.weight = data.weight;
    dashboard.date = dailyLog.date;
    dashboard.createdAt = data.created;

    await this.dashboardRepository.save(dashboard);
  }
}
