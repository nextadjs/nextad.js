import {
  NativeAdDescription,
  NativeAdTitle,
  NativeAdUnit,
} from "@nextad/nextjs/components";

export default function Home() {
  return (
    <div>
      <div>Native Ad:</div>
      <NativeAdUnit id="native-ad" className="bg-black" loading="aaa">
        <NativeAdTitle className="text-2xl font-bold text-white mb-3 flex items-center gap-2" />
        <NativeAdDescription className="text-white/80 text-lg leading-relaxed mb-4" />
      </NativeAdUnit>
    </div>
  );
}
