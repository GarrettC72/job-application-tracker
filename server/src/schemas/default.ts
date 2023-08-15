import gql from 'graphql-tag';

export const typeDef = gql`
  type Query {
    _empty: Boolean
  }
  type Mutation {
    _empty: Boolean
  }
`;
