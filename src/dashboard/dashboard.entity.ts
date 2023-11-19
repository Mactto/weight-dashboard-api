import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dashboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  exerciseCategoryId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: 0 })
  count: number;

  @Column({ default: 0 })
  weight: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

@Entity()
export class ExerciseCategory {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;
}

@Entity()
export class DailyLog {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  date: Date;
}
