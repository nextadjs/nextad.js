import type { Ad } from "@/core/ads/ad";
import type { IAdDeliveryController } from "@/types";
import { renderer } from "@nextad/renderer";

export class AdDeliveryController implements IAdDeliveryController {
  public async serve(adSlot: HTMLDivElement, ad: Ad): Promise<void> {
    renderer.render(adSlot, ad.creative);
  }
}
