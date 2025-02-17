import type { Ad, TradeableBuyer } from "@/types";
import { TradeableSpot } from "../market/tradeable-spot";
import type { AdSpot } from "../opportunity/ad-spot";
import { TradingStrategy } from "./trading-strategy";
import type {
  Buyer,
  RequestDetails,
  V26BidRequest,
  V26BidResponse,
  V26Imp,
} from "@nextad/registry";
import { bidRequester } from "@nextad/openrtb/bid-requester";
import { getSuccessfulResults } from "@/utils/promise";
import { generateUUID } from "@/utils/generate";
import { renderer } from "@nextad/renderer";

export class OpenRTBStrategyForClient extends TradingStrategy {
  public async prepare(
    adSpot: AdSpot,
    buyers: Buyer[]
  ): Promise<TradeableSpot> {
    const tradeableBuyersSettledResult = await Promise.allSettled(
      buyers.map(async (buyer) => {
        const bidRequest = adSpot.getOpenRTBEvaluation().v26;
        bidRequest.at = 2;

        // TODO: signal処理
        // TODO: compliance処理
        // TODO: decorate処理

        const params =
          this.config.trade?.providers![buyer.config.name].params || {};

        const decoratedBidRequest =
          (await buyer.spec.openrtb?.v26.decorateBidRequest(
            bidRequest,
            params,
            adSpot.context
          )) as V26BidRequest;

        decoratedBidRequest.imp = getSuccessfulResults(
          await Promise.allSettled(
            decoratedBidRequest.imp.map(async (imp) => {
              return await buyer.spec.openrtb?.v26.decorateImpression(
                imp,
                params,
                adSpot.context
              );
            })
          )
        );

        return {
          buyer: buyer,
          tradeInfo: {
            openrtb: {
              v26: {
                request:
                  buyer.spec.openrtb?.v26.configureRequestDetails(
                    params,
                    adSpot.context
                  ) || ({} as RequestDetails),
                bidRequest: decoratedBidRequest,
              },
            },
          },
        };
      })
    );

    const tradeableBuyers = getSuccessfulResults<TradeableBuyer>(
      tradeableBuyersSettledResult
    );

    return new TradeableSpot(adSpot, tradeableBuyers);
  }

  public async decide(tradeableSpot: TradeableSpot): Promise<Ad> {
    const bidResponsesSettledResult = await Promise.allSettled(
      tradeableSpot.tradeableBuyers.map((tradeableBuyer) => {
        return bidRequester.requestV26(
          tradeableBuyer.tradeInfo.openrtb.v26.request.url,
          tradeableBuyer.tradeInfo.openrtb.v26.bidRequest,
          {
            cache: tradeableBuyer.tradeInfo.openrtb.v26.request.cache,
            // TODO* 他にもヘッダーとか リファクタリングの際にいい感じに整えてくれ
          }
        );
      })
    );

    console.log("bidResponsesSettled", bidResponsesSettledResult);

    const bidResponses = getSuccessfulResults<V26BidResponse>(
      bidResponsesSettledResult
    );

    // TODO: オークション処理とか。そういえばオークションライブラリ側で入札レスポンス配置消しちゃったから再構成しなきゃ
    // いまは~1個目！

    const bid = bidResponses[0].seatbid![0].bid[0];
    const ad = renderer.fromOpenRTB2Bid(bid);

    return {
      runtime: "client",
      tagId: tradeableSpot.adSpot.placement.tagid,
      source: ad,
    };
  }
}
