import { allSettledWithTimeout, getSuccessfulResults } from "@/utils/promise";
import { Ad } from "../ads/ad";
import type { AdSpot } from "../ad-spot";
import { AdExchangeStrategy } from "./ad-exchange-strategy";
import { bidRequester } from "@nextad/openrtb/bid-requester";
import { BidRequestBuilder } from "@nextad/openrtb/builder/v26";
import type { Buyer } from "@nextad/registry";
import { uuid } from "@/utils";
import { OpenRTBv26Ad } from "../ads/openrtb-v26-ad";
import { V26BidToAdConverter } from "@openrtb/converter";

export class OpenRTBv26Strategy extends AdExchangeStrategy {
  public async execute(adSpots: AdSpot[]): Promise<Ad[]> {
    // 全てのadSpotに共通したbuyerのみを抽出
    const allBuyers = adSpots.reduce<Buyer<any>[]>((acc, adSpot) => {
      return acc.concat(adSpot.buyers);
    }, []);

    const commonBuyers = allBuyers.filter((buyer) => {
      return adSpots.every((adSpot) => adSpot.buyers.some((b) => b === buyer));
    }) as Buyer<any>[];

    const adSpotImpMap: Map<string, string> = new Map();

    // bidRequestは共通のまま、impだけ複数の広告スポットに対応
    const settledBidResponses = await allSettledWithTimeout(
      commonBuyers.map(async (buyer) => {
        // 各buyerごとの処理
        const buyerContextHandler = buyer.handleOpenRTBv26();
        const requestConfig = buyerContextHandler.configureRequest();
        const bidRequest = new BidRequestBuilder();

        // 各adSpotをimpに追加
        // adSpot.idに対して複数のimp.idを紐づけるようにする !!!
        for (let adSpot of adSpots) {
          // ここでadcomからbidに変換するのはライブラリ通したい bid <-> adcom
          // マルチフォーマットに対応していないバイヤーは一つ一つ分ける
          const impId = uuid();
          adSpotImpMap.set(impId, adSpot.id);
          bidRequest.addImp({
            id: impId,
          });
        }

        return await bidRequester.requestV26(
          requestConfig.url,
          bidRequest.build(),
          {
            cache: requestConfig.cache,
            // 入札リクエスター、移動完了したらここ仕様に合わせて変更する
          }
        );
      }),
      10000
    );

    // さっき抽出したbuyer以外の処理を独自に入札リクエストする

    for (let adSpot of adSpots) {
      const uniqueBuyers = adSpot.buyers.filter(
        (buyer) => !commonBuyers.some((b) => b === buyer)
      );

      // ここで独自の入札リクエスト構築
    }

    // 入札情報どしよ。。。
    // 取引方法が増えてくること考えたら明示的に規格もしくは方法で定義したい
    // とりえあず、広告を抽象定義した
    const bidResponses = getSuccessfulResults(settledBidResponses);

    const ads = bidResponses.flatMap((bidResponse) => {
      return (bidResponse.seatbid||[]).flatMap((seatBid) => {
        return seatBid.bid.map((bid) => {
          // これどうする？
          const adSpotId = adSpotImpMap.get(bid.impid);
          const adSpot = adSpots.find((adSpot) => adSpot.id === adSpotId) as AdSpot;
          const converter = new V26BidToAdConverter();
          const creative = converter.to(bid);

          return new OpenRTBv26Ad(adSpot, creative, bid); 
        });
      });
    });

    return ads;
  }
}
