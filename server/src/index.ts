import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";

import config from "./utils/config";
import { typeDefs, resolvers } from "./schemas";

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
const server = new ApolloServer({
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
  });

  console.log(`🚀  Server ready at: ${url}`);
};

void start();
