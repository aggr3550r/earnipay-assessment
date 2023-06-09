import { Field, ObjectType } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';

export default function PagingatedResponse<T>(TClass: ClassType<T>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field((type) => [TClass])
    data: T[];

    meta: any;

    constructor(data: T[], meta: any) {
      (this.data = data), (this.meta = meta);
    }
  }

  return PaginatedResponseClass;
}
