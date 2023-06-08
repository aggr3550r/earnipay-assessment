import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDTO {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @MaxLength(200, {
    message: 'Description cannot contain more than 200 characters',
  })
  description?: string;
}
