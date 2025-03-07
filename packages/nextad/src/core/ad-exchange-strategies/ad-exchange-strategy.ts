import type { IConfig } from "@/types";
import type { Ad } from "../ads/ad";
import type { AdSpot } from "../ad-spot";

export abstract class AdExchangeStrategy {
  constructor(protected readonly config: IConfig) {}

  public abstract execute(
    adSpots: AdSpot[],
  ): Promise<Map<AdSpot, Ad[]>>;
}
