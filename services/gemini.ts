
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedBrandName, SentimentResult, BrandContext } from "../types";

export class GeminiService {
  private injectContext(basePrompt: string, context: BrandContext | null): string {
    if (!context) return basePrompt;
    
    const contextHeader = `
[BRAND CONTEXT]
Industry: ${context.industry}
Tone: ${context.tone}
Audience: ${context.target_audience}
Personality: ${context.brand_personality}
Keywords: ${context.keywords.join(', ')}
[/BRAND CONTEXT]

`;
    return contextHeader + basePrompt;
  }

  async generateBrandNames(context: BrandContext | null): Promise<GeneratedBrandName[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const basePrompt = `Generate 5 creative, memorable, and industry-disruptive brand names. Provide a short rationale for each.`;
    const prompt = this.injectContext(basePrompt, context);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              meaning: { type: Type.STRING }
            },
            required: ["name", "meaning"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse brand names", e);
      return [];
    }
  }

  async generateLogo(userPrompt: string, context: BrandContext | null): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base = `A professional, minimalist logo. High-end branding identity. Description: ${userPrompt}`;
    const prompt = this.injectContext(base, context);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  }

  async generateContent(type: 'tagline' | 'mission' | 'social', context: BrandContext | null): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const promptMap = {
      tagline: "3 catchy, memorable high-impact taglines",
      mission: "a powerful mission statement (max 2 sentences)",
      social: "3 engaging social media post ideas with captions"
    };

    const base = `Generate ${promptMap[type]} tailored specifically to the brand context provided.`;
    const prompt = this.injectContext(base, context);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    return response.text || "No content generated.";
  }

  async analyzeSentiment(text: string): Promise<SentimentResult> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the branding sentiment of the following text: "${text}". Provide a detailed breakdown of scores (0-100).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            score: { type: Type.NUMBER },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                trust: { type: Type.NUMBER },
                excitement: { type: Type.NUMBER },
                reliability: { type: Type.NUMBER }
              },
              required: ["trust", "excitement", "reliability"]
            },
            summary: { type: Type.STRING }
          },
          required: ["sentiment", "score", "breakdown", "summary"]
        }
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      throw new Error("Sentiment analysis failed");
    }
  }

  async chat(history: any[], message: string, context: BrandContext | null) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemPrompt = `You are BrandCraft Assistant, an expert branding consultant. You help users build world-class brands. ` +
      (context ? `The user's current brand context is: ${context.industry} with a ${context.tone} tone. Use this context to personalize your advice.` : "No context provided yet.");

    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: systemPrompt
      }
    });
    
    const result = await chat.sendMessage({ message });
    return result.text;
  }
}
