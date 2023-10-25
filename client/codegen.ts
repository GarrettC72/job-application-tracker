import { CodegenConfig } from "@graphql-codegen/cli";
import { loadEnv } from "vite";

const env = loadEnv("production", process.cwd());
const VITE_API_URL = env.VITE_API_URL || "http://localhost:4000/graphql";

const config: CodegenConfig = {
  schema: VITE_API_URL,
  documents: ["src/**/!(*.d).{ts,tsx}"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
