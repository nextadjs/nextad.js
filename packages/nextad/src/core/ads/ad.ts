import type { AdCOMAd, TradeMethod } from "@nextad/registry";
import type { AdSpot } from "../ad-spot";
import type { Price, PriceModel } from "@/types";

export abstract class Ad {
  public abstract readonly tradeMethod: TradeMethod;
  public readonly adSpotId: string;
  public readonly creative: AdCOMAd;
  public price: Price;

  public constructor(adSpotId: string, creative: AdCOMAd, price: Price) {
    this.adSpotId = adSpotId;
    this.creative = creative;
    this.price = price;
  }
}
