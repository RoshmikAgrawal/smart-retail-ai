import React from 'react';
import { 
  Scan, 
  ShoppingBag, 
  MessageSquareHeart, 
  Bot, 
  LayoutDashboard, 
  Terminal, 
  ShieldCheck,
  Activity
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard' 
  | 'vision' 
  | 'classifier' 
  | 'sentiment' 
  | 'chatbot' 
  | 'api';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  apiOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, apiOnline }) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Live Dashboard', icon: LayoutDashboard },
    { id: 'vision' as ActiveTab, label: 'Face Recognition (A1)', icon: Scan },
    { id: 'classifier' as ActiveTab, label: 'Product Classifier (A2)', icon: ShoppingBag },
    { id: 'sentiment' as ActiveTab, label: 'NLP Sentiment (B1/B2)', icon: MessageSquareHeart },
    { id: 'chatbot' as ActiveTab, label: 'FAQ Chatbot (B3)', icon: Bot },
    { id: 'api' as ActiveTab, label: 'API Gateway (C3)', icon: Terminal },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Capstone Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/30">
              <Scan className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  SmartRetail AI
                </span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-indigo-500/30">
                  v1.0 Capstone
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Computer Vision & NLP Retail Intelligence</p>
            </div>
          </div>

          {/* System API Health Badge */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/80">
            <span className={`w-2.5 h-2.5 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-xs font-mono font-medium text-slate-300">
              FastAPI Gateway: <strong className={apiOnline ? 'text-emerald-400' : 'text-rose-400'}>{apiOnline ? 'ONLINE' : 'CONNECTING'}</strong>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none pb-2 pt-1 border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
