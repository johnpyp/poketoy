import "reflect-metadata";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { altairExpress } from "altair-express-middleware";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { MikroORM } from "@mikro-orm/core";
import ormConfig from "./orm.config";
import { MyContext } from "./my-context";

const isProd = process.env.NODE_ENV === "production";

const RedisStore = connectRedis(session);
const redisClient = new Redis();

async function main() {
  const orm = await MikroORM.init(ormConfig);

  const migrator = orm.getMigrator();
  await migrator.up();

  const app = express();
  const httpServer = http.createServer(app);

  app.use(
    session({
      name: "qid",
      secret: "verykoolpassword",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: "auto", sameSite: "lax", httpOnly: isProd },
      store: new RedisStore({ client: redisClient }),
    }),
  );

  app.use(
    "/altair",
    altairExpress({
      endpointURL: "/graphql",
      subscriptionsEndpoint: `ws://localhost:4000/subscriptions`,
      initialQuery: `{ getData { id name surname } }`,
    }),
  );

  const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
    resolvers: [UserResolver],
    validate: false,
  });
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req, res }) => {
      return {
        req,
        res,
        em: orm.em.fork(),
      } as MyContext;
    },
  });
  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      origin: ["http://localhost:3101", "https://studio.apollographql.com"],
      credentials: true,
    },
  });

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, () => resolve(true)));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

main().catch(console.error);
