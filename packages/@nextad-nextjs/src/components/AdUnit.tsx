"use client";

import React, { useEffect } from "react";
import { NextAd } from "nextad";
import { config } from "@/config";

// 適切なサイズ設定考える
type Size = [300, 250];

export type AdProps = {
  sizes: Size[];
  loading: React.ReactNode;
};

export const AdUnit = ({ sizes }: AdProps) => {
  // const nextad = new NextAd(config);

  useEffect(() => {
    const serve = async () => {
      /*
      const adMap = await nextad.prepare([
        {
          tagid: "hello, world!",
          display: {
            w: 300,
            h: 250,
          },
        },  
      ]);

      const target = document.getElementById("ad-unit") as HTMLDivElement;
      if (ad) {
        nextad.displayAd(target, ad);
      }*/
    };
    serve();
  }, []);   
  

  return (
    
    <div
      id="ad-unit"
      style={{
        width: sizes[0][0],
        height: sizes[0][1],
        backgroundColor: "black",
      }}
    ></div>
  );
};
