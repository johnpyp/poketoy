import { Migration } from "@mikro-orm/migrations";

export class Migration20211010212224 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "users" ("id" uuid not null, "username" text not null, "email" text not null, "password_hash" text not null);',
    );
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');
    this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
  }
}
