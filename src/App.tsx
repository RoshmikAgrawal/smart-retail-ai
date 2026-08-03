import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { FaceRecognitionView } from './components/FaceRecognitionView';
import { ProductClassifierView } from './components/ProductClassifierView';
import { SentimentAnalyzerView } from './components/SentimentAnalyzerView';
import { ChatbotView } from './components/ChatbotView';
import { ApiExplorerView } from './components/ApiExplorerView';
import { DashboardStatsData, FaceRecognitionResponseData } from './types'; // Corrected type interface imports

const BACKEND_URL = 'http://localhost:8000';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [apiOnline, setApiOnline] = useState<boolean>(false);

  // Aggregates high-level telemetry and chart configurations from the FastAPI server
  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/dashboard/stats`);
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data);
        setApiOnline(true);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard metrics from gateway:', err);
      setApiOnline(false);
    } finally {
      setLoadingStats(false);
    }
  };

  // Lifecycle orchestrator handling baseline telemetry fetches and heartbeat execution paths
  useEffect(() => {
    const runSystemHealthHeartbeat = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/health`);
        const data = await res.json();

        // Assert the gateway is online and ML pipeline components are completely initialized
        if (data.status === 'healthy' || data.pipeline_loaded === true) {
          setApiOnline(true);
          // Auto-trigger a metrics load once the pipeline settles into an active operational state
          fetchDashboardStats();
        } else {
          setApiOnline(false);
        }
      } catch (err) {
        setApiOnline(false);
      }
    };

    // Evaluate hardware and service layers immediately at startup
    runSystemHealthHeartbeat();

    // Establish a recurring background checking interval loop every 10 seconds
    const statusHeartbeatLoop = setInterval(runSystemHealthHeartbeat, 10000);

    return () => clearInterval(statusHeartbeatLoop);
  }, []);

  // Intercepts webcam recognition pipeline logs to append them to local analytics views instantly
  const handleVisitLogged = (newVisit: FaceRecognitionResponseData) => {
    if (stats) {
      setStats({
        ...stats,
        totalVisitsToday: stats.totalVisitsToday + 1,
        // Prepend the live facial extraction payload cleanly ahead of the previous log array slice
        recentVisits: [newVisit, ...stats.recentVisits.slice(0, 7)],
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-indigo-500/20">
      {/* Global Navigation Shell */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} apiOnline={apiOnline} />

      {/* Dynamic Main Viewport Workspace Container */}
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
      </main>

      {/* Compliant System Workspace Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900">Smart Retail & Customer Intelligence Platform</span>
            <span>&bull; Capstone Workspace</span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[11px] text-slate-400">
            <span>FastAPI Backend Gateway: Port 8000</span>
            <span>OpenCV + MobileNetV2 + Scikit-Learn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;