import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { typeDefs, resolvers } from "./schemas";
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

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const start = async () => {
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: config.PORT },
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.startsWith("Bearer ")) {
        const decodedToken = jwt.verify(auth.substring(7), config.SECRET);
        let loginToken;
        try {
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
        return { currentUser };
      }

      return {};
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

void start();
