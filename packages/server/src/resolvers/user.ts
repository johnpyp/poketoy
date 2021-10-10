import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../my-context";
import { User } from "../entities/User";
import argon2 from "argon2";
import { ApolloError, AuthenticationError, ForbiddenError } from "apollo-server-core";
import { AlreadyExistsError } from "../errors";
import { PostgresError } from "pg-error-enum";

@InputType()
class RegisterInput {
  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
class LoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
class UpdateMeInput {
  @Field()
  currentPassword!: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  newPassword?: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() ctx: MyContext): Promise<User[]> {
    const userRepository = ctx.em.getRepository(User);
    return userRepository.findAll();
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("username") username: string, @Ctx() ctx: MyContext): Promise<User | null> {
    const userRepository = ctx.em.getRepository(User);
    return userRepository.findOne({ username });
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    if (!ctx.req.session.userId) throw new AuthenticationError("Not logged in");
    const userRepository = ctx.em.getRepository(User);
    return userRepository.findOne({ id: ctx.req.session.userId });
  }

  @Mutation(() => User)
  async register(@Arg("input") registerInput: RegisterInput, @Ctx() ctx: MyContext): Promise<User> {
    const userRepository = ctx.em.getRepository(User);
    const passwordHash = await argon2.hash(registerInput.password);

    try {
      const user = userRepository.create({
        username: registerInput.username,
        email: registerInput.email,
        passwordHash: passwordHash,
      });
      ctx.req.session.userId = user.id;

      await userRepository.persistAndFlush(user);
      return user;
    } catch (err: any) {
      if (err.code === PostgresError.UNIQUE_VIOLATION) {
        throw new AlreadyExistsError("Email or username already in use");
      }
      throw new ApolloError("Something went wrong");
    }
  }

  @Mutation(() => User, { nullable: true })
  async login(@Arg("input") loginInput: LoginInput, @Ctx() ctx: MyContext): Promise<User | null> {
    const userRepository = ctx.em.getRepository(User);

    const user = await userRepository.findOne({ email: loginInput.email });
    if (!user) throw new ForbiddenError("Incorrect login");

    const isValidPassword = await argon2.verify(user.passwordHash, loginInput.password);
    if (!isValidPassword) throw new ForbiddenError("Incorrect login");

    ctx.req.session.userId = user.id;

    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    if (!ctx.req.session.userId) return false;
    await new Promise((r) => ctx.req.session.destroy(r));
    return true;
  }

  @Mutation(() => User)
  async updateMe(@Arg("input") input: UpdateMeInput, @Ctx() ctx: MyContext): Promise<User> {
    if (!ctx.req.session.userId) throw new AuthenticationError("Not authenticated");

    const userRepository = ctx.em.getRepository(User);

    const user = await userRepository.findOne({ id: ctx.req.session.userId });
    if (!user) throw new ForbiddenError("User not found");

    const isValidPassword = await argon2.verify(user.passwordHash, input.currentPassword);
    if (!isValidPassword) throw new ForbiddenError("Incorrect login");

    if (input.email) user.email = input.email;
    if (input.username) user.username = input.username;

    try {
      await userRepository.persistAndFlush(user);

      return user;
    } catch (err: any) {
      if (err.code === PostgresError.UNIQUE_VIOLATION) {
        throw new AlreadyExistsError("New email or username already in use");
      }
      throw new ApolloError("Something went wrong");
    }
  }
}
