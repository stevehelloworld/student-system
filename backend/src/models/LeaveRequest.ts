import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Session } from './Session';
import { User } from './User';

export enum LeaveType {
  PERSONAL = '事假',
  SICK = '病假'
}

export enum LeaveStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled'
}

@Entity()
export class LeaveRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  session_id!: number;

  @ManyToOne(() => Session)
  @JoinColumn({ name: 'session_id' })
  session!: Session;

  @Column()
  student_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student!: User;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: LeaveType,
  })
  type!: LeaveType;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: LeaveStatus,
    default: LeaveStatus.ACTIVE
  })
  status!: LeaveStatus;

  @CreateDateColumn()
  created_at!: Date;

  @Column({ type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp', nullable: true })
  cancelled_at?: Date;

  @Column()
  created_by!: number; // 學生或老師 id
} 