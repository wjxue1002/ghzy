
import React, { useState, useRef, useEffect } from 'react';
import { getAiExplanation } from '../services/geminiService';
import { SimulationState, Message } from '../types';

interface Props {
  state: SimulationState;
  onResponse?: (text: string) => void;
}

const AiAssistant: React.FC<Props> = ({ state, onResponse }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '欢迎来到光合作用实验室！调整滑块观察植物的变化，或者问我关于这些参数是如何影响生长的。' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getAiExplanation(state, input);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
    
    if (onResponse) {
      onResponse(response);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-green-100 flex flex-col h-[500px]">
      <div className="p-4 border-b border-green-50 bg-green-50/50 rounded-t-xl">
        <h3 className="text-sm font-bold text-green-800 flex items-center gap-2">
          🤖 AI 科学顾问
        </h3>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl animate-pulse text-gray-400 text-sm">
              正在思考科学奥秘...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-50 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="提问，例如：为什么温度太高效率会下降？"
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 shadow-sm"
        >
          🚀
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;
