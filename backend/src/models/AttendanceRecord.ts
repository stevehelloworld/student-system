import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Session } from './Session';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  LEAVE = 'LEAVE'
}

@Entity()
export class AttendanceRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Session, { nullable: false })
  @JoinColumn({ name: 'session_id' })
  session!: Session;

  @Column()
  session_id!: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  student!: User;

  @Column()
  student_id!: number;

  @Column({
    type: 'varchar',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT
  })
  status!: AttendanceStatus;

  @Column({ nullable: true })
  note?: string;

  @Column({ nullable: true })
  check_in_time?: Date;

  @Column({ nullable: true })
  check_out_time?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
} 