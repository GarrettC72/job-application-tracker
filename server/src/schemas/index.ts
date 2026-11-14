import { makeExecutableSchema } from "@graphql-tools/schema";

import { typeDef as Default } from "./default.ts";
import { typeDef as User, resolvers as userResolvers } from "./user.ts";
import { typeDef as Login, resolvers as loginResolvers } from "./login.ts";
import { typeDef as Date, resolvers as dateResolvers } from "./date.ts";
import { typeDef as Job, resolvers as jobResolvers } from "./job.ts";
import {
  typeDef as ActivityType,
  resolvers as activityTypeResolvers,
} from "./activityType.ts";

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
