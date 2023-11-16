import {
  DailyLogTopicService,
  ExerciseCategoryTopicService,
  PerformanceLogTopicService,
} from './topic.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    private readonly performanceLogTopicService: PerformanceLogTopicService,
    private readonly exerciseCategoryTopicService: ExerciseCategoryTopicService,
    private readonly dailyLogTopicService: DailyLogTopicService,
  ) {}

  async onModuleInit() {
    await this.connectConsumer();
  }

  async getConsumer() {
    await this.consumer.subscribe({
      topic: 'weight-daily.public.daily_log',
      fromBeginning: true,
    });

    await this.consumer.subscribe({
      topic: 'weight-daily.public.performance_log',
      fromBeginning: true,
    });

    await this.consumer.subscribe({
      topic: 'weight-daily.public.exercise_category',
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = message.value.toString();
        if (topic === 'weight-daily.public.performance_log') {
          await this.performanceLogTopicService.handle(messageValue);
        } else if (topic === 'weight-daily.public.exercise_category') {
          await this.exerciseCategoryTopicService.handle(messageValue);
        } else if (topic === 'weight-daily.public.daily_log') {
          await this.dailyLogTopicService.handle(messageValue);
        }
      },
    });
  }

  private async connectConsumer(retryCount: number = 0) {
    try {
      this.kafka = new Kafka({
        brokers: ['localhost:9092'],
      });

      this.consumer = this.kafka.consumer({ groupId: 'dashboard-group' });
      await this.consumer.connect();

      await this.getConsumer();
    } catch (error) {
      console.error(
        `Failed to connect to Kafka. Retry count: ${retryCount}`,
        error,
      );
      if (retryCount < 3) {
        setTimeout(() => this.connectConsumer(retryCount + 1), 5000);
      } else {
        console.error('Max retry count reached. Unable to connect to Kafka.');
      }
    }
  }
}
