"use client";
import React, { useEffect } from "react";
import { test } from "../actions/test";
import { bidderRegistry } from "@nextad/registry";

// 適切なサイズ設定考える
type Size = [300, 250];

export type AdProps = {
  sizes: Size[];
};

export const Ad = ({ sizes }: AdProps) => {
  useEffect(() => {
    const bid = async () => {
      console.log('hello!');
      const bidder = await bidderRegistry.load("example", "client");
      console.log(bidder.spec);
      console.log(bidder.spec.openrtb.v26.configureRequestDetails());
    };
    bid();
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
      style={{
        width: sizes[0][0],
        height: sizes[0][1],
        backgroundColor: "black",
      }}
    >
      ad
    </div>
  );
};
