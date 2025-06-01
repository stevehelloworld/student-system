import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LeaveRequest } from './LeaveRequest';
import { User } from './User';

export enum MakeUpAttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE'
}

@Entity()
export class MakeUpSession {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  leave_request_id!: number;

  @ManyToOne(() => LeaveRequest, { nullable: false })
  @JoinColumn({ name: 'leave_request_id' })
  leave_request!: LeaveRequest;

  @Column({ type: 'date' })
  make_up_date!: string;

  @Column({ type: 'varchar' })
  start_time!: string;

  @Column({ type: 'varchar' })
  end_time!: string;

  @Column()
  created_by!: number; // 教師 id

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: MakeUpAttendanceStatus,
    nullable: true
  })
  attendance_status?: MakeUpAttendanceStatus;
} 