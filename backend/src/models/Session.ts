import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './Course';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Course, { nullable: false })
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @Column()
  course_id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  session_date!: Date;

  @Column()
  start_time!: string;

  @Column()
  end_time!: string;

  @Column()
  location!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
} 