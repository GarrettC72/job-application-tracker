import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "introspection.json",
  documents: ["src/**/!(*.d).{ts,tsx}"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: { unmaskFunctionName: "getFragmentData" },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
