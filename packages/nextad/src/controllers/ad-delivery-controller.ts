import { AdSlot } from "@/core/ad-slot";
import type { AdSpot } from "@/core/ad-spot";
import type { Ad } from "@/core/ads/ad";
import type { IAdDeliveryController, IAdRenderingController, IConfig } from "@/types";

export class AdDeliveryController implements IAdDeliveryController {
  public constructor(private config: IConfig, private adRenderingController: IAdRenderingController) {}

  public async serve(targetElement: HTMLDivElement, adSpot: AdSpot, ad: Ad): Promise<void> {
    if (adSpot.id !== ad.adSpotId) {
      throw new Error('');
    }

    const adSlot = new AdSlot(targetElement, ad);

    this.adRenderingController.render(adSlot);
  }
}
