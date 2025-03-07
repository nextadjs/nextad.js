import type { AdSlot } from "@/core/ad-slot";
import { AdSpot } from "@/core/ad-spot";
import type { Ad } from "@/core/ads/ad";
import type { IAdMatchingController, IConfig } from "@/types";

export class AdMatchingController implements IAdMatchingController {
  constructor(private readonly config: IConfig) {}

  public async match(adsMap: Map<AdSpot, Ad[]>): Promise<Map<AdSpot, Ad>> {
    const adMap = new Map<AdSpot, Ad>();

    adsMap.forEach((ads, adSpot) => {
      // マッチング処理
      adMap.set(adSpot, ads[0]!);
    });

    return adMap;
  }
}
