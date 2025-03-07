import type { AdSlot } from "@/core/ad-slot";
import type { IAdRenderingController } from "@/types";
import { renderer } from "@nextad/renderer";

export class AdRenderingController implements IAdRenderingController {
  public async render(adSlot: AdSlot): Promise<void> {
    await renderer.render(adSlot.element, adSlot.ad.creative);
  }
}
