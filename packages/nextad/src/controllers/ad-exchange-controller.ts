import type { Ad } from "@/core/ad";
import type { AdExchangeStrategy } from "@/core/ad-exchange-strategies";
import type { AdSpot } from "@/core/ad-spot";
import type { IConfig, IAdExchangeController } from "@/types";

export class AdExchangeController implements IAdExchangeController {
  constructor(private readonly config: IConfig) {}

  public async execute(
    adSpots: AdSpot[],
    adExchangeStrategy: AdExchangeStrategy
  ): Promise<Ad[]> {
    const ads = await adExchangeStrategy.execute(adSpots);
    return ads;
  }
}
