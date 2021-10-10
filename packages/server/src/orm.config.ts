import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";
import path from "path";

// eslint-disable-next-line import/no-default-export
export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    tableName: "migrations",
    // Necessary for production, otherwise migrations script won't pick up on .js-ext migrations
    pattern: /^[\w-]+\d+\.(js|ts)$/,
    transactional: true,
  },
  tsNode: process.env.NODE_DEV === "production" ? true : false,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  dbName: "poketoy",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  entities: [User],
  type: "postgresql",
  debug: true,
} as Parameters<typeof MikroORM.init>[0];
