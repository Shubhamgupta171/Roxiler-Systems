import { IsString, Length, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @Length(8, 16, { message: 'Password must be between 8 and 16 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least one uppercase letter and one special character',
  })
  newPassword: string;
}