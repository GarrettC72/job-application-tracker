// import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDef as Default } from './default';
import { typeDef as User, resolvers as userResolvers } from './user';
import { typeDef as Login, resolvers as loginResolvers } from './login';

// const schema = makeExecutableSchema({
//   typeDefs: [Default, User, Login],
//   resolvers: [userResolvers, loginResolvers],
// });

export const typeDefs = [Default, User, Login];
export const resolvers = [userResolvers, loginResolvers];

// export default schema;
