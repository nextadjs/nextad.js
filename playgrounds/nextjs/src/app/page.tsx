import {
  AdUnit,
  NativeAdDescription,
  NativeAdTitle,
  NativeAdUnit,
} from "@nextad/nextjs/components";

export default function Home() {
  return (
    <div>
      <AdUnit sizes={[[300, 250]]} loading={'a'} />
      <div>Native Ad:</div>
      <NativeAdUnit>
        <NativeAdTitle className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
          Loading...
        </NativeAdTitle>
        <NativeAdDescription className="text-white/80 text-lg leading-relaxed mb-4">
          Loading...
        </NativeAdDescription>
        <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors duration-200">
          Lean More
        </button>
      </NativeAdUnit>
    </div>
  );
}
