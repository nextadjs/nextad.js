"use client";

import { loadConfigForClient } from "@/actions/load-config-for-client";
import clsx from "clsx";
import type { AssetFormat } from "iab-adcom/placement";
import { NextAd } from "nextad";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const NativeAdContext = React.createContext<NativeAdContextType | null>(null);

type Asset = Record<string, number>;

type NativeAdContextType = {
  registerAsset: (type: string) => number;
};

interface NativeAdUnitProps {
  children: React.ReactNode;
}

export const NativeAdUnit = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const componentsRef = useRef<Record<string, React.ReactNode>>({});
  const assets = useRef<Asset>({});
  const idCounter = useRef(1);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const registerAsset = useCallback((type: string) => {
    console.log(type);
    if (!assets.current[type]) {
      assets.current[type] = idCounter.current++;
    }

    return assets.current[type];
  }, []);

  useEffect(() => {
    // すべてのコンポーネントが登録された後に入札処理を行う
    if (isReady || !containerRef.current) return;

    setIsReady(true);

    console.log("assets:", assets);

    const htmlString = Array.from(containerRef.current.children)
      .map((child) => processNode(child, assets.current))
      .join("");

    const loadAd = async () => {
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

      const target = document.getElementById("ad-unit") as HTMLDivElement;
      if (target && adMap.size > 0) {
        adMap.forEach((ad, adSpot) => {
          nextad.displayAd(target, adSpot, ad, {
            adTemplate: htmlString,
          });
        });
      }
    };

    loadAd();

    console.log("Generated HTML:", htmlString);

    //console.log("Generated HTML:", template);
  }, [containerRef]);

  return (
    <NativeAdContext.Provider value={{ registerAsset }}>
      <div
        className={clsx("border rounded p-4", className)}
        id="native-ad"
        ref={containerRef}
      >
        {children}
      </div>
    </NativeAdContext.Provider>
  );
};

export const NativeAdTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const context = useContext(NativeAdContext);

  const id = context?.registerAsset("title");
  console.log("title id:", id);

  return (
    <div
      className={clsx("nextadjs-native-title", className)}
      data-asset-type={"title"}
    >
      {children}
    </div>
  );
};

export const NativeAdDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const context = useContext(NativeAdContext);

  useEffect(() => {
    context?.registerAsset("description");
  }, []);

  return (
    <div
      className={clsx("nextadjs-native-description", className)}
      data-asset-type={"description"}
    >
      {children}
    </div>
  );
};

const Image: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const context = useContext(NativeAdContext);
  const element = <img src={src} alt={alt} />;

  useEffect(() => {
    context?.registerAsset("image");
  }, []);

  return <div className="mb-2">{element}</div>;
};

const processNode = (node: Element, assets: Asset): string => {
  let html = "";
  const assetType = node.getAttribute("data-asset-type");

  // 開始タグを作成
  html += `<${node.tagName.toLowerCase()}`;

  // 属性を追加
  Array.from(node.attributes).forEach((attr) => {
    html += ` ${attr.name}="${attr.value}"`;
  });
  html += ">";

  console.log(html);

  console.log(assetType);

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

const NestedAdComponent = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const assets = useRef<Asset>({
    type1: 1,
    type2: 2,
    // 必要なアセットタイプとIDのマッピング
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // HTML構造を文字列として取得
    const htmlString = Array.from(containerRef.current.children)
      .map((child) => processNode(child, assets.current))
      .join("");

    console.log("Generated HTML:", htmlString);

    // ここでhtmlStringを必要に応じて利用
  }, [children]);

  return <div ref={containerRef}>{children}</div>;
};
