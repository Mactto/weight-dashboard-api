import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Dashboard {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: '' })
  exercise_type: string;

  @Column({ default: 0 })
  sum_count: number;

  @Column({ default: 0 })
  sum_weight: number;
}

@Entity()
export class ExerciseCategory {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;
}
