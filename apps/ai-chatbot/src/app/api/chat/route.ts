import { openai } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    model: openai('gpt-3.5-turbo'),
    system: 'You are a helpful assistant.',
    messages,
  });

  console.log(result);

  return result.toDataStreamResponse();
}