import { IsString, IsEmail, IsEnum, IsOptional, IsNumber, MinLength, MaxLength, Matches } from 'class-validator';
import { UserRole } from '../models/User';
import { Expose } from 'class-transformer';

export class RegisterDto {
  @Expose()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name!: string;

  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: '密碼必須包含至少一個大寫字母、一個小寫字母和一個數字或特殊字元'
  })
  password!: string;

  @Expose()
  @IsEnum(UserRole)
  role!: UserRole;

  @Expose()
  @IsOptional()
  @IsNumber()
  grade?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  school?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  parent_name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Matches(/^09\d{8}$/, {
    message: '家長電話必須是有效的台灣手機號碼格式'
  })
  parent_phone?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  student_no?: string;
}

export class LoginDto {
  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  password!: string;
} 