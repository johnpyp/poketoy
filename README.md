# Poketoy

Pokemon collection builder

## Setup

This repo uses `pnpm` (rather than `yarn`), get it with `npm i -g pnpm`.

Then, `pnpm i` (short for `pnpm install`) to install deps for all workspaces.

### Client

Currently just a basic boilerplate for React.

The client uses [vite](https://vitejs.dev), which is a supa fast alternative to tools like create-react-app.

To start, on the default port:

1. `cd packages/client`
2. `yarn dev` or `yarn dev:client` from the root.

### Server

The server is a standard node + typescript project, and uses `ts-eager` to run the server in dev, and build's with normal `tsc` for prod.

Currently no code is written for the server.

1. `cd packages/server`
2. `cp .env.example .env`
3. `docker-compose -f dev.docker-compose.yml up -d`
4. `yarn dev` or `yarn dev:server` from the root.

5. Check out the GQL schema @ `localhost:4000/altair`

`apollo-server-core` & `apollo-server-express` are included, as that's the combination of dependencies we'll be using to setup our graphql server. See the Quick Start guide on this: https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express

[MikroORM](https://mikro-orm.io/) is our database ORM of choice, used with postgres.
