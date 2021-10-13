import "reflect-metadata";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { MikroORM } from "@mikro-orm/core";
import { altairExpress } from "altair-express-middleware";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
import http from "http";
import Redis from "ioredis";
import { buildTypeDefsAndResolvers } from "type-graphql";

import { MyContext } from "./my-context";
import ormConfig from "./orm.config";
import { UserResolver } from "./resolvers/user";

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
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    },
  });

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, () => resolve(true)));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

main().catch(console.error);
