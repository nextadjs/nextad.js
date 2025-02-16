import type { AdSpot } from "@/core/opportunity/ad-spot";
import type { Ad, Config } from "@/types";
import { MarketController } from "./market-controller";
import { TradingStrategyFactory } from "@/core/trading-strategies/trading-strategy-factory";
import { BuyingController } from "./buying-controller";

export class MarketCycleController {
  constructor(private readonly config: Config) {}

  public async startCycle(adSpot: AdSpot): Promise<Ad> {
    // TODO: 設定で並列や直接等のカスタマイズ可能にしたい
    // TODO: PMP関係のサポート
    const marketController = new MarketController(this.config);
    const buyingController = new BuyingController(this.config);
    const tradingStrategyFactory = new TradingStrategyFactory();

    const tradingStrategy = tradingStrategyFactory.create("OpenRTB", this.config);
    const tradeableSpot = await marketController.offer(adSpot, tradingStrategy);
    console.log('TradeableSpot:', tradeableSpot);
    return buyingController.evaluate(tradeableSpot, tradingStrategy);
  }
}
