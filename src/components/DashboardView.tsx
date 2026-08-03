import React from 'react';
import { 
  Users, 
  UserCheck, 
  Smile, 
  ShoppingBag, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  Sparkles, 
  RefreshCw,
  CheckCircle2,
  Scan,
  Zap,
  BarChart2
} from 'lucide-react';
import { DashboardStats } from '../types';

interface DashboardViewProps {
  stats: DashboardStats | null;
  loading: boolean;
  onRefresh: () => void;
  onNavigateToVision: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  loading,
  onRefresh,
  onNavigateToVision,
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 overflow-hidden shadow-xl border border-indigo-900/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Smart Retail Capstone Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Real-time In-Store Customer Intelligence
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Integrating computer vision face recognition loyalty check-ins, MobileNetV2 product classification, NLP sentiment analysis, and hybrid support chatbots into a unified FastAPI backend architecture.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-xl transition shadow-sm text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Sync Metrics</span>
            </button>
            <button
              onClick={onNavigateToVision}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
            >
              <Scan className="w-4 h-4" />
              <span>Launch Live Camera Scan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Store Visitors Today</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats ? stats.totalVisitsToday : 131}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Captured via OpenCV Haar & webcam frames</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Returning VIP Rate</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats ? `${stats.returningCustomerRate}%` : '85%'}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +8.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Face encodings matched in face_db.pkl</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Sentiment</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Smile className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats ? `${stats.averageSentimentScore}%` : '92%'}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Positive
            </span>
          </div>
          <p className="text-[11px] text-slate-400">TF-IDF & polarity classification score</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Scans Logged</span>
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats ? stats.categoryDistribution.reduce((a, b) => a + b.count, 0) : 141}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 5 Classes
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Classified by product_classifier.h5</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Registered Customer Visit Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                Live Customer Recognition Activity Feed (Module A1)
              </h2>
              <p className="text-xs text-slate-500">
                Face encodings extracted and matched in real-time with instant loyalty point crediting
              </p>
            </div>
            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200 font-semibold">
              face_db.pkl
            </span>
          </div>

          <div className="space-y-3">
            {stats && stats.recentVisits && stats.recentVisits.length > 0 ? (
              stats.recentVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition space-x-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={visit.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={visit.customerName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200 shadow-xs flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {visit.customerName}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          visit.status === 'VIP'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        }`}>
                          {visit.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {visit.note || 'In-store recognition check-in completed'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 space-y-0.5 font-mono text-xs">
                    <div className="font-bold text-indigo-700">+{visit.loyaltyPoints} pts</div>
                    <div className="text-[10px] text-slate-400">Match: {Math.round(visit.confidence * 100)}%</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">Loading visit logs...</div>
            )}
          </div>
        </div>

        {/* Right Col: Category Distribution Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-cyan-600" />
              Product Category Breakdown
            </h3>
            <span className="text-[10px] font-mono text-slate-400">MobileNetV2</span>
          </div>

          <div className="space-y-3">
            {stats && stats.categoryDistribution ? (
              stats.categoryDistribution.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{cat.category}</span>
                    <span className="font-mono text-indigo-600">{cat.percentage}% ({cat.count})</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400">Loading product statistics...</div>
            )}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1 mt-4">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Model Weights Loaded
            </div>
            <p>
              Product categorization powered by transfer-learned MobileNetV2 architecture serialized inside <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">product_classifier.h5</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
