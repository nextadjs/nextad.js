"use client";

import { Message as AIMessage, useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Tag, SendHorizontal } from "lucide-react";
import {
  NativeAdDescription,
  NativeAdLink,
  NativeAdTitle,
  NativeAdUnit,
} from "@nextad/nextjs/components";
import clsx from "clsx";

// メインコンポーネント
export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages
            .filter((m) => m.role !== "system")
            .map((message) => (
              <Message key={message.id} message={message} />
            ))}
        </div>
      </div>

      <div className="border-t bg-white p-4 border-gray-200">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              name="prompt"
              value={input}
              onChange={handleInputChange}
              className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-4"
              placeholder="メッセージを入力..."
            />
            <button
              type="submit"
              className="flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer"
            >
              送信
              <SendHorizontal className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const AdComponent = ({ id, topics }: { id: string; topics: string[] }) => {
  return (
    <NativeAdUnit
      id={id}
      className={clsx(
        "relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 my-6"
      )}
      topics={topics}
    >
      <div className="absolute -top-2 left-4 px-2 py-1 bg-blue-100 rounded-full flex items-center">
        <Sparkles className="w-3 h-3 text-blue-600 mr-1" />
        <span className="text-xs text-blue-600">広告</span>
      </div>

      <div className="mt-2 space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Tag className="w-6 h-6 text-blue-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">
              {topics[0]}
              <NativeAdTitle />
            </div>
            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
              <NativeAdDescription />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">スポンサード</span>
              <NativeAdLink className="inline-flex items-center text-xs text-blue-600">
                詳細を見る
              </NativeAdLink>
            </div>
          </div>
        </div>
      </div>
    </NativeAdUnit>
  );
};

export const Message = ({ message }: { message: AIMessage }) => {
  // 表示するコンテンツとトピックを状態として保持
  const [displayContent, setDisplayContent] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([]);
  const [isProcessingTags, setIsProcessingTags] = useState<boolean>(false);
  const processedContentRef = useRef<string>("");
  const bufferedTagContentRef = useRef<string>("");

  // 新しいメッセージが来るたびにリセット
  useEffect(() => {
    if (message.role === "user") {
      setDisplayContent(message.content);
      setTopics([]);
      setIsProcessingTags(false);
      processedContentRef.current = "";
      bufferedTagContentRef.current = "";
    }
  }, [message.id, message.role, message.content]);

  // メッセージ内容の更新を監視して、タグを検出・処理
  useEffect(() => {
    if (message.role !== "assistant") return;

    const currentContent = message.content;
    const alreadyProcessed = processedContentRef.current;

    // 新しく追加されたコンテンツを取得
    const newContent = currentContent.slice(alreadyProcessed.length);

    if (!newContent && !isProcessingTags) {
      // 新しいコンテンツがない場合はスキップ
      return;
    }

    if (isProcessingTags) {
      // タグ処理中の場合
      bufferedTagContentRef.current += newContent;

      // 終了タグを検索
      if (bufferedTagContentRef.current.includes("</topics>")) {
        // トピックタグの抽出
        const fullTagContent = bufferedTagContentRef.current;
        const endTagIndex =
          fullTagContent.indexOf("</topics>") + "</topics>".length;
        const completeTag = fullTagContent.substring(0, endTagIndex);

        // トピックの抽出
        const topicMatch = completeTag.match(/<topics>(.*?)<\/topics>/);
        if (topicMatch && topicMatch[1]) {
          const extractedTopics = topicMatch[1].split(",").map((t) => t.trim());
          setTopics(extractedTopics);
        }

        // タグ処理の終了
        setIsProcessingTags(false);
        processedContentRef.current =
          alreadyProcessed + fullTagContent.substring(endTagIndex);
        setDisplayContent(processedContentRef.current);
        bufferedTagContentRef.current = "";
      }
    } else {
      // 通常処理中
      const startTagIndex = newContent.indexOf("<topics>");

      if (startTagIndex !== -1) {
        // タグの開始を検出
        const contentBeforeTag = newContent.substring(0, startTagIndex);
        const contentAfterTagStart = newContent.substring(startTagIndex);

        // タグ前のコンテンツを表示に追加
        processedContentRef.current = alreadyProcessed + contentBeforeTag;
        setDisplayContent(processedContentRef.current);

        // タグ処理モードを開始
        setIsProcessingTags(true);
        bufferedTagContentRef.current = contentAfterTagStart;

        // 同じチャンク内に終了タグがあるか確認
        if (bufferedTagContentRef.current.includes("</topics>")) {
          // 終了タグも見つかった場合は、即座に処理
          const endTagIndex =
            bufferedTagContentRef.current.indexOf("</topics>") +
            "</topics>".length;
          const completeTag = bufferedTagContentRef.current.substring(
            0,
            endTagIndex
          );

          // トピックの抽出
          const topicMatch = completeTag.match(/<topics>(.*?)<\/topics>/);
          if (topicMatch && topicMatch[1]) {
            const extractedTopics = topicMatch[1]
              .split(",")
              .map((t) => t.trim());
            setTopics(extractedTopics);
          }

          // タグ処理の終了
          setIsProcessingTags(false);
          processedContentRef.current =
            processedContentRef.current +
            bufferedTagContentRef.current.substring(endTagIndex);
          setDisplayContent(processedContentRef.current);
          bufferedTagContentRef.current = "";
        }
      } else {
        // タグが見つからなければ、そのまま表示に追加
        processedContentRef.current = alreadyProcessed + newContent;
        setDisplayContent(processedContentRef.current);
      }
    }
  }, [message.content, message.role, isProcessingTags]);

  return (
    <div key={message.id}>
      {/* メッセージ表示 */}
      <div
        className={`space-y-2 ${
          message.role === "user" ? "flex justify-end" : ""
        }`}
      >
        <div
          className={`${
            message.role === "user"
              ? "bg-blue-100 rounded-lg p-3 max-w-[80%] hover"
              : "bg-white rounded-lg p-4 shadow-sm max-w-[80%]"
          }`}
        >
          {displayContent}
        </div>

        {/* AIの回答の後にはトピックタグを表示 */}
        {message.role === "assistant" && topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {topics.map((topic, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                <Tag className="w-3 h-3 mr-1" />
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {message.role === "assistant" && topics.length > 0 && (
        <AdComponent id={message.id} topics={topics} />
      )}
    </div>
  );
};
