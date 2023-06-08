import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { Task } from '../task/task';
import { BaseType } from '../../BaseType';

@ObjectType({ description: 'User model' })
export class User extends BaseType {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field((type) => String, { nullable: true })
  name?: string | null;

  @Field((type) => [Task], { nullable: 'items' })
  tasks?: [Task] | null;
}
