import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/schemas/*.ts",
  generates: {
    "./src/__generated__/resolvers-types.ts": {
      config: {
        useIndexSignature: true,
        contextType: "../types#MyContext",
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};
export default config;
