
import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill, AppMode } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

/**
 * BGB AKADEMİ DRILL KÜTÜPHANESİ
 * Kaynaklar: TFF Çocuk Futbolu Eğitim Kitapçığı & 300 Soccer Drills (Tom Sauder)
 */
const BGB_KNOWLEDGE_BASE = {
  drills: [
    // --- ISINMA & KOORDİNASYON (Kaynak: 300 Soccer Drills - Warm-Up) ---
    { 
      title: "Top Taşıma Yarışı (Ball Transport)", 
      category: "Eğlenceli Oyun", 
      difficulty: 1, 
      sport: "Futbol",
      ageGroup: "U8-U10",
      duration: "10 Dakika", 
      equipment: ["Toplar", "Kare Alanlar"], 
      description: "Alan içine rastgele toplar yerleştirilir. Oyuncular koşup topların üzerinden atlar. İşaretle birlikte topu ellerine alıp bir sonraki kareye taşırlar. Amaç: Top hissi ve motor beceri." 
    },
    { 
      title: "Zincirleme Reaksiyon (Relay Race)", 
      category: "Kondisyon", 
      difficulty: 2, 
      sport: "Futbol",
      ageGroup: "U10-U12",
      duration: "12 Dakika", 
      equipment: ["Huniler"], 
      description: "Gruplar halinde el ele tutuşarak yapılan bayrak yarışı. Oyuncular kopmadan huninin etrafından dönmelidir. Amaç: Takım uyumu ve koordinasyon." 
    },
    { 
      title: "Reaksiyon Ebeleme (Reaction Tag)", 
      category: "Kondisyon", 
      difficulty: 3, 
      sport: "Futbol",
      ageGroup: "U10-U14",
      duration: "10 Dakika", 
      equipment: ["Huniler"], 
      description: "A ve B takımı 2m mesafeyle yüz yüze durur. Antrenör 'A' derse A takımı arkadaki hedefe kaçar, B kovalar. Yakalanan elenir. Amaç: İşitsel reaksiyon ve patlayıcı sürat." 
    },

    // --- TEKNİK GELİŞİM (Kaynak: 300 Soccer Drills - Ball Handling) ---
    { 
      title: "Kareler Arası Dripling", 
      category: "Teknik", 
      difficulty: 2, 
      sport: "Futbol",
      ageGroup: "U10-U12",
      duration: "15 Dakika", 
      equipment: ["4 Huni", "Top"], 
      description: "İki kare alan arasında top sürülür. Giderken sağ ayak dışı, dönerken sol ayak içi kullanılır. Topun ayaktan açılmamasına dikkat edilir. Amaç: Top kontrolü." 
    },
    { 
      title: "Kaleyi Koru (Protect the Castle)", 
      category: "Eğlenceli Oyun", 
      difficulty: 2, 
      sport: "Futbol",
      ageGroup: "U8-U12",
      duration: "15 Dakika", 
      equipment: ["Büyük Huni", "Toplar"], 
      description: "Ortada bir büyük huni (kale) ve onu koruyan bir oyuncu. Diğer oyuncular dripling yaparak yaklaşıp huniyi topla vurmaya çalışır. Vuran koruyucu olur." 
    },
    { 
      title: "Vur - Yakala - At (Kick-Pick-Throw)", 
      category: "Koordinasyon", 
      difficulty: 2, 
      sport: "Futbol",
      ageGroup: "U8-U12",
      duration: "10 Dakika", 
      equipment: ["Top"], 
      description: "Oyuncu topu ayakla sürer, düdükle topu eline alıp havaya atar, tekrar ayağıyla kontrol edip sürmeye devam eder. Amaç: El-ayak koordinasyonu." 
    },

    // --- TAKTİK & OYUN ZEKASI (Kaynak: TFF & 300 Soccer Drills - Tactical) ---
    { 
      title: "1'e 1 Yön Değiştirme", 
      category: "Taktik", 
      difficulty: 4, 
      sport: "Futbol",
      ageGroup: "U12-U16",
      duration: "20 Dakika", 
      equipment: ["2 Küçük Kale", "Top"], 
      description: "Hücumcu topu alır, savunmacı karşılar. Hücumcu aniden yön değiştirip iki kaleden birine gol yapmaya çalışır. Amaç: Aldatmaca ve karar verme hızı." 
    },
    { 
      title: "Kanat Organizasyonu (Flank Attack)", 
      category: "Taktik", 
      difficulty: 4, 
      sport: "Futbol",
      ageGroup: "U14-U19",
      duration: "25 Dakika", 
      equipment: ["Tam Saha", "Toplar"], 
      description: "4v4 oyun. Kenar çizgilerde 'tarafsız' oyuncular var. Top kenara oynandığında tarafsız oyuncu bekletmeden orta yapar. Goller sadece ortadan gelen topla atılır." 
    },
    { 
      title: "4'e 2 Rondo (Passing)", 
      category: "Teknik", 
      difficulty: 3, 
      sport: "Futbol",
      ageGroup: "U12-U19",
      duration: "15 Dakika", 
      equipment: ["Kare Alan", "Top"], 
      description: "Klasik 4'e 2 pas çalışması. 4 oyuncu paslaşır, ortadaki 2 oyuncu kapmaya çalışır. Savunmacıların arasından atılan pas 2 puan. Amaç: Pas açısı ve baskı." 
    },
    { 
      title: "Hızlı Geçiş (Transition Game)", 
      category: "Taktik", 
      difficulty: 5, 
      sport: "Futbol",
      ageGroup: "U14-U19",
      duration: "20 Dakika", 
      equipment: ["Top", "Yelek"], 
      description: "Yarım sahada 6v6. Savunma takımı topu kazandığı anda en hızlı şekilde orta sahadaki 2 küçük hedefe pas atmalıdır. Hücum takımı topu kaybedince hemen baskı yapar." 
    },

    // --- FİZİKSEL PERFORMANS (Kaynak: TFF - Aerobik & Sürat) ---
    { 
      title: "Sprint ve Şut (Sprint & Score)", 
      category: "Kondisyon", 
      difficulty: 4, 
      sport: "Futbol",
      ageGroup: "U13-U19",
      duration: "15 Dakika", 
      equipment: ["Huni", "Kale"], 
      description: "Ceza sahası dışından, antrenör topu yuvarlar. Oyuncu %100 sprint ile topa koşar ve tek vuruşla gol yapmaya çalışır. Ardından geri geri koşarak yerine döner." 
    },
    { 
      title: "Çeviklik Parkuru (Agility Circuit)", 
      category: "Kondisyon", 
      difficulty: 3, 
      sport: "Futbol",
      ageGroup: "U10-U16",
      duration: "20 Dakika", 
      equipment: ["Merdiven", "Çember", "Engel"], 
      description: "İstasyon çalışması: 1. Merdiven (frekans), 2. Çift ayak sıçrama, 3. Yan koşu, 4. 10m Sprint. Dinlenme aralığı 1:3 olmalıdır." 
    },

    // --- KALECİ ÖZEL (Kaynak: 300 Soccer Drills - Goalkeeping) ---
    { 
      title: "Refleks Kurtarış (Rapid Fire)", 
      category: "Teknik", 
      difficulty: 4, 
      sport: "Futbol",
      ageGroup: "Kaleci",
      duration: "10 Dakika", 
      equipment: ["5 Top"], 
      description: "Antrenör penaltı noktasından elindeki 5 topu arka arkaya farklı köşelere atar. Kaleci kurtarıştan sonra hemen kalkıp pozisyon almalıdır." 
    },
    { 
      title: "Yan Top ve Dağıtım", 
      category: "Teknik", 
      difficulty: 3, 
      sport: "Futbol",
      ageGroup: "Kaleci",
      duration: "15 Dakika", 
      equipment: ["Toplar"], 
      description: "Kenardan yapılan ortayı kaleci en yüksek noktada yakalar ve hiç beklemeden eliyle orta sahadaki hedefe (bek oyuncusu) topu fırlatır." 
    },

    // --- VOLEYBOL (Ekstra) ---
    { 
      title: "Manşet Duvar Tenisi", 
      category: "Teknik", 
      difficulty: 2, 
      sport: "Voleybol",
      ageGroup: "U10-U14",
      duration: "15 Dakika", 
      equipment: ["Duvar", "Top"], 
      description: "Oyuncu duvara karşı manşet çalışır. Topu yere düşürmeden en çok sektiren kazanır. Dizler bükük, kollar gergin." 
    }
  ],
  responses: [
    "TFF ve uluslararası kaynaklardan derlediğim drillerle antrenman programını güncelledim.",
    "Sporcuların yaş grubuna uygun (U10-U16) temel teknik, taktik ve kondisyon drilleri seçtim.",
    "Yüklenen dökümanlardaki 'Oyunla Eğitim' prensibini bu programa yansıttım."
  ]
};

export const generateNewDrillFromAI = async (sport: string = 'Futbol'): Promise<Drill> => {
  // Basitleştirilmiş Drill Üretici: API Key yoksa havuzdan rastgele seçer.
  const getRandomDrill = () => {
    const relevant = BGB_KNOWLEDGE_BASE.drills.filter((d: any) => d.sport === sport);
    const pool = relevant.length > 0 ? relevant : BGB_KNOWLEDGE_BASE.drills;
    const item = pool[Math.floor(Math.random() * pool.length)];
    return { ...item, id: `auto-${Date.now()}` } as Drill;
  };

  if (!process.env.API_KEY) return getRandomDrill();

  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `${sport} için TFF/TVF altyapı standartlarında U12 seviyesinde yaratıcı bir antrenman drilli öner.` }] }],
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
          }
        }
      }
    });

    const text = response.text;
    if (!text) return getRandomDrill();
    return { ...JSON.parse(text), id: `ai-${Date.now()}` };
  } catch (e) {
    return getRandomDrill();
  }
};

export const getAICoachResponse = async (userInput: string, context: AppContextData, mode: AppMode) => {
  if (!process.env.API_KEY) {
     const randomResponse = BGB_KNOWLEDGE_BASE.responses[Math.floor(Math.random() * BGB_KNOWLEDGE_BASE.responses.length)];
     return { text: randomResponse };
  }
  const ai = getAIClient();
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: userInput }] }]
    });
    return { text: res.text || "Anlaşıldı hocam." };
  } catch (e) {
    return { text: "Bağlantı hatası oluştu." };
  }
};

export const getCoachSuggestions = async (student: Student) => {
  return "Gelişimi olumlu yönde devam ediyor. Koordinasyon çalışmaları arttırılabilir.";
};

export const getDrillAITips = async (drill: Drill) => {
  return "Oyuncuların çevre kontrolü yapmasına ve vücut pozisyonuna dikkat edin.";
};
