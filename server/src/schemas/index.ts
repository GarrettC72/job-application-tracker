import { makeExecutableSchema } from "@graphql-tools/schema";

import { typeDef as Default } from "./default";
import { typeDef as User, resolvers as userResolvers } from "./user";
import { typeDef as Login, resolvers as loginResolvers } from "./login";
import { typeDef as Date, resolvers as dateResolvers } from "./date";
import { typeDef as Job, resolvers as jobResolvers } from "./job";

const typeDefs = [Default, User, Login, Date, Job];
const resolvers = [userResolvers, loginResolvers, dateResolvers, jobResolvers];
const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
