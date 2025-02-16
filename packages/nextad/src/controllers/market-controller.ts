import { TradeableSpot } from "@/core/market/tradeable-spot";
import type { AdSpot } from "@/core/opportunity/ad-spot";
import type { TradingStrategy } from "@/core/trading-strategies/trading-strategy";
import type { Config } from "@/types";
import { getContext } from "@/utils";
import { getSuccessfulResults } from "@/utils/promise";
import { Buyer, buyerRegistry } from "@nextad/registry";

export class MarketController {
  constructor(private readonly config: Config) {}

  public async offer(adSpot: AdSpot, tradingStrategy: TradingStrategy): Promise<TradeableSpot> {
    const buyerConfig = {
      ...this.config?.trade?.providers,
    };

    const buyerSettledResult = await Promise.allSettled(
      Object.keys(buyerConfig).map(async (name) => {
        const buyer = await buyerRegistry.load(
          name,
          getContext()
        );
        return buyer;
      })
    );

    const buyers = getSuccessfulResults<Buyer>(buyerSettledResult);

    return tradingStrategy.prepare(adSpot, buyers);
  }
}
