import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { FaceRecognitionView } from './components/FaceRecognitionView';
import { ProductClassifierView } from './components/ProductClassifierView';
import { SentimentAnalyzerView } from './components/SentimentAnalyzerView';
import { ChatbotView } from './components/ChatbotView';
import { ApiExplorerView } from './components/ApiExplorerView';
import { ArchitectureReportView } from './components/ArchitectureReportView';
import { DashboardStats, CustomerVisit } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [apiOnline, setApiOnline] = useState<boolean>(true);

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
        setApiOnline(true);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
      setApiOnline(false);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleVisitLogged = (newVisit: CustomerVisit) => {
    if (stats) {
      setStats({
        ...stats,
        totalVisitsToday: stats.totalVisitsToday + 1,
        recentVisits: [newVisit, ...stats.recentVisits.slice(0, 7)],
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} apiOnline={apiOnline} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            loading={loadingStats}
            onRefresh={fetchDashboardStats}
            onNavigateToVision={() => setActiveTab('vision')}
          />
        )}

        {activeTab === 'vision' && (
          <FaceRecognitionView onVisitLogged={handleVisitLogged} />
        )}

        {activeTab === 'classifier' && <ProductClassifierView />}

        {activeTab === 'sentiment' && <SentimentAnalyzerView />}

        {activeTab === 'chatbot' && <ChatbotView />}

        {activeTab === 'api' && <ApiExplorerView />}

        {activeTab === 'architecture' && <ArchitectureReportView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900">Smart Retail & Customer Intelligence Platform</span>
            <span>&bull; Capstone Project</span>
          </div>
          <div className="flex items-center space-x-4 font-mono">
            <span>FastAPI Backend: Port 8000 &bull; Web UI: Port 3000</span>
            <span>OpenCV + MobileNetV2 + NLTK + Scikit-Learn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
