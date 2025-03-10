"use client";

import { loadConfigForClient } from "@/actions/load-config-for-client";
import clsx from "clsx";
import type { AssetFormat } from "iab-adcom/placement";
import { NextAd } from "nextad";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// コンテキストの型定義
type Asset = Record<string, number>;

type NativeAdContextType = {
  registerAsset: (type: string) => number;
  isLoading: boolean;
};

// コンテキスト作成
const NativeAdContext = React.createContext<NativeAdContextType | null>(null);

// ========== NativeAdUnit コンポーネント ==========
interface NativeAdUnitProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  loading?: React.ReactNode;
}

const NativeAdUnitComponent = ({
  id,
  children,
  className,
  loading,
}: NativeAdUnitProps) => {
  const assets = useRef<Asset>({});
  const idCounter = useRef(1);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adContainer, setAdContainer] = useState<HTMLDivElement | null>(null);
  const childrenRef = useRef(children);

  // 子コンポーネントの更新を反映
  useEffect(() => {
    childrenRef.current = children;
  }, [children]);

  // アセット登録関数をメモ化
  const registerAsset = useCallback((type: string) => {
    if (!assets.current[type]) {
      assets.current[type] = idCounter.current++;
    }
    return assets.current[type];
  }, []);

  // コンテキスト値をメモ化
  const contextValue = useMemo(
    () => ({
      registerAsset,
      isLoading,
    }),
    [registerAsset, isLoading]
  );

  // 子コンポーネントをHTMLとして取得する関数 - 以前の方式に近い実装
  const captureChildrenAsHtml = useCallback(() => {
    // このコンポーネントのDOMにある非表示の子要素コンテナを探す
    const hiddenContainer = document.getElementById(`${id}-hidden-children`);
    
    if (!hiddenContainer) {
      console.warn('Hidden children container not found');
      return '';
    }
    
    // hiddenContainerの子要素を取得して処理
    const htmlString = Array.from(hiddenContainer.children)
      .map(child => processNode(child as Element, assets.current))
      .join('');
    
    return htmlString;
  }, [id]);

  // 広告読み込み処理
  const loadAd = useCallback(async () => {
    if (!adContainer) return;

    try {
      setIsLoading(true);
      
      // 子コンポーネントからHTMLを生成
      const htmlString = captureChildrenAsHtml();
      console.log("Generated HTML:", htmlString);
      
      const config = await loadConfigForClient();

      config.context = {
        channel: "site",
        source: {
          site: {
            domain: window.location.hostname,
          },
        },
      };

      const nextad = new NextAd(config);
      const adMap = await nextad.prepare([
        {
          tagid: "hello world!",
          display: {
            nativefmt: {
              asset: Object.entries(assets.current).map(([asset, id]) => {
                let generatedAsset: AssetFormat = {
                  id: id,
                  req: 1,
                };

                if (asset === "title") {
                  generatedAsset = {
                    ...generatedAsset,
                    title: {
                      len: 50,
                    },
                  };
                }

                if (asset === "description") {
                  generatedAsset = {
                    ...generatedAsset,
                    data: {
                      type: 2,
                    },
                  };
                }

                return generatedAsset;
              }),
            },
          },
        },
      ]);

      console.log("adMap:", adMap);

      if (adContainer && adMap.size > 0) {
        adMap.forEach((ad, adSpot) => {
          console.log(adContainer);
          nextad.displayAd(adContainer, adSpot, ad, {
            adTemplate: htmlString,
          });
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading ad:", error);
      setIsLoading(false);
    }
  }, [adContainer, captureChildrenAsHtml]);

  // マウント時に広告コンテナを作成
  useEffect(() => {
    const container = document.createElement('div');
    container.id = id;
    container.className = clsx(className);
    
    document.getElementById(`${id}-placeholder`)?.insertAdjacentElement('afterend', container);
    setAdContainer(container);
    
    return () => {
      // クリーンアップ
      container.remove();
    };
  }, [id, className]);

  // アセットが登録された後に広告を読み込む
  useEffect(() => {
    // コンポーネントがレンダリングされ、コンテナが準備できたら広告を読み込む
    if (adContainer && !isReady) {
      // DOMが確実に描画された後に処理を実行するため、requestAnimationFrameを使用
      // 最初のrAFはレンダリング前、2つ目のrAFはレンダリング後に実行される
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // さらに少し待機して子コンポーネントのDOMが完全に描画されるのを確実にする
          setTimeout(() => {
            setIsReady(true);
            loadAd();
          }, 50);
        });
      });
      
      return () => {
        // クリーンアップはsetTimeoutをキャンセルする必要がある場合に実装
      };
    }
  }, [adContainer, isReady, loadAd]);

  return (
    <NativeAdContext.Provider value={contextValue}>
      {isLoading && loading}
      <div id={`${id}-placeholder`}></div>
      {/* 子コンポーネントは描画されるが、見えない場所に */}
      <div id={`${id}-hidden-children`} style={{ 
        position: 'absolute', 
        visibility: 'hidden',
        pointerEvents: 'none',
        width: '0',
        height: '0',
        overflow: 'hidden',
        opacity: 0
      }}>
        {children}
      </div>
    </NativeAdContext.Provider>
  );
};

// メモ化したNativeAdUnitをエクスポート
export const NativeAdUnit = React.memo(NativeAdUnitComponent);

// ========== NativeAdTitle コンポーネント ==========
interface NativeAdComponentProps {
  children?: React.ReactNode;
  className?: string;
  loading?: React.ReactNode;
}

const NativeAdTitleComponent: React.FC<NativeAdComponentProps> = ({
  children,
  className,
  loading,
}) => {
  const context = useContext(NativeAdContext);

  if (!context) {
    console.warn("NativeAdTitle must be used within a NativeAdUnit");
    return null;
  }

  const id = context.registerAsset("title");
  const { isLoading } = context;

  return (
    <div
      className={clsx("nextadjs-native-title", className)}
      data-asset-type="title"
    >
      {isLoading && loading ? loading : children}
    </div>
  );
};

// メモ化したNativeAdTitleをエクスポート
export const NativeAdTitle = React.memo(NativeAdTitleComponent);

// ========== NativeAdDescription コンポーネント ==========
const NativeAdDescriptionComponent: React.FC<NativeAdComponentProps> = ({
  children,
  className,
  loading,
}) => {
  const context = useContext(NativeAdContext);

  if (!context) {
    console.warn("NativeAdDescription must be used within a NativeAdUnit");
    return null;
  }

  const id = context.registerAsset("description");
  const { isLoading } = context;

  return (
    <div
      className={clsx("nextadjs-native-description", className)}
      data-asset-type="description"
    >
      {isLoading && loading ? loading : children}
    </div>
  );
};

// メモ化したNativeAdDescriptionをエクスポート
export const NativeAdDescription = React.memo(NativeAdDescriptionComponent);

// ========== NativeAdImage コンポーネント ==========
interface NativeAdImageProps extends NativeAdComponentProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
}

const NativeAdImageComponent: React.FC<NativeAdImageProps> = ({
  src,
  alt,
  className,
  loading,
  width,
  height,
}) => {
  const context = useContext(NativeAdContext);

  if (!context) {
    console.warn("NativeAdImage must be used within a NativeAdUnit");
    return null;
  }

  const id = context.registerAsset("image");
  const { isLoading } = context;

  return (
    <div
      className={clsx("nextadjs-native-image", className)}
      data-asset-type="image"
    >
      {isLoading && loading ? (
        loading
      ) : (
        <img src={src} alt={alt} width={width} height={height} />
      )}
    </div>
  );
};

// メモ化したNativeAdImageをエクスポート
export const NativeAdImage = React.memo(NativeAdImageComponent);

// ========== ユーティリティ関数 ==========
// HTML処理関数
const processNode = (node: Element, assets: Asset): string => {
  let html = "";
  const assetType = node.getAttribute("data-asset-type");

  // 開始タグを作成
  html += `<${node.tagName.toLowerCase()}`;

  // 属性を追加
  Array.from(node.attributes).forEach((attr) => {
    if (attr.name !== "data-reactroot") { // React固有の属性は除外
      html += ` ${attr.name}="${attr.value}"`;
    }
  });
  html += ">";

  if (assetType && assets[assetType]) {
    // アセットIDを挿入
    html += `##hb_native_asset_id_${assets[assetType]}##`;
  } else {
    // 子要素を再帰的に処理
    Array.from(node.children).forEach((child) => {
      html += processNode(child as Element, assets);
    });

    // テキストノードを処理
    if (
      node.childNodes.length === 0 ||
      (node.childNodes.length === 1 &&
        node.firstChild?.nodeType === Node.TEXT_NODE)
    ) {
      html += node.textContent || "";
    }
  }

  // 終了タグを追加
  html += `</${node.tagName.toLowerCase()}>`;

  return html;
};