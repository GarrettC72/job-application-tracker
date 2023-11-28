import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { GraphQLError } from "graphql";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import http from "http";
import path from "path";

import schema from "./schemas";
import { MyContext, TokenType } from "./types";
import { toToken } from "./utils/parser";
import config from "./utils/config";
import User from "./models/user";

mongoose.set("strictQuery", false);

console.log("Connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI ?? "")
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/subscriptions",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const landingPage =
    config.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault()
      : ApolloServerPluginLandingPageLocalDefault({
          embed: { endpointIsEditable: true },
        });

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        /* eslint-disable @typescript-eslint/require-await */
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      landingPage,
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.get("authorization") ?? null;
        const clientOrigin = req.get("origin") ?? "http://localhost:5173";
        if (auth && auth.startsWith("Bearer ")) {
          let decodedToken, loginToken;

          try {
            decodedToken = jwt.verify(auth.substring(7), config.SECRET);
            loginToken = toToken(decodedToken);
          } catch (error: unknown) {
            throw new GraphQLError("Invalid login token", {
              extensions: {
                code: "INVALID_TOKEN",
                invalidArgs: decodedToken,
                error,
              },
            });
          }

          if (loginToken.type !== TokenType.Login) {
            throw new GraphQLError("Invalid login token", {
              extensions: {
                code: "INVALID_TOKEN",
                invalidArgs: decodedToken,
              },
            });
          }

          const currentUser = await User.findById(loginToken.id);

          return { currentUser, clientOrigin };
        }

        return { clientOrigin };
      },
    })
  );

  if (config.NODE_ENV === "production") {
    app.use(express.static("dist"));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "..", "..", "dist", "index.html"));
    });
  }

  httpServer.listen(config.PORT, () =>
    console.log(`🚀  Server is now running on http://localhost:${config.PORT}`)
  );
};

void start();
