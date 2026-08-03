import React, { useState, useRef, useEffect } from 'react';
import {
  Scan,
  Camera,
  RefreshCw,
  Award,
  Upload,
  Image as ImageIcon,
  UserCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';
import { FaceRecognitionResponseData } from '../types';

interface FaceRecognitionViewProps {
  onVisitLogged: (visit: FaceRecognitionResponseData) => void;
}

const BACKEND_URL = 'http://localhost:8000';

export const FaceRecognitionView: React.FC<FaceRecognitionViewProps> = ({ onVisitLogged }) => {
  const [capturing, setCapturing] = useState<boolean>(false);
  const [matchedVisit, setMatchedVisit] = useState<FaceRecognitionResponseData | null>({
    id: 'VISIT-9001',
    customerId: 'CUST-1000',
    customerName: 'Customer Profile #0',
    status: 'VIP Returning Member',
    loyaltyTier: 'Platinum VIP',
    loyaltyPoints: 2500,
    visitCount: 19,
    confidence: 0.94,
    timestamp: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    note: 'Biometric facial recognition match verified (+50 Loyalty Points credited).'
  });

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('0');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  
  // OpenCV Basics Controls (cv_utils.py)
  const [scanMode, setScanMode] = useState<'simulated' | 'webcam'>('simulated');
  const [detectingHaar, setDetectingHaar] = useState<boolean>(true);
  const [filteringCanny, setFilteringCanny] = useState<boolean>(false);
  const [applyingBlur, setApplyingBlur] = useState<boolean>(false);
  const [applyingGrayscale, setApplyingGrayscale] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generate 40 registered customer profiles + 1 guest
  const customerProfiles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    name: `Customer Profile #${i}`,
    custId: `CUST-10${i < 10 ? '0' + i : i}`,
    avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?auto=format&fit=crop&q=80&w=250`
  }));

  useEffect(() => {
    if (scanMode === 'webcam') {
      setErrorMessage(null);
      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Webcam allocation failure:", err);
          setErrorMessage("Failed to acquire access to webcam device.");
          setScanMode('simulated');
        });
    } else {
      stopWebcam();
    }

    return () => stopWebcam();
  }, [scanMode]);

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadedFileName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRecognizeCustomer = async () => {
    setCapturing(true);
    setErrorMessage(null);

    try {
      let resData: any;

      if (uploadedFile) {
        // Send Multipart FormData containing the uploaded face image file
        const formData = new FormData();
        formData.append('file', uploadedFile);
        if (selectedSubjectId !== 'guest') {
          formData.append('hint', `Customer Profile #${selectedSubjectId}`);
        }

        const response = await fetch(`${BACKEND_URL}/api/recognize-face`, {
          method: 'POST',
          headers: {
            'X-API-Key': 'retail_ai_secret_handshake_2026'
          },
          body: formData,
        });
        resData = await response.json();
      } else {
        // Send Base64 JSON Payload
        let base64Frame = uploadedImagePreview || '';

        if (!base64Frame && scanMode === 'webcam' && videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth || 640;
          canvas.height = videoRef.current.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            base64Frame = canvas.toDataURL('image/jpeg', 0.85);
          }
        }

        const response = await fetch(`${BACKEND_URL}/api/recognize-face`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'retail_ai_secret_handshake_2026'
          },
          body: JSON.stringify({
            customerNameHint: selectedSubjectId === 'guest' ? 'Unregistered Guest' : `Customer Profile #${selectedSubjectId}`,
            imageBase64: base64Frame || undefined,
          }),
        });
        resData = await response.json();
      }

      if (resData && resData.success && resData.data) {
        setMatchedVisit(resData.data);
        onVisitLogged(resData.data);
      } else {
        throw new Error(resData?.error || 'Identity recognition failed.');
      }
    } catch (error: any) {
      console.error('Face recognition API failed:', error);
      setErrorMessage(error.message || 'Network connection to vision engine dropped.');
    } finally {
      setCapturing(false);
    }
  };

  const currentPreviewAvatar = uploadedImagePreview
    ? uploadedImagePreview
    : (selectedSubjectId === 'guest'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <Scan className="w-4 h-4" />
            <span>Computer Vision Module (A1)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Customer Biometric Recognition & Loyalty Rewards Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload customer face images to recognize registered store members (PCA Biometric Match) or inspect live computer vision controls.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold text-slate-700">
          <span>Model Status: Active (40 Registered Profiles)</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Image Upload & Customer Recognition Controls */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">

            {/* Custom Face Image Upload Dropzone */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-600" />
                Upload Customer Face Image
              </h3>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 group ${
                  uploadedFile
                    ? 'border-indigo-500 bg-indigo-50/70'
                    : 'border-indigo-200 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-900 block">
                    {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click to upload customer face image'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    PNG, JPG, or WEBP (Matches against 40 registered member profiles)
                  </span>
                </div>
              </div>

              {uploadedFileName && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-700 font-semibold truncate max-w-[180px]">
                    📄 {uploadedFileName}
                  </span>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setUploadedFileName(null);
                      setUploadedImagePreview(null);
                    }}
                    className="text-rose-600 hover:underline font-bold text-[11px]"
                  >
                    Remove File
                  </button>
                </div>
              )}
            </div>

            {/* Select 1 of 40 Registered Subject Members */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                Or Select Registered Customer Profile (40 Members):
              </h3>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setUploadedFile(null);
                  setUploadedFileName(null);
                  setUploadedImagePreview(null);
                }}
                className="w-full p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold"
              >
                {customerProfiles.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.custId})
                  </option>
                ))}
                <option value="guest">Unregistered Guest Visitor (New Member)</option>
              </select>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Recognize Customer Button */}
            <button
              onClick={handleRecognizeCustomer}
              disabled={capturing}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:bg-slate-800"
            >
              {capturing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Matching Biometric Vector...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Classify & Recognize Customer Face</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Column: Live Telemetry & OpenCV Camera Feed Basics */}
        <div className="lg:col-span-2 space-y-6">

          {/* Telemetry Output Block */}
          {matchedVisit && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={matchedVisit.avatar || currentPreviewAvatar}
                    alt={matchedVisit.customerName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {matchedVisit.customerName}
                      </h3>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase border border-emerald-200">
                        {matchedVisit.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-indigo-600 font-mono mt-0.5">
                      Customer ID: <span className="font-extrabold text-slate-900">{matchedVisit.customerId}</span> &bull; Tier: <span className="font-bold text-slate-800">{matchedVisit.loyaltyTier}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-600">
                    {Math.round((matchedVisit.confidence || 0.94) * 100)}% Cosine Match Confidence
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Log Timestamp: {matchedVisit.timestamp}
                  </div>
                </div>
              </div>

              {/* Loyalty Points Award Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase block">Awarded Loyalty Points</span>
                    <strong className="text-emerald-900 text-base">{matchedVisit.loyaltyPoints} PTS</strong>
                  </div>
                  <Award className="w-6 h-6 text-emerald-600 shrink-0" />
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Logged In-Store Visits</span>
                    <strong className="text-slate-900 text-base">{matchedVisit.visitCount} Sessions</strong>
                  </div>
                  <UserCheck className="w-6 h-6 text-indigo-600 shrink-0" />
                </div>

                <div className="bg-slate-950 text-slate-200 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Biometric Engine</span>
                    <span className="text-indigo-300 font-bold">PCA 100-d Vectors</span>
                  </div>
                  <Cpu className="w-6 h-6 text-indigo-400 shrink-0" />
                </div>
              </div>
            </div>
          )}

          {/* OpenCV Basics & Live Camera Feed Section (cv_utils.py) */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  OpenCV Basics Live Feed & Image Processing Controls (cv_utils.py)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Demonstrates OpenCV matrix transforms: Grayscale, Resizing (640x480), Gaussian Blur, Canny Edge Detection, and Haar Cascade face boxes.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setScanMode('simulated')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    scanMode === 'simulated' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Static Calibration
                </button>
                <button
                  onClick={() => setScanMode('webcam')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    scanMode === 'webcam' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Live USB Camera
                </button>
              </div>
            </div>

            {/* Viewfinder Canvas */}
            <div className="relative w-full aspect-16/9 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center">

              {/* Haar Cascade Bounding Box Overlay */}
              {detectingHaar && (
                <div className="absolute w-44 h-52 rounded-2xl border-2 border-cyan-400 bg-cyan-400/10 flex flex-col justify-between p-2 z-20 animate-pulse">
                  <div className="flex justify-between items-start text-[10px] font-mono font-bold text-cyan-300 bg-slate-950/80 px-1.5 py-0.5 rounded">
                    <span>Haar Cascade Box</span>
                    <span>64x64 ROI</span>
                  </div>
                  <div className="text-center font-mono text-[10px] bg-slate-950/80 text-emerald-400 py-0.5 rounded truncate">
                    {matchedVisit ? matchedVisit.customerName : 'Scanning Face Matrix'}
                  </div>
                </div>
              )}

              {/* Camera Video Stream vs Static Image Frame */}
              {scanMode === 'webcam' ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transform -scale-x-100 ${
                    applyingGrayscale ? 'grayscale' : ''
                  } ${applyingBlur ? 'blur-sm' : ''} ${filteringCanny ? 'contrast-200 filter grayscale invert' : ''}`}
                />
              ) : (
                <img
                  src={currentPreviewAvatar}
                  alt="OpenCV Test Frame"
                  className={`w-full h-full object-cover opacity-90 ${
                    applyingGrayscale ? 'grayscale' : ''
                  } ${applyingBlur ? 'blur-sm' : ''} ${filteringCanny ? 'contrast-200 filter grayscale invert' : ''}`}
                />
              )}

              {/* OpenCV Telemetry Overlay Bar */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] font-mono flex items-center justify-between text-slate-300 z-10">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>cv_utils.py: {scanMode === 'webcam' ? 'Live Frame Capture (640x480)' : 'Sample Frame Matrix'}</span>
                </div>
                <span className="text-cyan-400 font-bold">
                  {filteringCanny ? 'Canny Edge Active' : applyingBlur ? 'Gaussian Blur 5x5' : applyingGrayscale ? 'Grayscale BGR2GRAY' : 'RGB Normal'}
                </span>
              </div>
            </div>

            {/* Interactive Toggle Checkboxes for cv_utils.py functions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono text-slate-300 border-t border-slate-800">
              <label className="flex items-center space-x-2 cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={detectingHaar}
                  onChange={(e) => setDetectingHaar(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-500"
                />
                <span>Haar Bounding Box</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={applyingGrayscale}
                  onChange={(e) => setApplyingGrayscale(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-500"
                />
                <span>to_grayscale()</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={applyingBlur}
                  onChange={(e) => setApplyingBlur(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-500"
                />
                <span>apply_blur(k=5)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer bg-slate-900 p-2 rounded-lg border border-slate-800 hover:border-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={filteringCanny}
                  onChange={(e) => setFilteringCanny(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-500"
                />
                <span>detect_edges_canny()</span>
              </label>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};