import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  Copy, 
  Code, 
  Server, 
  ShieldCheck, 
  RefreshCw,
  Globe
} from 'lucide-react';

export const ApiExplorerView: React.FC = () => {
  const [activeEndpoint, setActiveEndpoint] = useState<string>('/api/health');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/health',
      name: 'System Health Check',
      description: 'Checks status of CV, NLP, Chatbot ML modules and Express/FastAPI pipeline gateway.',
      sampleBody: null,
    },
    {
      method: 'POST',
      path: '/api/recognize-face',
      name: 'Face Recognition & Visit Logger (A1)',
      description: 'Accepts camera frame / customer name, extracts 128-d face encodings, matches face_db.pkl, and credits loyalty points.',
      sampleBody: { customerNameHint: 'Sarah Jenkins', imageBase64: 'data:image/jpeg;base64,camera_frame_data' },
    },
    {
      method: 'POST',
      path: '/api/classify-product',
      name: 'Product Image Classifier (A2)',
      description: 'Passes image tensor into MobileNetV2 transfer learning model (product_classifier.h5) and returns category prediction.',
      sampleBody: { sampleCategory: 'Clothing' },
    },
    {
      method: 'POST',
      path: '/api/analyze-sentiment',
      name: 'NLP Sentiment Analysis (B1/B2)',
      description: 'Preprocesses raw text (stopwords, lemmatization), computes TF-IDF vectors, and scores polarity using sentiment_model.pkl.',
      sampleBody: { text: 'The checkout was super fast and staff was very polite and helpful!' },
    },
    {
      method: 'POST',
      path: '/api/chatbot',
      name: 'Support Chatbot Intent Engine (B3)',
      description: 'Queries rule-based FAQ patterns from intents.json and executes ML fallback model if score < 0.35.',
      sampleBody: { message: 'What are your store operating hours?' },
    },
    {
      method: 'GET',
      path: '/api/dashboard/stats',
      name: 'Dashboard Analytics Aggregator',
      description: 'Aggregates live customer check-in counts, sentiment score averages, and product category distributions.',
      sampleBody: null,
    },
  ];

  const handleTestApi = async (ep: typeof endpoints[0]) => {
    setLoading(true);
    setActiveEndpoint(ep.path);

    try {
      let res;
      if (ep.method === 'GET') {
        res = await fetch(ep.path);
      } else {
        res = await fetch(ep.path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ep.sampleBody || {}),
        });
      }

      const data = await res.json();
      setApiResponse(data);
    } catch (error: any) {
      setApiResponse({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const selectedEp = endpoints.find((e) => e.path === activeEndpoint) || endpoints[0];

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>Base URL: http://0.0.0.0:3000</span>
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
                onClick={() => handleTestApi(ep)}
                className={`w-full p-3.5 rounded-xl border text-left transition space-y-1 ${
                  activeEndpoint === ep.path
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                      ep.method === 'GET'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold truncate">{ep.path}</span>
                </div>
                <div className={`text-xs font-semibold ${activeEndpoint === ep.path ? 'text-indigo-200' : 'text-slate-700'}`}>
                  {ep.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Payload & Response Tester */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-6 font-mono text-xs">
            {/* Active Route Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      selectedEp.method === 'GET' ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-500 text-white'
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
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center space-x-2 shadow-md self-start sm:self-auto"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
                <span>Execute API Call</span>
              </button>
            </div>

            {/* Request Body Payload */}
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

            {/* Response JSON Output */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  HTTP Response (Status 200 OK):
                </span>
                {apiResponse && (
                  <span className="text-emerald-400 text-[10px] font-bold">LIVE RESPONSE RECEIVED</span>
                )}
              </div>

              <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto text-indigo-300 min-h-[180px] max-h-[320px] text-xs">
                {loading
                  ? 'Executing request on http://0.0.0.0:3000...'
                  : apiResponse
                  ? JSON.stringify(apiResponse, null, 2)
                  : 'Click "Execute API Call" above to test endpoint...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
