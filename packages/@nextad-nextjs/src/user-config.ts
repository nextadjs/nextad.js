import type { Runtime } from "@nextad/registry";

export function defineConfig(config: UserConfig): UserConfig {
  return config;
}

export interface UserConfig {
  mode?: "development" | "production";
  data?: {
    providers?: Record<string, SignalUserConfig>;
  };
  optimization?: {
    providers?: Record<string, SignalUserConfig>;
  };
  safety?: {
    providers?: Record<string, ComplianceUserConfig>;
  };
  monetization?: {
    providers?: Record<string, BuyerUserConfig>;
  };
}

export interface SignalUserConfig {
  runtime?: Runtime;
  params: any;
}

export interface ComplianceUserConfig {
  runtime?: Runtime;
  params: any;
}

export interface BuyerUserConfig {
  runtime?: Runtime;
  params: any;
}
