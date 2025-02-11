import { processDataServer } from "@/adapters/server";
import { DataDisplay } from "./DataDisplay";
import { DataProcessor } from "./DataProcessor";

export default async function DataPage() {
    const serverResult = await processDataServer();
    
    return (
      <div>
        <h1 className="text-xl">Data Processing Page</h1>
        
        {/* サーバーの結果を表示するサーバーコンポーネント */}
        <DataDisplay serverResult={serverResult} />
        
        {/* クライアントコンポーネントにサーバーの結果を渡す */}
        <DataProcessor initialServerResult={serverResult} />
      </div>
    );
  }