import type { AdCOMPlacement, Context } from "@nextad/registry";
import type { Ad } from "./core/ads/ad";
import { AdTradeController } from "./controllers/ad-trade-controller";
import { Config } from "./core/config";
import type { IConfig, UserConfig } from "./types";
import { AdOpportunityController } from "./controllers/ad-opportunity-controller";
import { AdExchangeController } from "./controllers/ad-exchange-controller";
import { AdExchangeStrategyFactory } from "./core/ad-exchange-strategies/ad-exchange-strategy-factory";
import { AdDeliveryController } from "./controllers/ad-delivery-controller";

export class NextAd {
  private config: IConfig;

  public constructor(userConfig: UserConfig) {
    this.config = new Config(userConfig);
  }

  public async prepareAd(placements: AdCOMPlacement[]): Promise<Ad> {
    const adOpportunityController = new AdOpportunityController(this.config);
    const adExchangeController = new AdExchangeController(this.config);
    const adExchangeStrategyFactory = new AdExchangeStrategyFactory(
      this.config
    );
    const adTradeController = new AdTradeController(
      this.config,
      adOpportunityController,
      adExchangeController,
      adExchangeStrategyFactory
    );

    return adTradeController.execute(placements);
  }

  public async displayAd(adSlot: HTMLDivElement, ad: Ad) {
    // これ、adSlotの命名をtargetElementにしつつ、この中でAdSlot化してdeliveryに渡す機構ありかも
    // TODO
    const adDeliveryController = new AdDeliveryController(this.config);
    return adDeliveryController.serve(adSlot, ad);
  }
}
