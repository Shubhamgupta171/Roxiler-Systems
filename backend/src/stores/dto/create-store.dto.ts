// src/admin/dto/create-store.dto.ts
import {
  IsEmail,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';

export class CreateStoreDto {
  @IsString({ message: 'Store name must be a string' })
  @Length(1, 60, {
    message: 'Store name must be between 1 and 60 characters',
  })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString({ message: 'Address must be a string' })
  @Length(1, 400, {
    message: 'Address must be between 1 and 400 characters',
  })
  address: string;

  @IsOptional()
 @IsString()
ownerId?: string;

}
