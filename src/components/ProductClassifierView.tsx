import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  RefreshCw,
  DollarSign,
  Layers,
  CheckCircle2,
  Sparkles,
  Cpu,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { ProductClassificationResponseData } from '../types';

const BACKEND_URL = 'http://localhost:8000';

export type FashionMNISTCategory =
  | 'T-shirt/top'
  | 'Trouser'
  | 'Pullover'
  | 'Dress'
  | 'Coat'
  | 'Sandal'
  | 'Shirt'
  | 'Sneaker'
  | 'Bag'
  | 'Ankle boot';

export const ProductClassifierView: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<FashionMNISTCategory>('Bag');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [classifying, setClassifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ProductClassificationResponseData | null>({
    category: 'Bag',
    confidence: 0.96,
    subCategory: 'Saffiano Leather Tote Bag',
    estimatedPriceRange: '$30 - $90',
    engineSource: 'MobileNetV2 Production Graph Model'
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories: { name: FashionMNISTCategory; icon: string; sampleImg: string }[] = [
    { name: 'T-shirt/top', icon: '👕', sampleImg: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800' },
    { name: 'Trouser', icon: '👖', sampleImg: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800' },
    { name: 'Pullover', icon: '🧥', sampleImg: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800' },
    { name: 'Dress', icon: '👗', sampleImg: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800' },
    { name: 'Coat', icon: '🥼', sampleImg: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sandal', icon: '👡', sampleImg: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&q=80&w=800' },
    { name: 'Shirt', icon: '👔', sampleImg: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sneaker', icon: '👟', sampleImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800' },
    { name: 'Bag', icon: '👜', sampleImg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800' },
    { name: 'Ankle boot', icon: '👢', sampleImg: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800' },
  ];

  const localInventoryMetadata: Record<string, { tags: string[]; material: string }> = {
    'T-shirt/top': { tags: ['Cotton', 'Casual', 'Apparel'], material: '100% Organic Cotton' },
    'Trouser': { tags: ['Pants', 'Chino', 'Denim'], material: '98% Cotton, 2% Elastane' },
    'Pullover': { tags: ['Sweater', 'Hoodie', 'Warmth'], material: 'Wool & Fleece Blend' },
    'Dress': { tags: ['Formal', 'Summer', 'Elegance'], material: 'Silk & Chiffon Blend' },
    'Coat': { tags: ['Outerwear', 'Winter', 'Overcoat'], material: 'Heavy Wool & Synthetic Down' },
    'Sandal': { tags: ['Summer', 'Footwear', 'Open-Toe'], material: 'Genuine Leather & Cork' },
    'Shirt': { tags: ['Formal', 'Button-Down', 'Office'], material: '100% Egyptian Cotton' },
    'Sneaker': { tags: ['Athletic', 'Footwear', 'Streetwear'], material: 'Synthetic Mesh & Rubber Sole' },
    'Bag': { tags: ['Accessories', 'Travel', 'Leather'], material: 'Full-Grain Leather' },
    'Ankle boot': { tags: ['Boots', 'Leather', 'Footwear'], material: 'Suede & Leather Sole' },
  };

  const classifyPreset = async (catName: FashionMNISTCategory) => {
    setClassifying(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/classify-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'retail_ai_secret_handshake_2026'
        },
        body: JSON.stringify({ sampleCategory: catName }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
      } else {
        setErrorMessage(resData.error || 'Failed to classify product image.');
      }
    } catch (error) {
      console.error('Preset classification endpoint error:', error);
      setErrorMessage('Network error connecting to classification service.');
    } finally {
      setClassifying(false);
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

  const handleSelectPreset = (catName: FashionMNISTCategory) => {
    setSelectedPreset(catName);
    setUploadedFile(null);
    setUploadedFileName(null);
    setUploadedImagePreview(null);
    setErrorMessage(null);
    classifyPreset(catName);
  };

  const handleClassify = async () => {
    if (uploadedFile) {
      setClassifying(true);
      setErrorMessage(null);

      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const response = await fetch(`${BACKEND_URL}/api/classify-product`, {
          method: 'POST',
          headers: {
            'X-API-Key': 'retail_ai_secret_handshake_2026'
          },
          body: formData,
        });

        const resData = await response.json();
        if (resData.success && resData.data) {
          setResult(resData.data);
        } else {
          setErrorMessage(resData.error || 'Failed to process uploaded product image.');
        }
      } catch (error) {
        console.error('Classification endpoint error:', error);
        setErrorMessage('Network error connecting to classification service.');
      } finally {
        setClassifying(false);
      }
    } else {
      classifyPreset(selectedPreset);
    }
  };

  const currentSampleImg = uploadedImagePreview
    ? uploadedImagePreview
    : categories.find((c) => c.name === selectedPreset)?.sampleImg;

  const secondaryMetadata = localInventoryMetadata[result?.category || selectedPreset] || {
    tags: ['Retail', 'Inventory', 'Apparel'],
    material: 'Standard Synthetic & Cotton'
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4" />
            <span>Image Classification Module (A2)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            MobileNetV2 Transfer Learning Product Classifier
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload custom product images or click one of the 10 Fashion-MNIST class examples to classify in real-time with confidence scores (POST /classify-product).
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold text-slate-700">
          <span>Model File: product_classifier.h5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Image Upload & Fashion-MNIST Examples */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">

            {/* Custom Image File Upload Area */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-600" />
                Upload Product Image
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
                    {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click to upload product image'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    PNG, JPG, or WEBP (Resized to 224x224 RGB tensor)
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
                      handleSelectPreset('Bag');
                    }}
                    className="text-rose-600 hover:underline font-bold text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Fashion-MNIST 10 Class Examples List */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Fashion-MNIST 10 Class Examples:
              </h3>

              <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleSelectPreset(cat.name)}
                    className={`p-2 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                      selectedPreset === cat.name && !uploadedFile
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="text-sm">{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </span>
                    {selectedPreset === cat.name && !uploadedFile && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Single Action Button */}
            <button
              onClick={handleClassify}
              disabled={classifying}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 disabled:bg-slate-800"
            >
              {classifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing MobileNetV2 Inference...</span>
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

        {/* Right Column: Classification Results Viewport */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Image Viewfinder Frame */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Input Image Tensor Frame
              </span>
              <div className="aspect-4/3 rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-200 shadow-inner group">
                <img
                  src={currentSampleImg || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'}
                  alt="Product Frame"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-400 border border-slate-800">
                  Resized Dimensions: 224x224x3 RGB
                </div>
              </div>
            </div>

            {/* Classification Output Telemetry */}
            <div className="space-y-4">
              {result ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-indigo-200">
                        {result.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-600">
                        {Math.round(result.confidence * 100)}% Confidence Score
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                      {result.subCategory}
                    </h3>
                  </div>

                  {/* Valuation Estimate */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Estimated Valuation Bounds
                    </span>
                    <span className="font-mono font-extrabold text-slate-900 text-xs">
                      {result.estimatedPriceRange}
                    </span>
                  </div>

                  {/* Engine Source */}
                  <div className="p-3 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      Processing Engine Source:
                    </span>
                    <span className="text-indigo-300 font-bold">{result.engineSource}</span>
                  </div>

                  {/* Metadata Tags */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Class Metadata Encodings:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {secondaryMetadata.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 font-mono text-[10px] rounded-md border border-slate-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Composition Structure */}
                  <div className="space-y-1 pt-1 text-[11px]">
                    <div className="flex justify-between bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="font-bold text-slate-600">Composition Structure:</span>
                      <span className="text-slate-800 font-mono">{secondaryMetadata.material}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400 font-mono bg-slate-50/50">
                  Upload an image or select an example class, then click "Classify Product Image".
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};