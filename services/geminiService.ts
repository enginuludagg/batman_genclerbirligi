
import { GoogleGenAI } from "@google/genai";
import { AppContextData, Student, Drill } from "../types";

/**
 * Creates a fresh AI instance to prevent stale API key issues.
 */
const getAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates development feedback for a student.
 */
export const getCoachSuggestions = async (student: Student): Promise<string> => {
  const ai = getAIInstance();
  const s = student.stats;
  
  const systemPrompt = `
    Sen Batman Gençlerbirliği Spor Kulübü'nün Baş Antrenörüsün.
    Sporcu Analizi ve Karne Notu Hazırlayacaksın.
    
    Sporcu Verileri:
    - İsim: ${student.name}
    - Yaş: ${student.age}
    - Teknik: %${s.technique}, Güç: %${s.strength}, Dayanıklılık: %${s.stamina}
    
    Talimat:
    - Sporcunun zayıf yönlerine odaklanarak samimi bir antrenör diliyle tek cümlelik gelişim notu yaz.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Sporcuya kısa bir karne notu yaz.",
      config: { 
        systemInstruction: systemPrompt,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text || "Antrenmanlara düzenli katılarak gelişmeye devam etmelisin.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Gelişimini yakından takip ediyorum, disiplinli çalışmaya devam et.";
  }
};

/**
 * Generates AI tips for a specific training drill.
 */
export const getDrillAITips = async (drill: Drill): Promise<string> => {
  const ai = getAIInstance();
  
  const systemPrompt = `
    Sen profesyonel bir elit akademi antrenörüsün.
    Antrenman çalışması: ${drill.title}
    Talimat: Bu çalışma için 1 adet çok spesifik teknik ipucu ver.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Kısa teknik ipucu ver.",
      config: { systemInstruction: systemPrompt }
    });
    return response.text || "Hareketi yavaş ve kontrollü yaparak tekniği oturtmaya çalışın.";
  } catch (error) {
    return "Odaklanma ve tekrar sayısı başarının anahtarıdır.";
  }
};

/**
 * Handles AI chat interactions for the Batman GB AI Assistant.
 */
export const getAICoachResponse = async (userInput: string, context: AppContextData) => {
  const ai = getAIInstance();
  const systemPrompt = `Sen Batman GB AI Asistanısın. Kulüp yönetiminde yardımcı ol. Batman Gençlerbirliği Spor Kulübü verilerine erişimin var.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: { systemInstruction: systemPrompt }
    });
    return { text: response.text || "Üzgünüm, şu an cevap veremiyorum.", functionCalls: [] };
  } catch (error) { 
    console.error("Gemini API Error:", error);
    return { text: "Teknik bir hata oluştu. Lütfen sağ üstten API anahtarınızı kontrol edin.", functionCalls: [] }; 
  }
};
