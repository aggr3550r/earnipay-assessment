// import {
//   Context,
//   Field,
//   InputType,
//   ResolveField,
//   Resolver,
//   Root,
// } from '@nestjs/graphql';
// import { TaskCreateInput } from '../task/task.resolver';
// import { User } from './user';
// import { Inject } from '@nestjs/common';
// import { PrismaService } from '../../services/prisma/prisma.service';
// import { Task } from '../task/task';

// @InputType()
// class UserUniqueInput {
//   @Field({ nullable: true })
//   id: number;

//   @Field({ nullable: true })
//   email: string;
// }

// @InputType()
// class UserCreateInput {
//   @Field()
//   email: string;

//   @Field({ nullable: true })
//   name: string;

//   @Field((type) => [TaskCreateInput], { nullable: true })
//   posts: [TaskCreateInput];
// }

// @Resolver(Task)
// export class UserResolver {
//   constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

//   @ResolveField()
//   async tasks(@Root() user: User, @Context() ctx): Promise<Task[]> {
//     return this.prismaService.user
//       .findUnique({
//         where: {
//           id: user.id,
//         },
//       })
//       .tasks();
//   }
// }
