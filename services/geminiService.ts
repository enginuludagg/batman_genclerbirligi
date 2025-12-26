
import { GoogleGenAI } from "@google/genai";
import { AppContextData, Student, Drill } from "../types";

/**
 * AI istemcisini tazeleyerek API key güncelliğini korur.
 */
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * BGB AI Asistanı için ana fonksiyon.
 */
export const getAICoachResponse = async (userInput: string, context: AppContextData) => {
  const ai = getAIClient();
  const systemInstruction = `
    Sen Batman Gençlerbirliği (BGB) Spor Kulübü'nün resmi yapay zeka asistanısın.
    Batman/Türkiye merkezli bir futbol ve voleybol akademisisin.
    Görevlerin: 
    1. Antrenörlere teknik tavsiyeler vermek.
    2. Kulüp verilerini (sporcu sayısı: ${context.students.length}) analiz etmek.
    3. Batman'ın yerel spor kültürüne uygun, motive edici bir dille konuşmak.
    Kısa, öz ve profesyonel bir antrenör (Hoca) gibi yanıt ver.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: userInput }] }],
      config: { 
        systemInstruction,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("API yanıtı boş döndü.");
    
    return { text, functionCalls: [] };
  } catch (error) {
    console.error("BGB AI Error:", error);
    return { 
      text: "Hocam şu an bağlantıda bir sorun var. Lütfen birazdan tekrar deneyin veya internetinizi kontrol edin.", 
      functionCalls: [] 
    };
  }
};

/**
 * Sporcu için karne notu üretir.
 */
export const getCoachSuggestions = async (student: Student): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `${student.name} (${student.age} yaş) için gelişim notu yaz.` }] }],
      config: { 
        systemInstruction: "Sen profesyonel bir futbol akademisi teknik direktörüsün.",
      }
    });
    return response.text || "Çalışmaya devam, potansiyelin yüksek!";
  } catch (error) {
    return "Gelişimini yakından takip ediyorum!";
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
      contents: [{ parts: [{ text: `${drill.title} antrenmanı için teknik ipucu ver.` }] }],
      config: { 
        systemInstruction: "Kısa ve öz teknik direktör tavsiyesi ver.",
      }
    });
    return response.text || "Hareketi doğru formda yapmaya odaklan.";
  } catch (error) {
    return "Tekrar ve odaklanma başarının anahtarıdır.";
  }
};
