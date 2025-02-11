"use client";
import { useState } from "react";
import { processDataClient } from "@/adapters/client";

interface Props {
  initialServerResult: { server: boolean };
}

export function DataProcessor({ initialServerResult }: Props) {
  const [clientResult, setClientResult] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchServerUpdate = async () => {
    try {
      const response = await fetch("data/api");
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Error fetching server data:", error);
      return null;
    }
  };

  const handleClientProcess = async () => {
    setIsLoading(true);
    try {
      const clientData = await processDataClient();
      setClientResult(clientData.server);

      const serverUpdate = await fetchServerUpdate();
      console.log(serverUpdate);
    } catch (error) {
      console.error("Error processing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border m-4 p-4">
      <h2 className="text-lg mb-2">Interactive Data Processing</h2>
      <p>Initial Server Result: {initialServerResult.server ? 'server' : 'client'}</p>

      <button onClick={handleClientProcess} disabled={isLoading} className="bg-black text-white p-4">
        {isLoading ? "Processing..." : "Process Data"}
      </button>

      {clientResult !== null && <p>Client Processed Result: {clientResult? 'server' : 'client'}</p>}
    </div>
  );
}
