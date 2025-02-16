import type { Ad, Config } from "@/types";
import type { TradeableSpot } from "../market/tradeable-spot";
import type { AdSpot } from "../opportunity/ad-spot";
import type { Buyer } from "@nextad/registry";

export abstract class TradingStrategy {
  constructor(protected readonly config: Config) {}

  public abstract prepare(adSpot: AdSpot, buyers: Buyer[]): Promise<TradeableSpot>;
  public abstract decide(tradeableSpot: TradeableSpot): Promise<Ad>;
}
