import * as fs from "fs";
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not found. AI features will be disabled.');
}

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export async function generateContentRecommendations(userId: string, contentHistory: any[]): Promise<string[]> {
  if (!ai) {
    throw new Error('AI service not available. Please configure GEMINI_API_KEY.');
  }

  const prompt = `Based on this user's content history: ${JSON.stringify(contentHistory.slice(-10))}, 
  suggest 5 relevant content topics they might want to create next. 
  Return as a JSON array of strings with topic suggestions.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "array",
        items: { type: "string" }
      }
    },
    contents: prompt,
  });

  return JSON.parse(response.text || "[]");
}

export async function enhanceArticleContent(title: string, content: string): Promise<{
  enhancedContent: string;
  suggestions: string[];
  seoKeywords: string[];
}> {
  if (!ai) {
    throw new Error('AI service not available. Please configure GEMINI_API_KEY.');
  }

  const prompt = `Analyze and enhance this article:
  Title: ${title}
  Content: ${content}
  
  Provide:
  1. Enhanced content with better structure and flow
  2. Content improvement suggestions
  3. SEO keywords
  
  Return as JSON with fields: enhancedContent, suggestions (array), seoKeywords (array)`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          enhancedContent: { type: "string" },
          suggestions: { type: "array", items: { type: "string" } },
          seoKeywords: { type: "array", items: { type: "string" } }
        }
      }
    },
    contents: prompt,
  });

  return JSON.parse(response.text || '{"enhancedContent":"","suggestions":[],"seoKeywords":[]}');
}

export async function generateProductDescription(productName: string, features: string[]): Promise<{
  description: string;
  marketingCopy: string;
  tags: string[];
}> {
  if (!ai) {
    throw new Error('AI service not available. Please configure GEMINI_API_KEY.');
  }

  const prompt = `Create compelling product content for:
  Product: ${productName}
  Features: ${features.join(', ')}
  
  Generate:
  1. Detailed product description
  2. Marketing copy for sales
  3. Relevant tags for categorization
  
  Return as JSON with fields: description, marketingCopy, tags (array)`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          description: { type: "string" },
          marketingCopy: { type: "string" },
          tags: { type: "array", items: { type: "string" } }
        }
      }
    },
    contents: prompt,
  });

  return JSON.parse(response.text || '{"description":"","marketingCopy":"","tags":[]}');
}

export async function analyzeContentPerformance(analyticsData: any[]): Promise<{
  insights: string[];
  recommendations: string[];
  trends: { metric: string; trend: "up" | "down" | "stable"; value: number }[];
}> {
  if (!ai) {
    throw new Error('AI service not available. Please configure GEMINI_API_KEY.');
  }

  const prompt = `Analyze this content performance data: ${JSON.stringify(analyticsData)}
  
  Provide:
  1. Key insights about content performance
  2. Actionable recommendations for improvement
  3. Trend analysis for key metrics
  
  Return as JSON with fields: insights (array), recommendations (array), trends (array with metric, trend, value)`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          insights: { type: "array", items: { type: "string" } },
          recommendations: { type: "array", items: { type: "string" } },
          trends: {
            type: "array",
            items: {
              type: "object",
              properties: {
                metric: { type: "string" },
                trend: { type: "string", enum: ["up", "down", "stable"] },
                value: { type: "number" }
              }
            }
          }
        }
      }
    },
    contents: prompt,
  });

  return JSON.parse(response.text || '{"insights":[],"recommendations":[],"trends":[]}');
}