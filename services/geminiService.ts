
import { GoogleGenAI } from "@google/genai";
import { AppContextData, Student, Drill } from "../types";

/**
 * AI istemcisini her çağrıda tazeleyerek API key güncelliğini korur.
 */
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * BGB AI Asistanı için ana fonksiyon.
 */
export const getAICoachResponse = async (userInput: string, context: AppContextData) => {
  const ai = getAIClient();
  const systemInstruction = `
    Sen Batman Gençlerbirliği (BGB) Spor Kulübü'nün resmi yapay zeka asistanısın.
    Görevlerin: 
    1. Antrenörlere teknik ve idari konularda veri odaklı tavsiyeler vermek.
    2. Batman ilinin ve kulübün ruhuna uygun, motive edici ve profesyonel bir dil kullanmak.
    3. Kulüp verilerini (sporcu sayısı: ${context.students.length}, branşlar, antrenmanlar) kullanarak soruları yanıtlamak.
    Dilin her zaman disiplinli ama samimi bir antrenör (Hoca) dili olmalı.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: userInput }] }],
      config: { 
        systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    const text = response.text;
    if (!text) throw new Error("API boş yanıt döndürdü.");
    
    return { text, functionCalls: [] };
  } catch (error) {
    console.error("BGB AI Error:", error);
    return { 
      text: "Hocam şu an teknik bir kesinti yaşıyorum. Lütfen API anahtarınızı (process.env.API_KEY) kontrol edin veya birazdan tekrar deneyin.", 
      functionCalls: [] 
    };
  }
};

/**
 * Sporcu için karne notu üretir.
 */
export const getCoachSuggestions = async (student: Student): Promise<string> => {
  const ai = getAIClient();
  const prompt = `${student.name} isimli sporcumuz ${student.age} yaşında ve tekniği %${student.stats.technique}. Bu sporcu için kısa, motive edici bir gelişim notu yazar mısın?`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: { 
        systemInstruction: "Sen profesyonel bir futbol akademisi teknik direktörüsün.",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Disiplinli çalışmaya devam, potansiyelin yüksek!";
  } catch (error) {
    return "Gelişimini yakından takip ediyorum, antrenmanlara devam!";
  }
};

/**
 * Antrenman drilleri için teknik ipucu üretir.
 */
export const getDrillAITips = async (drill: Drill): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `${drill.title} çalışması için kritik bir teknik ipucu ver.` }] }],
      config: { 
        systemInstruction: "Kısa ve öz teknik direktör tavsiyesi ver.",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Odaklanma ve tekrar başarının anahtarıdır.";
  } catch (error) {
    return "Hareketi yavaş ve doğru formda yapmaya odaklan.";
  }
};
