import { PartialType } from '@nestjs/graphql';
import { CreateTaskDTO } from './create-task.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {
  @IsBoolean({
    message: "Kindly make sure the type you've entered is a boolean",
  })
  @IsOptional()
  completed?: boolean;
}
