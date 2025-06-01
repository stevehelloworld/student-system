import { IsEnum } from 'class-validator';
import { LeaveType } from '../models/LeaveRequest';
import { Expose } from 'class-transformer';

export class CreateLeaveDto {
  @Expose()
  @IsEnum(LeaveType, { message: 'type 必須為 事假 或 病假' })
  type!: LeaveType;
}

export class UpdateLeaveDto {
  @Expose()
  @IsEnum(LeaveType, { message: 'type 必須為 事假 或 病假' })
  type!: LeaveType;
} 