import type { AdCOMPlacement, Context } from "@nextad/registry";
import type { Ad } from "./core/ads/ad";
import { AdTradeController } from "./controllers/ad-trade-controller";
import { Config } from "./core/config";
import type { IConfig, UserConfig } from "./types";
import { AdOpportunityController } from "./controllers/ad-opportunity-controller";
import { AdExchangeController } from "./controllers/ad-exchange-controller";
import { AdExchangeStrategyFactory } from "./core/ad-exchange-strategies/ad-exchange-strategy-factory";
import { AdDeliveryController } from "./controllers/ad-delivery-controller";
import { AdMatchingController } from "./controllers/ad-maching-controller";
import { AdRenderingController } from "./controllers/ad-rendering-controller";
import type { AdSpot } from "./core/ad-spot";

export class NextAd {
  private config: IConfig;

  public constructor(userConfig: UserConfig) {
    this.config = new Config(userConfig);
  }

  public async prepareAd(placements: AdCOMPlacement[]): Promise<Map<AdSpot, Ad>> {
    const adOpportunityController = new AdOpportunityController(this.config);
    const adExchangeController = new AdExchangeController(this.config);
    const adMatchingController = new AdMatchingController(this.config);
    const adExchangeStrategyFactory = new AdExchangeStrategyFactory(
      this.config
    );
    const adTradeController = new AdTradeController(
      this.config,
      adOpportunityController,
      adExchangeController,
      adMatchingController,
      adExchangeStrategyFactory
    );

    return await adTradeController.execute(placements);
  }

  public async displayAd(targetElement: HTMLDivElement, adSpot: AdSpot, ad: Ad) {
    // これ、adSlotの命名をtargetElementにしつつ、この中でAdSlot化してdeliveryに渡す機構ありかも
    // TODO
    const adRenderingController = new AdRenderingController();
    const adDeliveryController = new AdDeliveryController(
      this.config,
      adRenderingController
    );
    return adDeliveryController.serve(targetElement, adSpot, ad);
  }
}
