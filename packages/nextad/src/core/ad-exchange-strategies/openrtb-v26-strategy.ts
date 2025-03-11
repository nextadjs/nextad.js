import type {
  Buyer,
  ContextWithSite,
  V26Bid,
  V26BidRequest,
  V26BidResponse,
  V26Imp,
} from "@nextad/registry";
import type { AdSpot } from "../ad-spot";
import type { Ad } from "../ads/ad";
import { AdExchangeStrategy } from "./ad-exchange-strategy";
import { allSettledWithTimeout, getSuccessfulResults } from "@/utils/promise";
import { BidRequestBuilder } from "@nextad/openrtb/builder/v26";
import { bidRequester } from "@nextad/openrtb/bid-requester";
import { deepCopy, uuid } from "@/utils";
import {
  V26BidToAdConverter,
  V12NativeRequestToNativeFormatConverter,
} from "@openrtb/converter";
import { OpenRTBv26Ad } from "../ads/openrtb-v26-ad";

export class OpenRTBv26Strategy extends AdExchangeStrategy {
  private readonly REQUEST_TIMEOUT_MS = 10000;

  public async execute(adSpots: AdSpot[]): Promise<Map<AdSpot, Ad[]>> {
    const adSpotImpMap = new Map<string, string>();

    // 広告スポットに対する共通バイヤーと個別バイヤーの分離
    const { commonBuyers, uniqueBuyersByAdSpot } =
      this.categorizeBuyers(adSpots);

    // 共通バイヤーへの入札リクエスト
    const commonBidResponses = await this.requestBidsFromCommonBuyers(
      commonBuyers,
      adSpots,
      adSpotImpMap
    );

    // 個別バイヤーへの入札リクエスト (将来の実装のためのプレースホルダー)
    // const uniqueBidResponses = await this.requestBidsFromUniqueBuyers(uniqueBuyersByAdSpot);

    // 入札レスポンスからAdを生成
    const ads = this.convertBidResponsesToAds(
      commonBidResponses,
      adSpotImpMap,
      adSpots
    );

    console.log(commonBidResponses);

    // AdSpotごとにAdをグループ化
    const adSpotToAdsMap = new Map<AdSpot, Ad[]>();

    // 初期化: 各AdSpotに空の配列を設定
    adSpots.forEach((adSpot) => {
      adSpotToAdsMap.set(adSpot, []);
    });

    // 各Adを適切なAdSpotの配列に追加
    for (const ad of ads) {
      const adSpot = adSpots.find(
        (adSpot) => adSpot.id === ad.adSpotId
      ) as AdSpot;
      const adsForSpot = adSpotToAdsMap.get(adSpot) || [];
      adsForSpot.push(ad);
      adSpotToAdsMap.set(adSpot, adsForSpot);
    }

    return adSpotToAdsMap;
  }

  private categorizeBuyers(adSpots: AdSpot[]): {
    commonBuyers: Buyer<any>[];
    uniqueBuyersByAdSpot: Map<AdSpot, Buyer<any>[]>;
  } {
    // 全てのadSpotから集めたバイヤー
    const allBuyers = adSpots.reduce<Buyer<any>[]>(
      (acc, adSpot) => acc.concat(adSpot.buyers),
      []
    );

    // 全てのadSpotに共通のバイヤー
    const commonBuyers = allBuyers.filter((buyer) =>
      adSpots.every((adSpot) => adSpot.buyers.some((b) => b === buyer))
    );

    // 各adSpotに固有のバイヤー (共通バイヤー以外)
    const uniqueBuyersByAdSpot = new Map<AdSpot, Buyer<any>[]>();

    for (const adSpot of adSpots) {
      const uniqueBuyers = adSpot.buyers.filter(
        (buyer) => !commonBuyers.some((b) => b === buyer)
      );

      if (uniqueBuyers.length) {
        uniqueBuyersByAdSpot.set(adSpot, uniqueBuyers);
      }
    }

    return { commonBuyers, uniqueBuyersByAdSpot };
  }

  private async requestBidsFromCommonBuyers(
    commonBuyers: Buyer<any>[],
    adSpots: AdSpot[],
    adSpotImpMap: Map<string, string>
  ): Promise<V26BidResponse[]> {
    console.log(adSpots);
    const settledBidResponses = await allSettledWithTimeout(
      commonBuyers.map(async (buyer) => {
        return this.requestBidsFromBuyer(buyer, adSpots, adSpotImpMap);
      }),
      this.REQUEST_TIMEOUT_MS
    );

    console.log(settledBidResponses);

    // TODO: エラーハンドリング

    return getSuccessfulResults(settledBidResponses);
  }

  private async requestBidsFromUniqueBuyers(
    uniqueBuyersByAdSpot: Map<AdSpot, Buyer<any>[]>
  ): Promise<V26BidResponse[]> {
    // この部分は実装が必要です
    // 各AdSpotの固有バイヤーに個別にリクエストを送信
    return [];
  }

  private async requestBidsFromBuyer(
    buyer: Buyer<any>,
    adSpots: AdSpot[],
    adSpotImpMap: Map<string, string>
  ): Promise<V26BidResponse> {
    const buyerContextHandler = buyer.handleOpenRTBv26();
    const requestConfig = buyerContextHandler.configureRequest();
    let bidRequest = new BidRequestBuilder();

    // 一時的にサイトのみ
    const siteAdSpots = adSpots.filter(adSpot => {
      return adSpot.context.channel === 'site';
    });

    const context = siteAdSpots[0].context as ContextWithSite;

    bidRequest.withSite({
      domain: context.source.site.domain,
      kwarray: context.source.site.kwarray
    });

    // 各adSpotをimpに追加
    for (const adSpot of siteAdSpots) {
      const impId = uuid();
      adSpotImpMap.set(impId, adSpot.id);

      bidRequest.addImp(
        this.generateImp(
          impId,
          deepCopy(bidRequest.build() as V26BidRequest),
          adSpot,
          buyer
        )
      );
    }

    let buildedBidRequest = bidRequest.build();
    buildedBidRequest = buyerContextHandler.decorateBidRequest(
      deepCopy(buildedBidRequest)
    ) as V26BidRequest;

    return bidRequester.requestV26(requestConfig.url, buildedBidRequest, {
      cache: requestConfig.cache,
    });
  }

  private generateImp(
    impId: string,
    bidRequest: V26BidRequest,
    adSpot: AdSpot,
    buyer: Buyer<any>
  ): V26Imp {
    let imp: V26Imp = {
      id: impId,
    };

    // TODO: ここでマルチフォーマットの処理とか考慮とかしたい

    if (adSpot.placement.display?.nativefmt?.asset) {
      const converter = new V12NativeRequestToNativeFormatConverter();
      imp.native = {
        request: JSON.stringify(
          converter.from(adSpot.placement.display.nativefmt)
        ),
      };
    }

    const handler = buyer.handleOpenRTBv26();
    imp = handler.decorateImpression(deepCopy(imp), bidRequest);

    return imp;
  }

  private convertBidResponsesToAds(
    bidResponses: V26BidResponse[],
    adSpotImpMap: Map<string, string>,
    adSpots: AdSpot[]
  ): Ad[] {
    const converter = new V26BidToAdConverter();

    return bidResponses.flatMap((bidResponse) => {
      const seatbids = bidResponse.seatbid || [];

      return seatbids.flatMap((seatBid) => {
        return seatBid.bid.map((bid) => {
          return this.createAdFromBid(bid, adSpotImpMap, adSpots, converter);
        });
      });
    });
  }

  /**
   * 単一の入札からAdを生成する
   */
  private createAdFromBid(
    bid: V26Bid,
    adSpotImpMap: Map<string, string>,
    adSpots: AdSpot[],
    converter: V26BidToAdConverter
  ): Ad {
    const adSpotId = adSpotImpMap.get(bid.impid);
    if (!adSpotId) {
      throw new Error(`No AdSpot found for impression ID: ${bid.impid}`);
    }

    const adSpot = adSpots.find((spot) => spot.id === adSpotId);
    if (!adSpot) {
      throw new Error(`AdSpot not found with ID: ${adSpotId}`);
    }

    const creative = converter.to(bid);
    return new OpenRTBv26Ad(adSpot.id, creative, bid);
  }
}
