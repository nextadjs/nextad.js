import { AdSlot } from "@/core/ad-slot";
import type { Ad } from "@/core/ads/ad";
import type { IAdDeliveryController, IAdRenderingController, IConfig } from "@/types";
import { renderer } from "@nextad/renderer";

export class AdDeliveryController implements IAdDeliveryController {
  public constructor(private config: IConfig, private adRenderingController: IAdRenderingController) {}

  public async serve(targetElement: HTMLDivElement, ad: Ad): Promise<void> {
    const adSlot = new AdSlot(targetElement, ad);

    this.adRenderingController.render(adSlot);
  }
}
