import type { Buyer } from "@nextad/registry";
import type { RequestDetails, V26BidRequest } from "@nextad/registry";
import type { AdCOM } from "iab-adcom";

export type Ad = ClientAd | ServerAd;

export interface ClientAd extends BaseAd {
  type: "client";
}

export interface ServerAd extends BaseAd {
  type: "server";
}

export interface BaseAd extends AdCOM.Media.Ad {
  tagId: string;
};

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
