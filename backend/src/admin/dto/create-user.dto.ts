import { IsEmail, IsString, Length, Matches, IsEnum } from 'class-validator';
import { UserRole } from '../../auth/entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(20, 60, { message: 'Name must be between 20 and 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @Length(1, 400, { message: 'Address must be at most 400 characters' })
  address: string;

  @IsString()
  @Length(8, 16, { message: 'Password must be between 8 and 16 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least one uppercase letter and one special character',
  })
  password: string;

  @IsEnum(UserRole, { message: 'Role must be a valid user role' })
  role: UserRole;
}