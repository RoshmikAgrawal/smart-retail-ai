import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Code,
  Server,
  RefreshCw,
  Globe
} from 'lucide-react';
import { ApiResponse } from '../types'; // Import our unified data wrapper contract

const BACKEND_URL = 'http://localhost:8000';

export const ApiExplorerView: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('/api/health');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse<any> | null>(null);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/health',
      name: 'System Health Check',
      description: 'Checks initialization state of CV matrix maps, NLP components, and underlying network models.',
      sampleBody: null,
    },
    {
      method: 'POST',
      path: '/api/recognize-face',
      name: 'Face Recognition & Visit Logger (A1)',
      description: 'Accepts camera frames or profile names, maps 128-d face encodings against face_db.pkl, and returns user status traits.',
      sampleBody: { customerNameHint: 'Sarah Jenkins', imageBase64: 'data:image/jpeg;base64,camera_frame_data' },
    },
    {
      method: 'POST',
      path: '/api/classify-product',
      name: 'Product Image Classifier (A2)',
      description: 'Passes target image components down into the native product_classifier.h5 deep graph to extract retail categories.',
      sampleBody: { sampleCategory: 'Clothing' },
    },
    {
      method: 'POST',
      path: '/api/analyze-sentiment',
      name: 'NLP Sentiment Analysis (B1/B2)',
      description: 'Strips out structural stopwords, tokenizes expressions, calculates TF-IDF metrics, and assigns directional polarity matrices.',
      sampleBody: { text: 'The Veggie Paradise pizza was absolutely amazing with a perfect cheese burst crust!' },
    },
    {
      method: 'POST',
      path: '/api/chatbot',
      name: 'Support Chatbot Intent Engine (B3)',
      description: 'Checks incoming expressions against localized intents mapping tokens, triggering fallbacks for low confidence inputs.',
      sampleBody: { message: 'What are your store operating hours?' },
    },
    {
      method: 'GET',
      path: '/api/dashboard/stats',
      name: 'Dashboard Analytics Aggregator',
      description: 'Collects running daily footfall tallies, sentiment breakdown distributions, and active network module tracking metrics.',
      sampleBody: null,
    },
  ];

  const handleTestApi = async (ep: typeof endpoints[0]) => {
    setLoading(true);
    try {
      let res;
      const targetUrl = `${BACKEND_URL}${ep.path}`;

      if (ep.method === 'GET') {
        res = await fetch(targetUrl);
      } else {
        res = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ep.sampleBody || {}),
        });
      }

      const data = await res.json();
      setApiResponse(data);
    } catch (error: any) {
      setApiResponse({ success: false, data: null, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const selectedEp = endpoints.find((e) => e.path === activeEndpoint) || endpoints[0];

  return (
    <div className="space-y-6">
      {/* Dynamic Console Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>API Gateway Documentation & Test Console (C3)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">RESTful API Endpoints & Swagger Spec</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test backend routes directly using interactive JSON payloads and live server responses.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-700">
          <Globe className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>Target Host: {BACKEND_URL}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Endpoints */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider px-1">
            Available Endpoints ({endpoints.length})
          </h3>

          <div className="space-y-2">
            {endpoints.map((ep) => (
              <button
                key={ep.path}
                onClick={() => {
                  setActiveEndpoint(ep.path);
                  setApiResponse(null); // Clear previous responses when switching view contexts
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition space-y-1 ${activeEndpoint === ep.path
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${ep.method === 'GET'
                        ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-600 border border-indigo-500/30'
                      }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold truncate">{ep.path}</span>
                </div>
                <div className={`text-xs font-semibold ${activeEndpoint === ep.path ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {ep.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Columns: Interactive Workspace */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-6 font-mono text-xs">
            {/* Active Route Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${selectedEp.method === 'GET' ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-500 text-white'
                      }`}
                  >
                    {selectedEp.method}
                  </span>
                  <span className="text-sm font-bold text-white">{selectedEp.path}</span>
                </div>
                <p className="text-slate-400 font-sans text-xs mt-1">{selectedEp.description}</p>
              </div>

              <button
                onClick={() => handleTestApi(selectedEp)}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition flex items-center space-x-2 shadow-md self-start sm:self-auto"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
                <span>Execute API Call</span>
              </button>
            </div>

            {/* Render Request Payload Preview if applicable */}
            {selectedEp.sampleBody && (
              <div className="space-y-2">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">
                  Request JSON Payload:
                </span>
                <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto text-emerald-400 text-xs">
                  {JSON.stringify(selectedEp.sampleBody, null, 2)}
                </pre>
              </div>
            )}

            {/* Live Interactive Response Window */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  HTTP Response Logs:
                </span>
                {apiResponse && (
                  <span className={`text-[10px] font-bold ${apiResponse.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {apiResponse.success ? 'LIVE DATA LOADED' : 'SERVER RESPONSE EXCEPTION'}
                  </span>
                )}
              </div>

              <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto text-indigo-300 min-h-[180px] max-h-[320px] text-xs">
                {loading
                  ? `Contacting async loop on ${BACKEND_URL}${selectedEp.path}...`
                  : apiResponse
                    ? JSON.stringify(apiResponse, null, 2)
                    : 'Select an endpoint and click "Execute API Call" above to fire pipeline events...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};