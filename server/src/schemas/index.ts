// import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDef as Default } from "./default";
import { typeDef as User, resolvers as userResolvers } from "./user";
import { typeDef as Login, resolvers as loginResolvers } from "./login";
import { typeDef as Date, resolvers as dateResolvers } from "./date";
import { typeDef as Job, resolvers as jobResolvers } from "./job";

// export const schema = makeExecutableSchema({
//   typeDefs: [Default, User, Login, Date],
//   resolvers: [userResolvers, loginResolvers, dateScalar],
// });

export const typeDefs = [Default, User, Login, Date, Job];
export const resolvers = [
  userResolvers,
  loginResolvers,
  dateResolvers,
  jobResolvers,
];

// export default schema;
