import type { TradeMethod } from "@nextad/registry";
import type { AdExchangeStrategy } from "./ad-exchange-strategy";
import { OpenRTBv26Strategy } from "./openrtb-v26-strategy";
import type { IConfig } from "@/types";

export class AdExchangeStrategyFactory {
  constructor(protected readonly config: IConfig) {}

  public create(method: TradeMethod): AdExchangeStrategy {
    if (method === "OpenRTB v2.6") {
      return new OpenRTBv26Strategy(this.config);
    }

    throw new Error('Invalid trade method specified');
  }
}
