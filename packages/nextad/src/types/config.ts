import type {
  Buyer,
  BuyerUserConfig,
  ClientSignal,
  Compliance,
  ComplianceUserConfig,
  Context,
  Runtime,
  ServerSignal,
  SignalUserConfig,
} from "@nextad/registry";

export interface IConfig {
  // TODO: Buyerの実装
  // 同じメソッド名で実装してるのは、コントローラー側でランタイムの分岐処理を行いたくないから
  getSignals(
    runtime: Runtime,
    context: Context
  ): Promise<ClientSignal<unknown, any>[] | ServerSignal<unknown, any>[]>;

  getBuyers(
    runtime: Runtime,
    context: Context
  ): Promise<Buyer<any>[]>;

  getCompliances(
    runtime: Runtime,
    context: Context
  ): Promise<Compliance<any>[]>;

  getContext(): Context;
}

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
