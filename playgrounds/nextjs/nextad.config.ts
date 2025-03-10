import { defineConfig } from "@nextad/nextjs";

export default defineConfig({
  monetization: {
    providers: {
      michao: {
        params: {
          site: 1,
          placement: "test",
        },
      },
    },
  },
});
