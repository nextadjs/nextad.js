import type { AdExchangeStrategyFactory } from "@/core/ad-exchange-strategies/ad-exchange-strategy-factory";
import type { AdSpot } from "@/core/ad-spot";
import type { Ad } from "@/core/ads/ad";
import type {
  IAdExchangeController,
  IAdMatchingController,
  IAdOpportunityController,
  IAdTradeController,
  IConfig,
} from "@/types";
import type { AdCOMPlacement } from "@nextad/registry";

export class AdTradeController implements IAdTradeController {
  public constructor(
    private config: IConfig,
    private adOpportunityController: IAdOpportunityController,
    private adExchangeController: IAdExchangeController,
    private adMatchingController: IAdMatchingController,
    private adExchangeStrategyFactory: AdExchangeStrategyFactory,
  ) {}

  public async execute(placements: AdCOMPlacement[]): Promise<Map<AdSpot, Ad>> {
    const adSpots = await this.adOpportunityController.evaluate(placements);   

    // ここで取引選択、取引戦略の最適化処理を行うべき

    // 今は直接OpenRTB v2.6選択
    const adExchangeStrategy =
      this.adExchangeStrategyFactory.create("OpenRTB v2.6");
    const ads = await this.adExchangeController.execute(
      adSpots,
      adExchangeStrategy
    );
    
    return await this.adMatchingController.match(ads);
  }
}
