import { v4 } from "uuid";
import { BaseEntity, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity({ tableName: "users" })
export class User extends BaseEntity<User, "id"> {
  @Field()
  @PrimaryKey({ columnType: "uuid" })
  public id: string = v4();

  @Field()
  @Property({ unique: true, columnType: "text" })
  public username!: string;

  @Field()
  @Property({ unique: true, columnType: "text" })
  public email!: string;

  @Property({ columnType: "text" })
  public passwordHash!: string;
}
