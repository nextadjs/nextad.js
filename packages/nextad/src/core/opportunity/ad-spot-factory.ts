import { AdSpot } from "./ad-spot";
import type { Placement } from "iab-adcom/placement";
import type { Context } from "iab-adcom/context";
import { BidRequestBuilder } from "@nextad/openrtb/builder/v26";
import type { Options } from "@/types";

export class AdSpotFactory {
  public create(
    placement: Placement,
    context: Context,
    options?: Options
  ): AdSpot {
    // TODO* id, impを評価段階で生成するようにする
    // TODO: これたぶんOpenRTB関係の処理をドメインロジックとして分離できる
    const bidRequestBuilder = new BidRequestBuilder();

    if (context.site) {
      bidRequestBuilder.withSite({
        domain: context.site.domain,
      });
    }

    // これビルダー作ったかいあった
    bidRequestBuilder.withCommonImp({
      tagid: placement.tagid,
    });

    console.log("Placement:", placement);

    if (placement?.display) {
      bidRequestBuilder.addImp({
        banner: {
          w: placement.display.w,
          h: placement.display.h,
          format: placement.display.displayfmt?.map((displayFormat) => ({
            w: displayFormat.w,
            h: displayFormat.h,
            wratio: displayFormat.wratio,
            hratio: displayFormat.hratio,
          })),
        },
      });
    }

    // TODO: ネイティブ対応
    // TODO: ネイティブのadcom -> openrtb (native-ad)変換方法、rendererで作ってあるからライブラリ化して共通化する
    /*
    if (placement?.display?.nativefmt) {
        bidRequestBuilder.addImp({
            native: {
                ver: '1.2',

            }
        });
    }*/

    if (options?.test) {
      bidRequestBuilder.withTest(1);
    }

    const bidRequest = bidRequestBuilder.build();

    console.log("BidRequest:", bidRequest);

    return new AdSpot(placement, context, {
      openrtb: {
        v26: bidRequest,
      },
    });
  }
}
