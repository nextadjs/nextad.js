import type { AdCOMAd, TradeMethod } from "@nextad/registry";
import type { AdSpot } from "../ad-spot";

export abstract class Ad {
  public abstract readonly tradeMethod: TradeMethod;
  protected readonly adSpot: AdSpot;
  public readonly creative: AdCOMAd;

  public constructor(adSpot: AdSpot, creative: AdCOMAd) {
    this.adSpot = adSpot;
    this.creative = creative;
  }
}
