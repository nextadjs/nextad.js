import type {
  BuyerUserConfig,
  ComplianceUserConfig,
  Context,
  SignalUserConfig,
} from "@nextad/registry";

export interface UserConfig {
  context: Context;
  data?: {
    providers?: Record<string, SignalUserConfig<any>>;
  };
  optimization?: {
    providers?: Record<string, SignalUserConfig<any>>;
  };
  safety?: {
    providers?: Record<string, ComplianceUserConfig<any>>;
  };
  monetization?: {
    providers?: Record<string, BuyerUserConfig<any>>;
  };
}
