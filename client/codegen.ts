import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
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
        avoidOptionals: {
          field: true,
          inputValue: false,
        },
        defaultScalarType: "unknown",
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
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
        useTypeImports: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
