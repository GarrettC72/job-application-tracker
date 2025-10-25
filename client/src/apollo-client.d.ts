import { GraphQLCodegenDataMasking } from "@apollo/client/masking";

declare module "@apollo/client" {
  export type TypeOverrides = GraphQLCodegenDataMasking.TypeOverrides;
}
