import React, { useState } from 'react';
import { 
  MessageSquareHeart, 
  Sparkles, 
  Send, 
  Smile, 
  Frown, 
  Meh, 
  RefreshCw, 
  FileText, 
  Scissors, 
  BarChart2,
  CheckCircle2
} from 'lucide-react';
import { SentimentAnalysisResult } from '../types';

export const SentimentAnalyzerView: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    'The store layout was beautiful and checkout was super fast! Staff was very polite, though the parking lot was slightly crowded.'
  );
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [sentimentResult, setSentimentResult] = useState<SentimentAnalysisResult | null>({
    originalText: 'The store layout was beautiful and checkout was super fast! Staff was very polite, though the parking lot was slightly crowded.',
    cleanedText: 'the store layout was beautiful and checkout was super fast staff was very polite though the parking lot was slightly crowded',
    tokens: ['the', 'store', 'layout', 'was', 'beautiful', 'and', 'checkout', 'was', 'super', 'fast', 'staff', 'was', 'very', 'polite', 'though', 'the', 'parking', 'lot', 'was', 'slightly', 'crowded'],
    stopwordsRemoved: ['store', 'layout', 'beautiful', 'checkout', 'super', 'fast', 'staff', 'polite', 'parking', 'lot', 'slightly', 'crowded'],
    sentiment: 'Positive',
    confidence: 0.94,
    polarityScore: 0.82,
    aspects: [
      { aspect: 'Store Atmosphere', sentiment: 'Positive', score: 0.9 },
      { aspect: 'Checkout Speed', sentiment: 'Positive', score: 0.95 },
      { aspect: 'Staff Hospitality', sentiment: 'Positive', score: 0.92 },
      { aspect: 'Parking / Facilities', sentiment: 'Neutral', score: 0.4 },
    ],
    summary: 'High positive polarity driven by strong positive emotion tokens ("beautiful", "super fast", "polite").',
    timestamp: new Date().toISOString(),
  });

  const sampleReviews = [
    {
      label: 'Positive Review',
      text: 'Super high quality leather jacket! Fits true to size and arrived in 2 days. Best retail experience I have had in years.',
    },
    {
      label: 'Negative Review',
      text: 'The shoe zipper broke on the second day of wearing. Customer support queue was over 30 minutes long.',
    },
    {
      label: 'Neutral Review',
      text: 'The sweater is okay, color matches the website picture. Material feels a bit thin for winter.',
    },
  ];

  const handleAnalyzeSentiment = async (reviewText?: string) => {
    setAnalyzing(true);
    const textToAnalyze = reviewText || inputText;

    try {
      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze }),
      });

      const resData = await response.json();
      if (resData.success) {
        setSentimentResult(resData.data);
      }
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <MessageSquareHeart className="w-4 h-4" />
            <span>Natural Language Processing Module (B1 & B2)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">Customer Feedback Sentiment Analysis & Preprocessor</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Text cleaning pipeline (lowercasing, stopword removal, lemmatization) with TF-IDF vectorization and sentiment classification.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 font-mono text-xs font-semibold text-slate-700">
          <span>Deliverable: sentiment_model.pkl + vectorizer.pkl</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Review Input & Sample Dataset */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              Customer Review Input
            </h3>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder="Paste customer review or chat transcript here..."
              className="w-full p-3 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />

            <button
              onClick={() => handleAnalyzeSentiment()}
              disabled={analyzing || !inputText.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Preprocessing & Vectorizing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Analyze Sentiment & Run NLP</span>
                </>
              )}
            </button>

            {/* Sample Dataset Selector */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700">Sample Dataset Reviews:</span>
              <div className="space-y-1.5">
                {sampleReviews.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(sample.text);
                      handleAnalyzeSentiment(sample.text);
                    }}
                    className="w-full p-2.5 text-left text-xs bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 rounded-xl transition space-y-0.5"
                  >
                    <div className="font-bold text-slate-800 text-[11px]">{sample.label}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-2">{sample.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preprocessing Steps & Sentiment Results */}
        <div className="lg:col-span-2 space-y-6">
          {sentimentResult && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Sentiment Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-2xl ${
                    sentimentResult.sentiment === 'Positive'
                      ? 'bg-emerald-100 text-emerald-700'
                      : sentimentResult.sentiment === 'Negative'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {sentimentResult.sentiment === 'Positive' && <Smile className="w-8 h-8" />}
                    {sentimentResult.sentiment === 'Negative' && <Frown className="w-8 h-8" />}
                    {sentimentResult.sentiment === 'Neutral' && <Meh className="w-8 h-8" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        sentimentResult.sentiment === 'Positive'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : sentimentResult.sentiment === 'Negative'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {sentimentResult.sentiment} Sentiment
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {Math.round(sentimentResult.confidence * 100)}% confidence
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      Polarity Score: {sentimentResult.polarityScore > 0 ? `+${sentimentResult.polarityScore}` : sentimentResult.polarityScore}
                    </h3>
                  </div>
                </div>

                {/* Polarity Bar Indicator */}
                <div className="w-full sm:w-48 space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                    <span>-1.0 Negative</span>
                    <span>+1.0 Positive</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full relative overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sentimentResult.polarityScore >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{
                        width: `${Math.abs(sentimentResult.polarityScore) * 100}%`,
                        marginLeft: sentimentResult.polarityScore >= 0 ? '50%' : `${50 - Math.abs(sentimentResult.polarityScore) * 50}%`,
                      }}
                    ></div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-400"></div>
                  </div>
                </div>
              </div>

              {/* B1. Text Preprocessing Breakdown Panel */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-indigo-500" /> B1: Text Preprocessing Pipeline Steps
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Step 1: Lowercase & Punctuation */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-indigo-600 text-[11px] uppercase">Step 1: Lowercase & Cleaned</div>
                    <p className="text-slate-600 font-mono text-[11px] leading-relaxed bg-white p-2 rounded border border-slate-200">
                      "{sentimentResult.cleanedText}"
                    </p>
                  </div>

                  {/* Step 2: Stopwords Removed */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-cyan-600 text-[11px] uppercase">Step 2: Stopwords Filtered ({sentimentResult.stopwordsRemoved.length} tokens)</div>
                    <div className="flex flex-wrap gap-1 bg-white p-2 rounded border border-slate-200 max-h-20 overflow-y-auto">
                      {sentimentResult.stopwordsRemoved.map((tok, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-mono text-[10px] rounded border border-indigo-200">
                          {tok}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Aspect-Based Sentiment Ratings */}
              {sentimentResult.aspects && sentimentResult.aspects.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-emerald-600" /> Aspect-Based Sentiment Decomposition
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {sentimentResult.aspects.map((asp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-800">{asp.aspect}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          asp.sentiment === 'Positive'
                            ? 'bg-emerald-100 text-emerald-800'
                            : asp.sentiment === 'Negative'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {asp.sentiment} ({Math.round(asp.score * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950 text-xs">
                <strong>NLP Summary:</strong> {sentimentResult.summary}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
