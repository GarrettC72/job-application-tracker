import { makeExecutableSchema } from "@graphql-tools/schema";

import { typeDef as Default } from "./default.js";
import { typeDef as User, resolvers as userResolvers } from "./user.js";
import { typeDef as Login, resolvers as loginResolvers } from "./login.js";
import { typeDef as Date, resolvers as dateResolvers } from "./date.js";
import { typeDef as Job, resolvers as jobResolvers } from "./job.js";
import {
  typeDef as ActivityType,
  resolvers as activityTypeResolvers,
} from "./activityType.js";

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
