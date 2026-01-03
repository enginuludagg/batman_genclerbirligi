import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill, AppMode } from "../types";

/**
 * VITE ortamı için doğru API KEY okuma
 */
const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY tanımlı değil");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * BGB AKADEMİ SABİT BİLGİ HAVUZU (AI yoksa fallback)
 */
const BGB_KNOWLEDGE_BASE = {
  responses: [
    "Antrenman planı yaş grubuna uygun şekilde hazırlanmalıdır.",
    "Teknik gelişim için tekrar sayısı artırılabilir.",
    "Oyunla eğitim prensibi uygulanmalıdır."
  ]
};

/**
 * AI KOÇ YANITI
 */
export const getAICoachResponse = async (
  userInput: string,
  context: AppContextData,
  mode: AppMode,
  currentStudent?: Student | null
): Promise<{ text: string; sources: string[] }> => {
  const ai = getAIClient();
  if (!ai) {
    return {
      text: BGB_KNOWLEDGE_BASE.responses[
        Math.floor(Math.random() * BGB_KNOWLEDGE_BASE.responses.length)
      ],
      sources: []
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: userInput }]
        }
      ]
    });

    return {
      text: response.text || "Anlaşıldı hocam.",
      sources: []
    };
  } catch (e) {
    console.error("Gemini hata:", e);
    return { text: "AI bağlantı hatası oluştu.", sources: [] };
  }
};

/**
 * AI DRILL ÜRETİCİ
 */
export const generateNewDrillFromAI = async (
  sport: string = "Futbol"
): Promise<Drill> => {
  const ai = getAIClient();

  // AI yoksa sabit drill
  if (!ai) {
    return {
      id: `auto-${Date.now()}`,
      title: `${sport} Temel Drilli`,
      category: "Teknik",
      difficulty: 3,
      duration: "20 Dakika",
      ageGroup: "U10-U14",
      equipment: ["Top", "Huni"],
      description: "Temel teknik gelişimi amaçlayan sabit drill."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${sport} için altyapı seviyesinde (U12) bir antrenman drilli üret. JSON formatında olsun.`
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.INTEGER },
            duration: { type: Type.STRING },
            ageGroup: { type: Type.STRING },
            equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING }
          },
          required: ["title", "category", "difficulty", "duration", "description"]
        }
      }
    });

    if (!response.text) throw new Error("Boş yanıt");

    return {
      ...JSON.parse(response.text),
      id: `ai-${Date.now()}`
    };
  } catch (e) {
    console.error("Drill AI hatası:", e);
    return {
      id: `auto-${Date.now()}`,
      title: `${sport} Alternatif Drilli`,
      category: "Teknik",
      difficulty: 2,
      duration: "15 Dakika",
      ageGroup: "Genel",
      equipment: [],
      description: "AI servisi yanıt vermediği için oluşturulan otomatik dril."
    };
  }
};

export const getDrillAITips = async (drill: Drill): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI servisi şu anda kullanılamıyor.";

  try {
      const res = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          {
            role: "user",
            parts: [{ text: `"${drill.title}" antrenmanı için 1 cümlelik teknik ipucu ver.` }]
          }
        ]
      });
      return res.text || "Dikkatli uygulayın.";
  } catch (e) {
    console.error("Drill tip hatası:", e);
    return "Forma dikkat edin.";
  }
};

export const getCoachSuggestions = async (student: Student): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Gelişim devam ediyor (AI Kapalı).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: "user",
          parts: [{ text: `Sporcu ${student.name} için kısa, motive edici bir teknik gelişim notu yaz.` }]
        }
      ]
    });
    return response.text || "Takipteyiz.";
  } catch { return "Gelişim devam ediyor."; }
};