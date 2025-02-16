import type { TradeableSpot } from "@/core/market/tradeable-spot";
import type { TradingStrategy } from "@/core/trading-strategies/trading-strategy";
import type { Ad, Config } from "@/types";

export class BuyingController {
  constructor(private readonly config: Config) {}

  public async evaluate(
    tradeableSpot: TradeableSpot,
    tradingStrategy: TradingStrategy
  ): Promise<Ad> {
    return tradingStrategy.decide(tradeableSpot);
  }
}
