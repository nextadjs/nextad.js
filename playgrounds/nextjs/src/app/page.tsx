import { Ad } from "@nextad/nextjs";

export default function Home() {
  return (
    <div>
      <Ad 
        sizes={[[300, 250]]}
      />
    </div>
  );
}
