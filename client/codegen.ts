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
        fragmentMasking: false,
      },
      config: {
        enumsAsTypes: true,
        scalars: {
          Date: {
            input: "string | number",
            output: "number",
          },
        },
        inlineFragmentTypes: "mask",
        customDirectives: {
          apolloUnmask: true,
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
