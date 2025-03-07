import type { Ad } from "@/core/ads/ad";
import type { AdExchangeStrategy } from "@/core/ad-exchange-strategies";
import type { AdSpot } from "@/core/ad-spot";
import type { IConfig, IAdExchangeController } from "@/types";

export class AdExchangeController implements IAdExchangeController {
  constructor(private readonly config: IConfig) {}

  public async execute(
    adSpots: AdSpot[],
    adExchangeStrategy: AdExchangeStrategy
  ): Promise<Map<AdSpot, Ad[]>> {
    const adsMap = await adExchangeStrategy.execute(adSpots);
    return adsMap;
  }
}
