import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsIn(['management', 'admin', 'place', 'client'])
  role: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}
