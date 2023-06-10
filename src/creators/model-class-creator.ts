import { Field, ObjectType } from '@nestjs/graphql';
import { ClassType } from 'type-graphql';

/**
 * The purpose of this class is to enable us to use generic types in one of our decorators, viz., @Field(). Typescript's limited support for reflection of metadata makes it necessary to follow this route.
 * It uses the class-creator pattern
 * @param TClass
 * @returns
 */
export default function ModelledResponse<T>(TClass: ClassType<T>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class ModelledResponseClass {
    @Field(() => String)
    statusCode: string | number;

    @Field(() => String)
    message: string;

    // here we use the runtime argument
    @Field((type) => TClass, { nullable: true })
    // and here the generic type
    data: T;

    constructor(statusCode: string | number, message: string, data: T) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
    }
  }
  return ModelledResponseClass;
}
