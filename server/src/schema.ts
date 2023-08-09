// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type User {
    id: ID!
    email: String!
    passwordHash: String!
    firstName: String!
    lastName: String!
    verified: Boolean!
  }

  type Token {
    value: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }

  type Mutation {
    createUser(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
    ): User
    verifyUser(
      token: String!
    ): User
    resendVerification(
      token: String!
    ): User
    login(
      email: String!
      password: String!
    ): Token
  }
`;

export default typeDefs;
