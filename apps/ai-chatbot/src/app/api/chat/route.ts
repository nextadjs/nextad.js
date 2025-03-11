import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-latest'),
    system: ` ユーザーの質問に回答してください。回答の最後に、関連するトピックを<topics>タグで囲んで含めてください。
    例: <topics>AI,チャットボット,プログラミング</topics>
    トピックは3〜5個程度、カンマ区切りで指定してください。挨拶などのトピックを含めなくていいと判断した場合はトピックを含めないでください。
    このタグはユーザーには表示されません。必ず回答の一番最後にタグを配置してください。`,
    messages,
  });

  return result.toDataStreamResponse();
}  