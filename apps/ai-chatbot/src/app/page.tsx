'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';
import { Sparkles, Tag, ChevronRight, X, SendHorizontal } from 'lucide-react';

// 広告コンポーネント
const AdComponent = ({ topics, onClose }: { topics: string[], onClose: () => void }) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 my-6">
      <div className="absolute -top-2 left-4 px-2 py-1 bg-blue-100 rounded-full flex items-center">
        <Sparkles className="w-3 h-3 text-blue-600 mr-1" />
        <span className="text-xs text-blue-600">広告</span>
      </div>
      
      <div className="mt-2 space-y-4">
        {/* 広告コンテンツ */}
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <Tag className="w-6 h-6 text-blue-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm">{topics[0]}実践コース</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {topics.slice(0, 2).join('と')}を学ぶための実践的なオンライン講座
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">スポンサード</span>
              <button className="inline-flex items-center text-xs text-blue-600">
                詳細を見る
                <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 関連コース */}
        <div className="flex gap-3 overflow-x-auto pb-2 mt-2">
          {topics.slice(0, 2).map((topic, i) => (
            <div key={i} className="flex-shrink-0 w-48 bg-white rounded-lg p-3">
              <h4 className="text-xs font-medium">{topic}コース</h4>
              <p className="text-xs text-gray-500 mt-1">
                初心者から上級者まで対応
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 会話からトピックを抽出する関数（実際にはAIが行う）
const extractTopics = (): string[] => {
  return ['プログラミング', 'オンライン学習', 'IT技術'];
};

// メインコンポーネント
export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({});
  const [showAd, setShowAd] = useState(false);
  const [adPosition, setAdPosition] = useState(0);
  const [topics, setTopics] = useState(['プログラミング', 'オンライン学習', 'IT技術']);

  // 会話の進行に応じて広告を表示するロジック
  useEffect(() => {
    if (messages.length > 0 && messages.length % 4 === 0 && messages.length !== adPosition) {
      // 会話が進むごとにトピックを更新
      const extractedTopics = extractTopics();
      if (extractedTopics.length > 0) {
        setTopics(extractedTopics);
      }
      
      setShowAd(true);
      setAdPosition(messages.length);
    }
  }, [messages, adPosition]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div key={message.id}>
              {/* メッセージ表示 */}
              <div className={`space-y-2 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <div 
                  className={`${
                    message.role === 'user' 
                      ? 'bg-blue-100 rounded-lg p-3 max-w-[80%] hover' 
                      : 'bg-white rounded-lg p-4 shadow-sm max-w-[80%]'
                  }`}
                >
                  {message.content}
                </div>
                
                {/* AIの回答の後にはトピックタグを表示 */}
                {message.role === 'assistant' && (
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
              
                <AdComponent 
                  topics={topics} 
                  onClose={() => setShowAd(false)} 
                />
            </div>
          ))}
        </div>
      </div>

      {/* 入力フォーム */}
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
              <SendHorizontal className='w-5 h-5' />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}