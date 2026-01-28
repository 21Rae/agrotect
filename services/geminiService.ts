
import { GoogleGenAI, Type } from "@google/genai";
import { SensorData, PlantHealthAnalysis } from "../types";

export const analyzeSensorData = async (zoneName: string, crop: string, data: SensorData): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an expert hydroponics AI. Analyze the following data for ${zoneName} growing ${crop}:
    - pH: ${data.pH}
    - Temperature: ${data.temp}°C
    - Humidity: ${data.humidity}%
    - Light: ${data.light} lux
    - EC: ${data.ec} mS/cm

    Provide a JSON assessment.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, description: "OPTIMAL, WARNING, or CRITICAL" },
          summary: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                parameter: { type: Type.STRING },
                action: { type: Type.STRING },
                priority: { type: Type.STRING },
                rationale: { type: Type.STRING }
              }
            }
          }
        },
        required: ["status", "summary", "recommendations"]
      }
    }
  });
  
  return JSON.parse(response.text || '{}');
};

export const analyzePlantImage = async (base64Image: string, crop: string): Promise<PlantHealthAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: `Analyze the health of this ${crop} plant. Identify any diseases, pests, or deficiencies. Return JSON.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          healthScore: { type: Type.NUMBER },
          detectedIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
          severity: { type: Type.STRING },
          treatmentPlan: { type: Type.STRING },
          confidence: { type: Type.NUMBER }
        },
        required: ["healthScore", "detectedIssues", "severity", "treatmentPlan", "confidence"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const predictYield = async (historicalData: any[]): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Predict harvest yield based on these 24h metrics: ${JSON.stringify(historicalData)}. Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedYieldKg: { type: Type.NUMBER },
          harvestDate: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          optimizationTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
