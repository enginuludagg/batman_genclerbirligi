import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill, AppMode } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

// --- SABİT KULÜP BİLGİLERİ (Knowledge Base) ---
// AI'nın genel sorulara cevap verebilmesi için gerekli bilgiler
const CLUB_INFO = `
  KULÜP KİMLİĞİ:
  - İsim: Batman Gençlerbirliği (BGB) Spor Kulübü ve Akademisi
  - Kurucu ve Teknik Direktör: Engin Uludağ (TFF C, TVF 2. Kademe, TCF 2. Kademe Antrenör)
  - İletişim: 0505 340 11 01
  - Konum: Batman Merkez, BGB Tesisleri (Gültepe Mah.)
  - Vizyon: "İyi birey, iyi vatandaş, iyi sporcu."
  - Branşlar: Futbol, Voleybol, Cimnastik
  - Yaş Grupları: U10, U11, U12, U13, U14, U15, U16, U17, U18, U19, Minikler.
  - Renkler: Kırmızı - Siyah
  
  EĞİTİM FELSEFESİ:
  - Bilimsel antrenman metotları kullanılır.
  - Sadece sportif değil, ahlaki gelişim de ön plandadır.
  - Veli-Antrenör-Sporcu üçgeninde iletişim esastır.
`;

// --- VARSAYILAN CEVAPLAR (Offline Modu) ---
const FALLBACK_RESPONSES = [
  "Şu an sunucularımıza erişimde kısa süreli bir yoğunluk var. Ancak Engin Hoca'ya 0505 340 11 01 numarasından ulaşabilirsiniz.",
  "Merhaba! Ben BGB Asistanı. Antrenman saatleri, çocukların durumu veya kulüp hakkında bilgi verebilirim.",
  "Verilerinizi şu an çekemiyorum ama genel kulüp işleyişi hakkında sorunuz varsa yanıtlayabilirim."
];

export const generateNewDrillFromAI = async (sport: string = 'Futbol'): Promise<Drill> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return {
      id: `auto-${Date.now()}`,
      title: `${sport} Temel Çalışma`,
      category: 'Teknik',
      difficulty: 2,
      duration: '15 Dakika',
      equipment: ['Top', 'Huni'],
      description: "API Anahtarı girilmediği için varsayılan drill gösteriliyor. Lütfen API Key tanımlayın.",
      ageGroup: 'U12'
    };
  }

  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `${sport} için U12 seviyesinde, TFF/TVF standartlarına uygun, yaratıcı ve detaylı bir antrenman drilli oluştur.` }] }],
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
    if (!text) throw new Error("AI Boş Cevap Döndü");
    return { ...JSON.parse(text), id: `ai-${Date.now()}` };
  } catch (e) {
    console.error("Drill Gen Error:", e);
    return {
      id: `err-${Date.now()}`,
      title: "Pas ve Destek",
      category: 'Teknik',
      difficulty: 1,
      duration: '10 Dakika',
      equipment: ['Top'],
      description: "Yapay zeka servisine ulaşılamadı. Klasik pas çalışması yapabilirsiniz.",
      ageGroup: 'Genel'
    };
  }
};

export const getAICoachResponse = async (userInput: string, context: AppContextData, mode: AppMode, currentStudent?: Student | null) => {
  if (!process.env.API_KEY) {
     // API Key yoksa basit kural tabanlı cevaplar
     const lower = userInput.toLowerCase();
     if (lower.includes('merhaba')) return { text: "Merhaba! BGB Akademi asistanınız hizmetinizde." };
     if (lower.includes('iletişim') || lower.includes('adres')) return { text: "Kulübümüze 0505 340 11 01 numarasından ulaşabilirsiniz." };
     return { text: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)] };
  }

  const ai = getAIClient();
  
  // --- DİNAMİK CONTEXT HAZIRLAMA ---
  let dynamicContext = "";
  let userRoleDescription = "";
  const today = new Date().toLocaleDateString('tr-TR');

  // Ortak veriler (Maçlar vb.)
  const upcomingMatches = context.fixtures
    .filter(f => f.status === 'scheduled')
    .map(f => `- ${f.date} ${f.time}: ${f.homeTeam} vs ${f.awayTeam} (${f.category})`)
    .join('\n');

  if (mode === 'admin') {
    userRoleDescription = "Şu an KULÜP YÖNETİCİSİ (Admin/Antrenör) ile konuşuyorsun. Tüm verilere erişim yetkin var.";
    
    // Admin için özet veriler
    const studentCount = context.students.length;
    const balance = context.finance.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
    
    dynamicContext = `
      YÖNETİCİ VERİLERİ:
      - Toplam Sporcu Sayısı: ${studentCount}
      - Güncel Kasa Bakiyesi: ${balance} TL
      - Planlanmış Maçlar:\n${upcomingMatches || 'Yok'}
      - Bugünün Tarihi: ${today}
    `;

  } else if (mode === 'parent' && currentStudent) {
    userRoleDescription = `Şu an bir SPORCU VELİSİ ile konuşuyorsun. Velisi olduğu öğrenci: ${currentStudent.name}.
    DİKKAT: Sadece bu öğrencinin verilerini ve genel kulüp bilgilerini paylaşabilirsin. Başka öğrencilerin bilgisini veya kulübün finansal durumunu ASLA paylaşma.`;

    const s = currentStudent;
    const stats = s.stats;
    // Öğrencinin maçları
    const myMatches = context.fixtures
      .filter(f => f.category === s.branchId && f.status === 'scheduled')
      .map(f => `${f.date}: ${f.awayTeam}`)
      .join(', ');
    
    // Antrenör notları (Sadece bu öğrenciyi ilgilendiren genel notlar veya gelişim notları)
    // Not: Gerçek hayatta öğrenciye özel notlar ayrı tutulmalı, burada scoutingNotes kullanıyoruz.
    const notes = s.scoutingNotes.map(n => `- ${n.date}: ${n.content} (Yazan: ${n.scoutName})`).join('\n');

    dynamicContext = `
      VELİSİ OLUNAN ÖĞRENCİ DETAYLARI:
      - İsim: ${s.name}
      - Doğum Yılı: ${s.birthYear || 'Belirtilmemiş'}
      - Branş: ${s.sport}
      - Grup: ${s.branchId}
      - Seviye: ${s.level}
      - Durum: ${s.status === 'active' ? 'Aktif' : 'Pasif/İzinli'}
      - Devamlılık: %${s.attendance}
      - Son Antrenman: ${s.lastTraining}
      - Aidat Durumu: ${s.feeStatus === 'Paid' ? 'Ödendi' : s.feeStatus === 'Pending' ? 'Ödeme Bekliyor' : 'Gecikmiş'}
      
      FİZİKSEL VE TEKNİK VERİLER:
      - Hız: ${stats.speed}/100
      - Güç: ${stats.strength}/100
      - Teknik: ${stats.technique}/100
      - Kondisyon: ${stats.stamina}/100
      - Boy: ${s.physicalStats?.height || '?'} cm
      - Kilo: ${s.physicalStats?.weight || '?'} kg
      
      YAKLAŞAN MAÇLARI: ${myMatches || 'Planlanmış maç yok'}
      
      GELİŞİM NOTLARI:
      ${notes || 'Henüz girilmiş bir not yok.'}
    `;
  } else {
    userRoleDescription = "Kullanıcı kimliği belirsiz. Sadece genel kulüp sorularını cevapla.";
    dynamicContext = "Özel veri yok.";
  }

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      config: {
        systemInstruction: `Sen Batman Gençlerbirliği (BGB) Spor Kulübü'nün akıllı asistanısın.
        
        GÖREVİN:
        Kullanıcının sorularını samimi, motive edici ve profesyonel bir dille cevaplamak.
        
        KULLANICI BAĞLAMI:
        ${userRoleDescription}
        
        VERİ KAYNAKLARI:
        1. GENEL KULÜP BİLGİSİ (Herkes Sorabilir):
        ${CLUB_INFO}
        
        2. KİŞİSEL/ÖZEL VERİLER (Sadece yetkili görsün):
        ${dynamicContext}
        
        KURALLAR:
        - Velilere "Çocuğumun durumu nasıl?" sorusunda yukarıdaki FİZİKSEL VE TEKNİK VERİLER'i yorumlayarak cevap ver.
        - "Maç ne zaman?" sorusunda ilgili maç bilgilerini ver.
        - Bilmediğin veya verilerde olmayan bir şey sorulursa uydurma, "Sistemde bu bilgi henüz kayıtlı değil hocam/sayın velim." de.
        - Finansal soruları velilere yanıtlama ("Bu bilgiye erişim yetkiniz yok" de).
        - Kısa, öz ve Türkçe cevap ver.
        `
      }
    });
    return { text: res.text || "Anlaşıldı." };
  } catch (e) {
    console.error("AI Error:", e);
    return { text: "Şu an bağlantıda bir sorun yaşıyorum. Lütfen daha sonra tekrar deneyin." };
  }
};

export const getCoachSuggestions = async (student: Student) => {
  if (!process.env.API_KEY) return "Gelişimi olumlu yönde devam ediyor. Antrenmanlara düzenli katılımı önemli.";
  
  const ai = getAIClient();
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Bu sporcu için kısa (2 cümle), motive edici bir gelişim raporu yaz. Veriler: ${student.sport}, Yaş: ${student.age}, Güç: ${student.stats.strength}, Teknik: ${student.stats.technique}` }] }]
    });
    return res.text || "Sporcumuzun gelişimi devam ediyor.";
  } catch {
    return "Sporcumuzun gelişimi devam ediyor.";
  }
};

export const getDrillAITips = async (drill: Drill) => {
  if (!process.env.API_KEY) return "Bu drilli uygularken oyuncuların sürekli hareket halinde olmasına dikkat edin.";
  
  const ai = getAIClient();
  try {
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `Futbol/Voleybol antrenörü olarak bu drill için tek cümlelik, can alıcı bir ipucu ver: ${drill.title} - ${drill.description}` }] }]
      });
      return res.text || "Tempoyu yüksek tutun.";
  } catch(e) { return "Dikkatli uygulayın."; }
};