import type { Config, TradingMethod } from "@/types";
import type { TradingStrategy } from "./trading-strategy";
import { isServer } from "@/utils/validate";
import { OpenRTBStrategyForClient } from "./openrtb-strategy-for-client";

export class TradingStrategyFactory {
  public create(method: TradingMethod, config: Config): TradingStrategy {
    // TODO: SERVER strategy
    if (method === "OpenRTB") {
      if (!isServer()) {
        return new OpenRTBStrategyForClient(config);
      }
    }

    throw new Error("TODO");
  }
}
