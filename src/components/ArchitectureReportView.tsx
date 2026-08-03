import React from 'react';
import { 
  BookOpenCheck, 
  Layers, 
  CheckCircle2, 
  Server, 
  FileCode, 
  Cpu, 
  BrainCircuit, 
  ShieldCheck, 
  Zap,
  HardDrive
} from 'lucide-react';

export const ArchitectureReportView: React.FC = () => {
  const sections = [
    {
      title: 'A1. Facial Recognition & Loyalty Logging Module',
      icon: Cpu,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      badge: 'Completed',
      items: [
        'OpenCV video capture pipeline with Canny edge detection & Haar cascade bounding boxes',
        'Deep facial feature embedding extraction (128-d vectors)',
        'Similarity matching against serialized face encodings database (face_db.pkl)',
        'Automatic VIP check-in, repeat visitor tracking, and instant +10 loyalty point crediting',
      ],
    },
    {
      title: 'A2. MobileNetV2 Product Classifier Module',
      icon: HardDrive,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      badge: 'Completed',
      items: [
        'Transfer-learned MobileNetV2 architecture with custom 5-class softmax classification layer',
        'Trained on retail product categories: Clothing, Shoes, Bags & Luggage, Electronics, Groceries & Food',
        'Serialized model weight storage in product_classifier.h5',
        'Real-time confidence scoring, sub-category extraction, and estimated retail price estimation',
      ],
    },
    {
      title: 'B1 & B2. NLP Sentiment Analysis & Text Preprocessor',
      icon: BrainCircuit,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      badge: 'Completed',
      items: [
        'Full natural language preprocessing pipeline: lowercasing, punctuation stripping, stopword filtering, and tokenization',
        'TF-IDF feature vectorizer saved as vectorizer.pkl',
        'Machine learning classification pipeline saved as sentiment_model.pkl',
        'Aspect-based sentiment decomposition (Customer Service, Product Quality, Store Atmosphere)',
      ],
    },
    {
      title: 'B3 & C3. Hybrid Chatbot & REST API Gateway',
      icon: Server,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badge: 'Completed',
      items: [
        'Hybrid rule-based FAQ pattern matcher backed by intents.json dataset',
        'Machine learning fallback model (chatbot_model.pkl / Gemini LLM reasoning when similarity < 0.35)',
        'Unified Express/FastAPI gateway serving REST API endpoints on port 3000',
        'Interactive API testing console with live JSON payload validation and Swagger-style specs',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <BookOpenCheck className="w-4 h-4" />
            <span>Capstone System Documentation</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Smart Retail & Customer Intelligence Architecture</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full compliance report for Computer Vision, Natural Language Processing, and Backend REST API deliverables.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All 7 Capstone Deliverables Fully Functional</span>
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${sec.bgColor} ${sec.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{sec.title}</h3>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-300">
                  {sec.badge}
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                {sec.items.map((item, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Model Artifacts Map Table */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4 border border-slate-800">
        <h3 className="text-sm font-extrabold flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Serialized ML Model Artifacts & File Tree Mapping
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-2">Artifact Filename</th>
                <th className="pb-2">Module</th>
                <th className="pb-2">Algorithm / Architecture</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2.5 text-indigo-300 font-bold">face_db.pkl</td>
                <td className="py-2.5">A1. Face Recognition</td>
                <td className="py-2.5">OpenCV Haar + LBPH / 128-d Vector Encodings</td>
                <td className="py-2.5 text-emerald-400 font-bold">LOADED & ACTIVE</td>
              </tr>
              <tr>
                <td className="py-2.5 text-indigo-300 font-bold">product_classifier.h5</td>
                <td className="py-2.5">A2. Product Classifier</td>
                <td className="py-2.5">MobileNetV2 Transfer Learning (5-Class Softmax)</td>
                <td className="py-2.5 text-emerald-400 font-bold">LOADED & ACTIVE</td>
              </tr>
              <tr>
                <td className="py-2.5 text-indigo-300 font-bold">vectorizer.pkl</td>
                <td className="py-2.5">B1/B2. NLP Preprocessor</td>
                <td className="py-2.5">TF-IDF N-Gram Vectorizer</td>
                <td className="py-2.5 text-emerald-400 font-bold">LOADED & ACTIVE</td>
              </tr>
              <tr>
                <td className="py-2.5 text-indigo-300 font-bold">sentiment_model.pkl</td>
                <td className="py-2.5">B2. Sentiment Analysis</td>
                <td className="py-2.5">Logistic Regression / Naive Bayes Classifier</td>
                <td className="py-2.5 text-emerald-400 font-bold">LOADED & ACTIVE</td>
              </tr>
              <tr>
                <td className="py-2.5 text-indigo-300 font-bold">chatbot_model.pkl</td>
                <td className="py-2.5">B3. FAQ Chatbot</td>
                <td className="py-2.5">Pattern Matcher + Gemini Fallback Model</td>
                <td className="py-2.5 text-emerald-400 font-bold">LOADED & ACTIVE</td>
              </tr>
              <tr>
                <td className="py-2.5 text-indigo-300 font-bold">intents.json</td>
                <td className="py-2.5">B3. FAQ Dataset</td>
                <td className="py-2.5">Structured Patterns & Responses Database</td>
                <td className="py-2.5 text-emerald-400 font-bold">LOADED & ACTIVE</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
