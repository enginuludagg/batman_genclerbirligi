
import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill, AppMode } from "../types";

// Always use new GoogleGenAI({ apiKey: process.env.API_KEY })
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI Servislerinde Hata Yönetimi İçin Yerel Bilgi Bankası (Fallbacks)
 */
const BGB_KNOWLEDGE_BASE = {
  drills: [
    { 
      title: "Pas-Destek Çalışması", 
      category: "Teknik", 
      difficulty: 3, 
      duration: "20 Dakika", 
      equipment: ["Top", "Huni"], 
      description: "İki oyuncu karşılıklı paslaşırken üçüncü oyuncu boş alanlara destek koşuları yapar. Batman GB temel teknik disiplini." 
    },
    { 
      title: "Defansif Yerleşim", 
      category: "Taktik", 
      difficulty: 4, 
      duration: "30 Dakika", 
      equipment: ["Yelek", "Huni"], 
      description: "Takımın bloklar arası mesafesini koruması üzerine yoğunlaşan yerleşim çalışması." 
    }
  ],
  responses: [
    "Hocam şu an sahadayım, analizleri Engin Hoca ile koordine ediyoruz. Birkaç dakika sonra tekrar deneyebilir misiniz?",
    "Batman Gençlerbirliği ruhuyla gelişmeye devam ediyoruz. Sorunuzu not aldım, teknik ekip birazdan değerlendirecek.",
    "BGB Akademi'de her sporcu bizim için özeldir. Şu an veri hattımız yoğun, ancak sporcularımızın gelişimini takipteyiz."
  ]
};

/**
 * AI tarafından yeni bir antrenman drilli üretir.
 */
export const generateNewDrillFromAI = async (sport: string = 'Futbol'): Promise<Drill> => {
  const ai = getAIClient();
  const prompt = `Batman Gençlerbirliği (BGB) için ${sport} branşında, yaratıcı ve öğretici bir antrenman drilli üret.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Sen Batman Gençlerbirliği (BGB) kulübünün baş antrenörüsün. Yanıtını SADECE JSON formatında ver. 
        Category alanı şunlardan biri olmalı: 'Teknik', 'Kondisyon', 'Taktik', 'Eğlenceli Oyun'. 
        Difficulty 1 ile 5 arasında bir tam sayı olmalı.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Drill'in dikkat çekici başlığı" },
            category: { type: Type.STRING, description: "Kategori" },
            difficulty: { type: Type.INTEGER, description: "Zorluk seviyesi 1-5" },
            duration: { type: Type.STRING, description: "Tahmini süre" },
            equipment: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Gerekli ekipman listesi" 
            },
            description: { type: Type.STRING, description: "Uygulama detayları" }
          },
          required: ["title", "category", "difficulty", "duration", "equipment", "description"]
        }
      }
    });

    if (!response || !response.text) throw new Error("AI Busy");
    
    // JSON yanıtını temizle (bazen markdown blockları içinde gelebilir)
    const cleanJson = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const drillData = JSON.parse(cleanJson);
    
    return { 
      ...drillData, 
      id: `ai-${Date.now()}` 
    };
  } catch (error) {
    console.error("AI Drill Generation Failed:", error);
    // Hata durumunda rastgele bir yerel drill dönerek kullanıcıyı bekletmiyoruz
    const fallback = BGB_KNOWLEDGE_BASE.drills[Math.floor(Math.random() * BGB_KNOWLEDGE_BASE.drills.length)];
    return { ...fallback, id: `fb-${Date.now()}` } as Drill;
  }
};

/**
 * BGB AI Asistanı - Ana Fonksiyon
 */
export const getAICoachResponse = async (userInput: string, context: AppContextData, mode: AppMode) => {
  const ai = getAIClient();
  const sports = Array.from(new Set(context.students.map(s => s.sport)));
  
  const systemInstruction = `
    Sen Batman Gençlerbirliği (BGB) Spor Kulübü'nün resmi AI Asistanısın (Engin Hoca'nın Dijital Yardımcısı).
    KULÜP: BGB Akademi, Batman. Branşlar: ${sports.join(', ')}. Sporcu: ${context.students.length}.
    KURAL: Hata mesajı verme. Meşgulsen BGB ruhundan bahset. Kısa öz yanıtla.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: { systemInstruction, temperature: 1, topP: 0.95 }
    });

    return { text: response.text || BGB_KNOWLEDGE_BASE.responses[0] };
  } catch (error) {
    const randomFallback = BGB_KNOWLEDGE_BASE.responses[Math.floor(Math.random() * BGB_KNOWLEDGE_BASE.responses.length)];
    return { text: randomFallback };
  }
};

export const getCoachSuggestions = async (student: Student): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${student.name} için kısa teknik gelişim analizi yaz.`,
      config: { systemInstruction: "BGB teknik direktörü gibi 1 cümlelik profesyonel analiz yaz." }
    });
    return response.text || "Antrenman disipliniyle gelişimini sürdürüyor, teknik çalışmalarına ağırlık vermeli.";
  } catch (error) {
    return "Sporcumuzun fiziksel gelişimi ve taktik disiplini akademi standartlarımıza uygun ilerliyor.";
  }
};

export const getDrillAITips = async (drill: Drill): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${drill.title} çalışması için kritik antrenör ipucu.`,
      config: { systemInstruction: "Teknik direktör gibi 10 kelimelik bir teknik ipucu ver." }
    });
    return response.text || "Tempo ve alan paylaşımına dikkat ederek verimi artırın.";
  } catch (error) {
    return "Doğru teknik ve sürekli tekrar başarının anahtarıdır.";
  }
};
