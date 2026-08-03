// 1. Core Generic API Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

// 2. Chatbot Types
export interface ChatMessageRequest {
  message: string;
}

export interface ChatMessageResponseData {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  intentTag?: string;
  confidence?: number;
  source?: string;
  category?: string;
}

export interface ChatMessage extends ChatMessageResponseData {}

export interface FAQIntent {
  tag: string;
  patterns: string[];
  responses: string[];
  category: string;
}

// 3. Vision Types
export interface FaceRecognitionResponseData {
  id: string;
  customerId: string;
  customerName: string;
  status: string;
  loyaltyTier: string;
  loyaltyPoints: number;
  visitCount: number;
  confidence: number;
  timestamp: string;
  avatar?: string;
  note?: string;
}

export interface CustomerVisit extends FaceRecognitionResponseData {}

export interface ProductClassificationResponseData {
  category: string;
  confidence: number;
  subCategory: string;
  estimatedPriceRange: string;
  engineSource: string;
  tags?: string[];
  attributes?: Record<string, string>;
  summary?: string;
  timestamp?: string;
}

export interface ProductClassificationResult extends ProductClassificationResponseData {}

// 4. NLP Types
export interface AspectRating {
  aspect: string;
  sentiment: string;
  score: number;
}

export interface SentimentResponseData {
  originalText: string;
  cleanedText: string;
  tokens: string[];
  stopwordsRemoved: string[];
  sentiment: string;
  confidence: number;
  polarityScore: number;
  aspects: AspectRating[];
  summary: string;
  timestamp: string;
}

export interface SentimentAnalysisResult extends SentimentResponseData {}

// 5. Dashboard & Analytics Types
export interface DashboardStats {
  totalVisitsToday: number;
  uniqueCustomersToday?: number;
  returningCustomerRate: number;
  averageSentimentScore: number;
  sentimentBreakdown?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  categoryDistribution?: {
    category: string;
    count: number;
    percentage: number;
  }[];
  visitTrend?: {
    time: string;
    visits: number;
    vips: number;
  }[];
  recentVisits: CustomerVisit[];
  systemStatus?: {
    cvModule: string;
    nlpModule: string;
    chatbotModule: string;
    pipelineStatus: string;
  };
}

export interface ApiEndpointSpec {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  requestBodySample?: Record<string, any>;
  responseBodySample?: Record<string, any>;
}