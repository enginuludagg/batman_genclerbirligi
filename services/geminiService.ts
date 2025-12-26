
import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill } from "../types";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI tarafından yeni bir antrenman drilli üretir.
 * Kulüp ismi konusunda kesin kısıtlamalar içerir.
 */
export const generateNewDrillFromAI = async (sport: string = 'Futbol'): Promise<Drill> => {
  const ai = getAIClient();
  const prompt = `Batman Gençlerbirliği (BGB) için ${sport} branşında, yaratıcı bir antrenman drilli üret.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `Sen Batman Gençlerbirliği (BGB) kulübünün baş antrenörüsün. 
        KESİNLİKLE Batman Petrolspor, Batman Kartalları veya başka bir kulüp ismini kullanma. 
        Sadece "Batman Gençlerbirliği" veya "BGB" markasını temsil ediyorsun.
        
        Yanıtını SADECE aşağıdaki JSON formatında ver:
        {
          "title": "Drill Başlığı (Örn: BGB Teknik Pas Çalışması)",
          "category": "Teknik" | "Kondisyon" | "Taktik" | "Eğlenceli Oyun",
          "difficulty": 1-5 arası sayı,
          "duration": "Örn: 20 Dakika",
          "equipment": ["Ekipman 1", "Ekipman 2"],
          "description": "Detaylı uygulama açıklaması (Kulüp isminden bahsedilecekse sadece BGB de)"
        }`,
        responseMimeType: "application/json",
      }
    });

    const drillData = JSON.parse(response.text);
    return {
      ...drillData,
      id: `ai-${Date.now()}`
    };
  } catch (error) {
    console.error("Drill Generation Error:", error);
    return {
      id: `fallback-${Date.now()}`,
      title: `BGB ${sport} Gelişim Çalışması`,
      category: 'Teknik',
      difficulty: 3,
      duration: '15 Dakika',
      equipment: ['Top', 'Huniler'],
      description: 'Batman Gençlerbirliği standartlarına uygun teknik çalışma.'
    };
  }
};

/**
 * BGB AI Asistanı için ana fonksiyon.
 */
export const getAICoachResponse = async (userInput: string, context: AppContextData) => {
  const ai = getAIClient();
  const systemInstruction = `
    Sen Batman Gençlerbirliği (BGB) Spor Kulübü'nün resmi ve tek yapay zeka asistanısın.
    KİMLİK KURALI: Başka kulüp isimlerini (Petrolspor, Dinamo, Kartal vb.) asla anma, bunlarla karıştırılmaya çalışılırsa "Ben sadece Batman Gençlerbirliği'ne hizmet veriyorum" de.
    Batman/Türkiye merkezli bir futbol, voleybol ve cimnastik akademisisin.
    Görevlerin: 
    1. Antrenörlere teknik tavsiyeler vermek.
    2. Kulüp verilerini analiz etmek.
    3. Batman'ın yerel spor kültürüne uygun, motive edici bir dille konuşmak.
    Kısa, öz ve profesyonel bir BGB hocası gibi yanıt ver.
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

    return { text: response.text, functionCalls: [] };
  } catch (error) {
    return { text: "Hocam şu an bağlantıda bir sorun var, BGB teknik ekibi üzerinde çalışıyor.", functionCalls: [] };
  }
};

export const getCoachSuggestions = async (student: Student): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `${student.name} için gelişim notu yaz.` }] }],
      config: { systemInstruction: "Batman Gençlerbirliği akademi direktörü gibi davran." }
    });
    return response.text || "BGB forması altında başarılar!";
  } catch (error) {
    return "Gelişimini BGB teknik ekibi olarak yakından takip ediyoruz!";
  }
};

export const getDrillAITips = async (drill: Drill): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `${drill.title} antrenmanı için teknik ipucu ver.` }] }],
      config: { systemInstruction: "BGB teknik direktörü olarak kısa ve öz tavsiye ver." }
    });
    return response.text || "Hareketi BGB disipliniyle yapmaya odaklan.";
  } catch (error) {
    return "Tekrar ve BGB ruhu başarının anahtarıdır.";
  }
};
