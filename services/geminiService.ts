
import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill, AppMode } from "../types";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * AI tarafından yeni bir antrenman drilli üretir.
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
        Sadece "Batman Gençlerbirliği" veya "BGB" markasını temsil ediyorsun.
        Yanıtını SADECE aşağıdaki JSON formatında ver:
        {
          "title": "Drill Başlığı",
          "category": "Teknik" | "Kondisyon" | "Taktik" | "Eğlenceli Oyun",
          "difficulty": 1-5 arası sayı,
          "duration": "Örn: 20 Dakika",
          "equipment": ["Ekipman 1"],
          "description": "Uygulama açıklaması"
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
 * BGB AI Asistanı - Ana Fonksiyon
 */
export const getAICoachResponse = async (userInput: string, context: AppContextData, mode: AppMode) => {
  const ai = getAIClient();

  // Hassas verileri mod'a göre filtrele
  const studentCount = context.students.length;
  const activeStudents = context.students.filter(s => s.status === 'active').length;
  const sports = Array.from(new Set(context.students.map(s => s.sport)));
  const sessions = context.sessions.map(s => `${s.day} ${s.time}: ${s.group} - ${s.title}`).join(', ');

  // Admin için ek bağlam (Veli bunu görmez)
  const adminContext = mode === 'admin' ? `
    Hassas Yönetim Verileri:
    - Toplam Aidat Durumu: ${context.finance.filter(f => f.type === 'income').length} işlem.
    - Okunmamış Antrenör Notları: ${context.trainerNotes.filter(n => n.status === 'new').length} adet.
    - Not Özetleri: ${context.trainerNotes.map(n => n.content).slice(0, 5).join(' | ')}
  ` : '';

  const systemInstruction = `
    Sen Batman Gençlerbirliği (BGB) Spor Kulübü'nün resmi AI Asistanısın.
    
    KULLANICI ROLÜ: ${mode.toUpperCase()}
    
    KULÜP VERİLERİ (Bağlam):
    - Kulüp Adı: Batman Gençlerbirliği (BGB)
    - Branşlar: ${sports.join(', ')}
    - Mevcut Sporcu Sayısı: ${studentCount} (${activeStudents} aktif)
    - Haftalık Program: ${sessions}

    KURALLAR:
    1. Kesinlikle başka kulüplerden (Batman Petrolspor vb.) bahsetme.
    2. Eğer kullanıcı bir VELİ ise:
       - Sadece genel kulüp bilgisi, antrenman saatleri ve branşlar hakkında bilgi ver.
       - Finansal verileri, diğer öğrencilerin isimlerini veya hoca raporlarını ASLA paylaşma.
       - "Bu bilgi güvenliğiniz için gizlidir, lütfen kulüp yönetimi ile 05xx numarasından görüşün" şeklinde yönlendir.
    3. Eğer kullanıcı bir YÖNETİCİ ise:
       - Raporları analiz et, eksikleri söyle, program hakkında öneriler ver.
    4. Samimi ama profesyonel, "Hocam" veya "Sayın Velimiz" hitaplarını kullanan bir BGB ruhuyla konuş.
    
    ${adminContext}
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

    return { text: response.text };
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return { text: "Şu an teknik bir yoğunluk yaşıyorum hocam, BGB ekibi duruma müdahale ediyor. Lütfen az sonra tekrar deneyin." };
  }
};

export const getCoachSuggestions = async (student: Student): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `${student.name} (${student.sport} - ${student.age} yaş) için profesyonel bir gelişim notu yaz.` }] }],
      config: { 
        systemInstruction: "Sen bir Batman Gençlerbirliği akademi direktörüsün. Sporcunun verilerine bakarak motive edici ve teknik bir cümle kur. Sadece BGB'den bahset." 
      }
    });
    return response.text || "Gelişimini BGB teknik ekibi olarak yakından takip ediyoruz!";
  } catch (error) {
    return "BGB forması altında başarılar!";
  }
};

export const getDrillAITips = async (drill: Drill): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `${drill.title} çalışmasında nelere dikkat edilmeli?` }] }],
      config: { 
        systemInstruction: "BGB teknik direktörü olarak antrenörüne kısa, vurucu ve teknik bir ipucu ver. 15 kelimeyi geçme." 
      }
    });
    return response.text || "Disiplin ve tekrar başarının anahtarıdır.";
  } catch (error) {
    return "Hareketi BGB disipliniyle yapmaya odaklan.";
  }
};
