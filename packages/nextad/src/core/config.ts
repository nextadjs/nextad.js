import type { IConfig, UserConfig } from "@/types";
import { getSuccessfulResults } from "@/utils/promise";
import {
  type Runtime,
  type Signal,
  signalRegistry,
  type Context,
  ClientSignal,
  ServerSignal,
  ClientCompliance,
  ServerCompliance,
  complianceRegistry,
  type Compliance,
  type Buyer,
  buyerRegistry,
} from "@nextad/registry";

export class Config implements IConfig {
  private constructor(private userConfig: UserConfig) {}

  // 実装
  public async getSignals(
    runtime: Runtime,
    context: Context
  ): Promise<ClientSignal<unknown, any>[] | ServerSignal<unknown, any>[]> {
    const signalConfig = {
      ...this.userConfig?.optimization?.providers,
      ...this.userConfig?.data?.providers,
    };

    const signalSettledResult = await Promise.allSettled(
      Object.keys(signalConfig).map(async (name) => {
        if (runtime === "client") {
          return await signalRegistry.loadForClient(
            name,
            signalConfig[name],
            context
          );
        } else if (runtime === "server") {
          return await signalRegistry.loadForServer(
            name,
            signalConfig[name],
            context
          );
        }

        throw new Error("Invalid runtime specified");
      })
    );

    return getSuccessfulResults<
      ClientSignal<unknown, any> | ServerSignal<unknown, any>
    >(signalSettledResult);
  }

  public async getCompliances(
    runtime: Runtime,
    context: Context
  ): Promise<Compliance<any>[]> {
    const complianceConfig = {
      ...this.userConfig?.safety?.providers,
    };

    const complianceSettledResult = await Promise.allSettled(
      Object.keys(complianceConfig).map(async (name) => {
        if (runtime === "client") {
          return await complianceRegistry.loadForClient(
            name,
            complianceConfig[name],
            context
          );
        } else if (runtime === "server") {
          return await complianceRegistry.loadForServer(
            name,
            complianceConfig[name],
            context
          );
        }

        throw new Error("Invalid runtime specified");
      })
    );

    return getSuccessfulResults<ClientCompliance<any> | ServerCompliance<any>>(
      complianceSettledResult
    );
  }

  public async getBuyers(
    runtime: Runtime,
    context: Context
  ): Promise<Buyer<any>[]> {
    const buyerConfig = {
      ...this.userConfig?.monetization?.providers,
    };

    const buyerSettledResult = await Promise.allSettled(
      Object.keys(buyerConfig).map(async (name) => {
        if (runtime === "client") {
          return await buyerRegistry.loadForClient(
            name,
            buyerConfig[name],
            context
          );
        } else if (runtime === "server") {
          return await buyerRegistry.loadForServer(
            name,
            buyerConfig[name],
            context
          );
        }

        throw new Error("Invalid runtime specified");
      })
    );

    return getSuccessfulResults<Buyer<any>>(
      buyerSettledResult
    );
  }

  public getContext(): Context {
    return this.userConfig.context;
  }
}
