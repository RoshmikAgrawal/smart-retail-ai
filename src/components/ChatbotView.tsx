import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  RefreshCw, 
  Layers, 
  BookOpen,
  User
} from 'lucide-react';
import { ChatMessage, FAQIntent } from '../types';

export const ChatbotView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'MSG-INIT',
      sender: 'bot',
      text: 'Hello! I am your AI Smart Retail Support Assistant. How can I help you today? Ask me about store hours, return policy, order status, or loyalty rewards!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intentTag: 'welcome_greeting',
      confidence: 1.0,
      source: 'rule_based_faq',
      category: 'Store Info',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [intentsList, setIntentsList] = useState<FAQIntent[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch('/api/intents')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setIntentsList(data.data);
      })
      .catch((err) => console.error('Failed to fetch intents dataset:', err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `USER-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const resData = await response.json();
      if (resData.success) {
        setMessages((prev) => [...prev, resData.data]);
      }
    } catch (error) {
      console.error('Chatbot endpoint error:', error);
      const fallbackMsg: ChatMessage = {
        id: `BOT-ERR-${Date.now()}`,
        sender: 'bot',
        text: 'Our store support team is available Mon-Sat 9am-9pm EST. How else can I assist you?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'rule_based_faq',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'What are your store hours today?',
    'What is your return policy?',
    'Where is my order #ORD-84920?',
    'How do I earn VIP loyalty points?',
    'Do you offer free shipping?',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>Chatbot Module (B3)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Hybrid FAQ & Support Chatbot</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule-based intent pattern matching for common FAQs + ML/LLM fallback model trained on intents.json dataset.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>intents.json ({intentsList.length} Categories)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Chat Interface */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[580px]">
          {/* Chat Titlebar */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm">Smart Retail AI Virtual Assistant</div>
                <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Hybrid Engine Active (Rule + ML Fallback)
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-1 rounded-md font-mono">
              chatbot_model.pkl
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm space-y-2 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 border-b border-slate-100 pb-1">
                    <span className="font-bold uppercase tracking-wider flex items-center gap-1 text-slate-500">
                      {msg.sender === 'user' ? (
                        <>
                          <User className="w-3 h-3 text-white" /> You
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-indigo-600" /> AI Support Assistant
                        </>
                      )}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="leading-relaxed font-normal whitespace-pre-wrap">{msg.text}</p>

                  {/* Intent Resolution Badge for Bot responses */}
                  {msg.sender === 'bot' && msg.intentTag && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                      <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                        Intent: #{msg.intentTag}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        msg.source === 'rule_based_faq'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        Source: {msg.source === 'rule_based_faq' ? 'Rule Match' : 'ML Fallback'} ({Math.round((msg.confidence || 0.85) * 100)}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Matching patterns & computing intent embeddings...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div className="p-2.5 bg-slate-100 border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex space-x-2">
            <span className="text-[11px] font-bold text-slate-500 self-center pl-1">Ask:</span>
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs rounded-lg border border-slate-200 transition shadow-xs flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a customer service question..."
              className="flex-1 p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputText.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Intent Training Dataset Browser */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Intents Dataset (intents.json)
              </h3>
              <span className="text-[10px] font-mono text-slate-500">{intentsList.length} Intent Categories</span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {intentsList.map((intent) => (
                <div key={intent.tag} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                      #{intent.tag}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{intent.category}</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="text-[11px] font-bold text-slate-700">Matched Patterns:</div>
                    <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                      {intent.patterns.slice(0, 3).map((pat, i) => (
                        <li key={i} className="truncate">"{pat}"</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
