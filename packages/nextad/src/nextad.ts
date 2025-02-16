import type { Placement } from "iab-adcom/placement";
import type {
  Config,
  Ad,
  Options,
} from "./types";
import type { Context } from "iab-adcom/context";
import { AdOpportunityController } from "./controllers/ad-opportunity-controller";
import { MarketCycleController } from "./controllers/market-cycle-controller";
import { DeliveryController } from "./controllers/delivery-controller";

export class NextAd {
  public constructor(private readonly config: Config) {}

  public async prepareAd(
    placement: Placement,
    context: Context,
    options?: Options
  ): Promise<Ad | void> {
    const adOpportunityController = new AdOpportunityController(this.config);
    const marketCycleController = new MarketCycleController(this.config);

    const adSpot = await adOpportunityController.evaluate(placement, context, options);
    console.log('AdSpot:', adSpot);

    const ad = await marketCycleController.startCycle(adSpot);
    console.log('Ad:', ad);
    return ad;
  }

  // Native Ad
  // in-stream video
  // out-stream video
  // full screen video
  // multi format
  // floating
  // 色々考えたけど、最初は普通のAdUnitだけでいいと思う (GAMに倣って)
  // nativeも必要

  public async displayAd(targetElement: HTMLDivElement, ad: Ad) {
    const deliveryController = new DeliveryController(this.config);
    deliveryController.serve(targetElement, ad);
  }
}
