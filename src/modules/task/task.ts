import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseType } from '../../BaseType';
import { User } from '../user/user';

@ObjectType({ description: 'Task model' })
export class Task extends BaseType {
  @Field((type) => String, { nullable: false })
  title: string;

  @Field((type) => String, { nullable: true })
  description?: string | null;

  @Field((type) => Boolean, { nullable: true, defaultValue: false })
  completed?: boolean | null;

  @Field((type) => User, { nullable: true })
  owner?: User | null;
}
