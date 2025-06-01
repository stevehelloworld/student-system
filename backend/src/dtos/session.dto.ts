import { IsString, IsNotEmpty, IsDate, MaxLength, IsNumber, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessionDto {
  @IsNumber()
  course_id!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description!: string;

  @Type(() => Date)
  @IsDate()
  session_date!: Date;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: '開始時間必須是有效的時間格式 (HH:mm)'
  })
  start_time!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: '結束時間必須是有效的時間格式 (HH:mm)'
  })
  end_time!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;
}

export class UpdateSessionDto extends CreateSessionDto {} 