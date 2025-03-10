import { TypeScriptLoader } from "cosmiconfig-typescript-loader";
import { cosmiconfig } from "cosmiconfig";
import type { UserConfig as Config } from "nextad";

const moduleName = "nextad";
const explorer = cosmiconfig(moduleName, {
  searchPlaces: [
    `${moduleName}.config.js`,
    `${moduleName}.config.ts`,
    `${moduleName}.config.cjs`,
  ],
  loaders: {
    ".ts": TypeScriptLoader(),
  },
});

export async function loadConfig(): Promise<Config> {
  try {
    console.log('aaa');
    const resolve = await explorer.search();
    console.log('aaaa');
    // デフォルト返してあげるといいかも
    // とりあえず動作見てみる
    console.log("config:", resolve);
    const config: Config = {
      ...defaultConfig,
      ...resolve?.config,
    };

    if (config?.monetization?.providers) {
      config.monetization.providers = Object.fromEntries(
        Object.entries(config.monetization.providers).map(
          ([name, provider]) => [
            name,
            {
              ...defaultBuyerUserConfig,
              ...provider,
            },
          ]
        )
      );
    }

    return config;
  } catch (error) {
    // error handling
    console.error("error:", error);
    throw error;
  }
}

const defaultConfig: Config = {
  mode: "development",
  context: {
    channel: "site",
    source: {
      site: {},
    },
  },
};

const defaultBuyerUserConfig = {
  runtime: "server",
};

export const config: Config = await loadConfig();
