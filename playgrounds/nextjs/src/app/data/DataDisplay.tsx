export function DataDisplay({ serverResult }: { serverResult: { server: boolean }}) {
  return (
    <div className="p-4 border m-4">
      <h2>Server Processed Result</h2>
      <p>{serverResult.server ? 'server' : 'client'}</p>
    </div>
  );
}
