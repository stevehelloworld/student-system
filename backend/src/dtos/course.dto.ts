import { IsString, IsNumber, IsDate, IsNotEmpty, Min, MaxLength } from 'class-validator';
import { Type, Expose } from 'class-transformer';

export class CreateCourseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description!: string;

  @Expose()
  @IsNumber()
  @Min(1)
  capacity!: number;

  @Expose()
  @Type(() => Date)
  @IsDate()
  start_date!: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  end_date!: Date;

  @Expose()
  @IsString()
  @IsNotEmpty()
  schedule!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  location!: string;

  @Expose()
  @IsNumber()
  @Min(0)
  price!: number;
}

export class UpdateCourseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description?: string;

  @Expose()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @Expose()
  @Type(() => Date)
  @IsDate()
  start_date?: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  end_date?: Date;

  @Expose()
  @IsString()
  @IsNotEmpty()
  schedule?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @Expose()
  @IsNumber()
  @Min(0)
  price?: number;
} 