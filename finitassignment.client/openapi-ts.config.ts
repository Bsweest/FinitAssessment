import { defineConfig, defaultPlugins } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:5132/swagger/v1/swagger.json",
  output: "src/client",
  plugins: [
    ...defaultPlugins,
    {
      name: "@hey-api/client-fetch",
      baseUrl: false,
    },
    {
      name: "@hey-api/transformers",
      dates: true,
    },
    {
      name: "@hey-api/sdk",
      transformer: true,
    },
    {
      name: "@hey-api/typescript",
      enums: "javascript",
    },
  ],
});
