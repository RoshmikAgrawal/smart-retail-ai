import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Upload, 
  RefreshCw, 
  Tag, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { ProductClassificationResult } from '../types';

export const ProductClassifierView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    'Clothing' | 'Shoes' | 'Bags & Luggage' | 'Electronics' | 'Groceries & Food'
  >('Clothing');
  const [classifying, setClassifying] = useState<boolean>(false);
  const [result, setResult] = useState<ProductClassificationResult | null>({
    category: 'Clothing',
    confidence: 0.97,
    subCategory: 'Classic Indigo Denim Jacket',
    estimatedPriceRange: '$49 - $89',
    tags: ['Denim', 'Outerwear', 'Indigo Blue', 'Cotton Blend'],
    attributes: {
      Material: '98% Cotton, 2% Elastane',
      Color: 'Indigo Blue',
      Fit: 'Slim Fit',
    },
    summary: 'High-confidence product image match detected using MobileNetV2 feature embeddings.',
    timestamp: new Date().toISOString(),
  });

  const categories = [
    { name: 'Clothing', icon: '🧥', sampleImg: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=600' },
    { name: 'Shoes', icon: '👟', sampleImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600' },
    { name: 'Bags & Luggage', icon: '👜', sampleImg: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600' },
    { name: 'Electronics', icon: '🎧', sampleImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600' },
    { name: 'Groceries & Food', icon: '☕', sampleImg: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600' },
  ];

  const handleClassify = async (catName?: string) => {
    setClassifying(true);
    const targetCat = catName || selectedCategory;

    try {
      const response = await fetch('/api/classify-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleCategory: targetCat }),
      });

      const resData = await response.json();
      if (resData.success) {
        setResult(resData.data);
      }
    } catch (error) {
      console.error('Classification error:', error);
    } finally {
      setClassifying(false);
    }
  };

  const currentSampleImg = categories.find((c) => c.name === selectedCategory)?.sampleImg;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4" />
            <span>Image Classification Module (A2)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">MobileNetV2 Transfer Learning Product Classifier</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            5-Class Deep Convolutional Neural Network trained on retail inventory image datasets (product_classifier.h5).
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold text-slate-700">
          <span>Model Artifact: product_classifier.h5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sample Category Pickers & Scanner View */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Select Retail Class to Test
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategory(cat.name as any);
                    handleClassify(cat.name);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                    selectedCategory === cat.name
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  {selectedCategory === cat.name && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleClassify()}
              disabled={classifying}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {classifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing MobileNetV2 Softmax...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Classify Product Image</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center & Right Column: Image Preview + Classification Output */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview Box */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Input Image Frame
              </span>
              <div className="aspect-4/3 rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-200 shadow-inner group">
                <img
                  src={currentSampleImg}
                  alt={selectedCategory}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-400 border border-slate-800">
                  Resized: 224x224x3 RGB
                </div>
              </div>
            </div>

            {/* Inference Results Panel */}
            <div className="space-y-4">
              {result && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-200">
                        {result.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-600">
                        {Math.round(result.confidence * 100)}% Confidence
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                      {result.subCategory}
                    </h3>
                  </div>

                  {/* Price Estimate */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Estimated Retail Price Range
                    </span>
                    <span className="font-mono font-extrabold text-slate-900 text-xs">
                      {result.estimatedPriceRange}
                    </span>
                  </div>

                  {/* Tags */}
                  {result.tags && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Tags:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-md border border-slate-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attributes */}
                  {result.attributes && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Feature Attributes:</span>
                      <div className="space-y-1 text-xs">
                        {Object.entries(result.attributes).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200">
                            <span className="font-bold text-slate-600">{k}:</span>
                            <span className="text-slate-800 font-mono">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
