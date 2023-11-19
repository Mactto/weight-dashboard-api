import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import {
  DailyLogTopicService,
  PerformanceLogTopicService,
  ExerciseCategoryTopicService,
} from './topic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DailyLog,
  Dashboard,
  ExerciseCategory,
} from 'src/dashboard/dashboard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseCategory, Dashboard, DailyLog])],
  providers: [
    KafkaService,
    DailyLogTopicService,
    PerformanceLogTopicService,
    ExerciseCategoryTopicService,
  ],
  exports: [KafkaService],
})
export class KafkaModule {}
