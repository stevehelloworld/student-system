import { Expose } from 'class-transformer';

export class CreateAttendanceDto {
  @Expose()
  session_id!: number;

  @Expose()
  student_id!: number;

  @Expose()
  attendance_status!: string;

  @Expose()
  note?: string;

  @Expose()
  check_in_time?: Date;

  @Expose()
  check_out_time?: Date;
}

export class UpdateAttendanceDto {
  @Expose()
  attendance_status!: string;

  @Expose()
  note?: string;

  @Expose()
  check_in_time?: Date;

  @Expose()
  check_out_time?: Date;
}

export class BulkCreateAttendanceDto {
  @Expose()
  session_id!: number;

  @Expose()
  student_ids!: number[];
} 