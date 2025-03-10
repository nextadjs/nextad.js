import type {
  Buyer,
  ClientSignal,
  Compliance,
  Context,
  Runtime,
  ServerSignal,
} from "@nextad/registry";

export interface IConfig {
  // TODO: Buyerの実装
  // 同じメソッド名で実装してるのは、コントローラー側でランタイムの分岐処理を行いたくないから
  getSignals(
    runtime: Runtime,
    context: Context
  ): Promise<ClientSignal<unknown, any>[] | ServerSignal<unknown, any>[]>;

  getBuyers(runtime: Runtime, context: Context): Promise<Buyer<any>[]>;

  getCompliances(
    runtime: Runtime,
    context: Context
  ): Promise<Compliance<any>[]>;

  loadMeasurements(runtime: Runtime, context: Context): Promise<void>;

  getContext(): Context;
}
