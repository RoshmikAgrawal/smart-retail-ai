import React, { useState, useRef } from 'react';
import { 
  Scan, 
  Camera, 
  RefreshCw, 
  UserCheck, 
  Sparkles, 
  Shield, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Award
} from 'lucide-react';
import { CustomerVisit } from '../types';

interface FaceRecognitionViewProps {
  onVisitLogged: (visit: CustomerVisit) => void;
}

export const FaceRecognitionView: React.FC<FaceRecognitionViewProps> = ({ onVisitLogged }) => {
  const [capturing, setCapturing] = useState<boolean>(false);
  const [matchedVisit, setMatchedVisit] = useState<CustomerVisit | null>(null);
  const [scanMode, setScanMode] = useState<'simulated' | 'webcam'>('simulated');
  const [selectedCustomerHint, setSelectedCustomerHint] = useState<string>('Sarah Jenkins');
  const [filteringCanny, setFilteringCanny] = useState<boolean>(true);
  const [detectingHaar, setDetectingHaar] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleRunFaceScan = async () => {
    setCapturing(true);
    setMatchedVisit(null);

    try {
      const response = await fetch('/api/recognize-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerNameHint: selectedCustomerHint,
          imageBase64: 'data:image/jpeg;base64,demo_frame_data',
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setMatchedVisit(resData.data);
        onVisitLogged(resData.data);
      }
    } catch (error) {
      console.error('Face recognition API failed:', error);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <Scan className="w-4 h-4" />
            <span>Computer Vision Module (A1)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Webcam Facial Recognition & VIP Loyalty Logging</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            OpenCV frame processing (Canny edge, Haar cascade bounding boxes) + LBPH/deep face embedding match against face_db.pkl.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setScanMode('simulated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              scanMode === 'simulated' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registered DB Sim
          </button>
          <button
            onClick={() => setScanMode('webcam')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              scanMode === 'webcam' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Camera Frame
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Camera Viewfinder & Filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
            {/* Viewfinder Bounding Box Visualizer */}
            <div className="relative w-full max-w-md aspect-4/3 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center">
              {/* Overlay Face Box */}
              <div className={`absolute w-44 h-52 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between p-2 ${
                capturing
                  ? 'border-cyan-400 bg-cyan-400/10 animate-pulse'
                  : matchedVisit
                  ? 'border-emerald-400 bg-emerald-400/10'
                  : 'border-indigo-500/60'
              }`}>
                <div className="flex justify-between items-start text-[10px] font-mono font-bold text-cyan-300 bg-slate-950/80 px-1.5 py-0.5 rounded">
                  <span>Haar Box [120, 80, 220, 240]</span>
                  <span>{matchedVisit ? `${Math.round(matchedVisit.confidence * 100)}%` : 'Ready'}</span>
                </div>

                <div className="text-center font-mono text-[10px] bg-slate-950/80 text-emerald-400 py-0.5 rounded">
                  {matchedVisit ? matchedVisit.customerName : 'Face Detected'}
                </div>
              </div>

              {/* Sample Face Photo inside Viewfinder */}
              <img
                src={
                  matchedVisit?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
                }
                alt="Camera Feed"
                className={`w-full h-full object-cover opacity-80 ${filteringCanny ? 'filter contrast-125' : ''}`}
              />

              {/* Status Bar */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>OpenCV Video Capture @ 30 FPS</span>
                </div>
                <span>Embedding: 128-d Vector</span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center space-x-3 text-xs text-slate-300 font-mono">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={detectingHaar}
                    onChange={(e) => setDetectingHaar(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Haar Bounding Boxes</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filteringCanny}
                    onChange={(e) => setFilteringCanny(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Canny Edge Preprocessing</span>
                </label>
              </div>

              <button
                onClick={handleRunFaceScan}
                disabled={capturing}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {capturing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Face Embeddings...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    <span>Trigger Face Recognition Scan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Matched Customer Loyalty Profile */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-600" />
              Known Customer Match Target (face_db.pkl)
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Select Test Customer Profile:</label>
              <select
                value={selectedCustomerHint}
                onChange={(e) => setSelectedCustomerHint(e.target.value)}
                className="w-full p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Sarah Jenkins">Sarah Jenkins (VIP Loyalty Member)</option>
                <option value="Marcus Vance">Marcus Vance (Gold Member)</option>
                <option value="Elena Rostova">Elena Rostova (Platinum VIP)</option>
                <option value="David Chen">David Chen (Silver Member)</option>
                <option value="Unknown">Unregistered Guest Visitor</option>
              </select>
            </div>

            {/* Result Box */}
            {matchedVisit ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={matchedVisit.avatar}
                    alt={matchedVisit.customerName}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-400 shadow-sm"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      {matchedVisit.customerName}
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-xs font-semibold text-indigo-600 font-mono">
                      {matchedVisit.status} &bull; {matchedVisit.customerId}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-200">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase block">Loyalty Points</span>
                    <strong className="text-emerald-600 text-sm">{matchedVisit.loyaltyPoints} PTS</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase block">In-Store Visits</span>
                    <strong className="text-slate-800 text-sm">{matchedVisit.visitCount} Visits</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs rounded-xl space-y-0.5">
                  <div className="font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" /> Automated Greeting Triggered
                  </div>
                  <p className="text-[11px] text-emerald-900">{matchedVisit.note}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                <Scan className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  Click "Trigger Face Recognition Scan" to perform LBPH / vector encoding lookup against database.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
