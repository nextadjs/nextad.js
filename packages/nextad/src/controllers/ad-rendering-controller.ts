import type { AdSlot } from "@/core/ad-slot";
import type { AdRenderingOptions, IAdRenderingController } from "@/types";
import { renderer } from "@nextad/renderer";

export class AdRenderingController implements IAdRenderingController {
  public async render(
    adSlot: AdSlot,
    options: AdRenderingOptions
  ): Promise<void> {
    if (adSlot.ad.creative.display?.native) {
      await renderer.renderNative(
        adSlot.element,
        adSlot.ad.creative,
        options.adTemplate || '' // ここら辺の処理忘れずに
      );
    } else {
      await renderer.render(adSlot.element, adSlot.ad.creative);
    }
  }
}
