import type { AdCOMAd, TradeMethod, V26Bid } from "@nextad/registry";
import { Ad } from "./ad";

export class OpenRTBv26Ad extends Ad {
  public readonly tradeMethod: TradeMethod = "OpenRTB v2.6";
  public readonly bid: V26Bid;
  public price: {
    value: number;
    model: "cpm";
  };

  // OpenRTB固有の情報。。。
  public constructor(adSpotId: string, creative: AdCOMAd, bid: V26Bid) {
    const price = {
      value: bid.price,
      model: "cpm" as const,
    };
    super(adSpotId, creative, price);
    this.bid = bid;
    this.price = price;
  }
}
