import type {
  BuyerUserConfig,
  ComplianceUserConfig,
  Context,
  MeasurementUserConfig,
  SignalUserConfig,
} from "@nextad/registry";

export interface UserConfig {
  mode: 'development' | 'production';
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
  analytics?: {
    providers?: Record<string, MeasurementUserConfig<any>>;
  };
}