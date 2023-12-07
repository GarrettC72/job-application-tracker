import { GraphQLScalarType, Kind } from "graphql";
import gql from "graphql-tag";

import { Resolvers } from "../__generated__/resolvers-types";

export const typeDef = gql`
  scalar Date
`;

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime();
    }
    throw Error("GraphQL Date Scalar serializer expected a `Date` object");
  },
  parseValue(value) {
    if (typeof value === "number") {
      return new Date(value);
    }
    if (typeof value === "string" && Boolean(Date.parse(value))) {
      return new Date(value);
    }
    throw new Error(
      "GraphQL Date Scalar parser expected a `number` or properly formatted `string`"
    );
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

export const resolvers: Resolvers = {
  Date: dateScalar,
};
