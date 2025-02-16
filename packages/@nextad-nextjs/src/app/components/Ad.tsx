"use client";
import React, { useEffect } from "react";
import { test } from "../actions/test";
import { NextAd } from "nextad";

// 適切なサイズ設定考える
type Size = [300, 250];

export type AdProps = {
  sizes: Size[];
};

export const Ad = ({ sizes }: AdProps) => {
  const nextad = new NextAd({
    trade: {
      providers: {
        example: {
          params: {
            siteId: 1,
            placement: "inbanner",
          },
        },
      },
    },
  });

  useEffect(() => {
    const serve = async () => {
      const ad = await nextad.prepareAd(
        {
          tagid: "hello, world!",
          display: {
            w: 300,
            h: 250,
          },
        },
        {
          site: {
            domain: "example.com",
          },
        },
        {
          test: true,
        }
      );

      const target = document.getElementById("ad-unit") as HTMLDivElement;
      if (ad) {
        nextad.displayAd(target, ad);
      }
    };
    serve();
  }, []);

  const config = {
    providers: [
      {
        example: {
          siteId: "1",
          placementId: "1",
        },
      },
    ],
  };

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
