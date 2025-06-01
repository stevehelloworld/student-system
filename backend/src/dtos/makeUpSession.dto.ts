import { Expose } from 'class-transformer';

export class CreateMakeUpSessionDto {
  @Expose()
  course_id!: number;

  @Expose()
  date!: Date;

  @Expose()
  start_time!: string;

  @Expose()
  end_time!: string;

  @Expose()
  location!: string;

  @Expose()
  student_ids!: number[];
}

export class UpdateMakeUpSessionDto {
  @Expose()
  date?: Date;

  @Expose()
  start_time?: string;

  @Expose()
  end_time?: string;

  @Expose()
  location?: string;

  @Expose()
  student_ids?: number[];
} 