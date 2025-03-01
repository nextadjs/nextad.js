import type { AdCOMAd, TradeMethod, V26Bid } from "@nextad/registry";
import { Ad } from "./ad";
import type { AdSpot } from "../ad-spot";

export class OpenRTBv26Ad extends Ad {
  public readonly tradeMethod: TradeMethod = "OpenRTB v2.6";
  private bid: V26Bid;

  // OpenRTB固有の情報。。。
  public constructor(adSpot: AdSpot, creative: AdCOMAd, bid: V26Bid) {
    super(adSpot, creative);
    this.bid = bid;
  }
}
