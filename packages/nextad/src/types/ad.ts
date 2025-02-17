import type { Buyer, Runtime } from "@nextad/registry";
import type { RequestDetails, V26BidRequest } from "@nextad/registry";
import type { AdCOMAd } from "@nextad/registry";

export type Ad = ClientAd | ServerAd;

export interface ClientAd extends BaseAd {
  runtime: "client";
}

export interface ServerAd extends BaseAd {
  runtime: "server";
}

export interface BaseAd {
  runtime: Runtime;
  tagId: string;
  source: AdCOMAd;
}

export type TradingMethod = "OpenRTB";

export type TradeInfo = {
  openrtb: {
    v26: {
      request: RequestDetails;
      bidRequest: V26BidRequest;
    };
  };
};

export type TradeableBuyer = {
  buyer: Buyer;
  tradeInfo: TradeInfo;
};
