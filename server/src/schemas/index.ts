import { makeExecutableSchema } from "@graphql-tools/schema";

import { typeDef as Default } from "./default";
import { typeDef as User, resolvers as userResolvers } from "./user";
import { typeDef as Login, resolvers as loginResolvers } from "./login";
import { typeDef as Date, resolvers as dateResolvers } from "./date";
import { typeDef as Job, resolvers as jobResolvers } from "./job";
import {
  typeDef as ActivityType,
  resolvers as activityTypeResolvers,
} from "./activityType";

const typeDefs = [Default, User, Login, Date, Job, ActivityType];
const resolvers = [
  userResolvers,
  loginResolvers,
  dateResolvers,
  jobResolvers,
  activityTypeResolvers,
];
const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
