
import React, { useEffect, useState } from 'react';

/**
 * Google Drive linklerini doğrudan resim URL'sine dönüştürür.
 * Bu sayede Drive üzerinden paylaşılan resimler uygulamada görünebilir.
 */
const getDirectUrl = (url: string): string => {
  if (!url) return url;
  if (url.includes('drive.google.com')) {
    // drive.google.com/file/d/ID/view formatı için
    const fileDMatch = url.match(/\/d\/(.+?)\/([^\/\?]+)?/);
    if (fileDMatch && fileDMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${fileDMatch[1]}`;
    }
    // drive.google.com/open?id=ID formatı için
    const idMatch = url.match(/id=(.+?)(&|$)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }
  return url;
};

/**
 * Gönderdiğiniz Google Drive linki varsayılan logo olarak tanımlandı.
 */
const GLOBAL_LOGO_URL = "https://drive.google.com/file/d/1T6HGO_QAqUAVghAwgWTh-mtyG3d67Gup/view?usp=sharing"; 

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  const [currentLogo, setCurrentLogo] = useState<string>(getDirectUrl(GLOBAL_LOGO_URL));

  useEffect(() => {
    const updateLogo = () => {
      const savedLogo = localStorage.getItem('bgb_custom_logo');
      if (savedLogo) {
        setCurrentLogo(getDirectUrl(savedLogo));
      } else {
        setCurrentLogo(getDirectUrl(GLOBAL_LOGO_URL));
      }
    };

    updateLogo();

    // Diğer bileşenlerden (Settings gibi) gelen değişiklikleri dinle
    window.addEventListener('storage', updateLogo);
    window.addEventListener('logoUpdated', updateLogo);
    
    return () => {
      window.removeEventListener('storage', updateLogo);
      window.removeEventListener('logoUpdated', updateLogo);
    };
  }, []);

  const isDefaultSvgNeeded = !currentLogo || currentLogo === "";

  if (!isDefaultSvgNeeded) {
    return (
      <div className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}>
        <img 
          src={currentLogo} 
          alt="BGB Logo" 
          className="w-full h-full object-contain transition-opacity duration-300"
          onError={() => {
            console.warn("Logo yüklenemedi, yedek logoya dönülüyor.");
            setCurrentLogo("");
          }}
        />
      </div>
    );
  }

  // Varsayılan BGB SVG Logosu (Resim yüklenemezse veya bulunamazsa yedek olarak görünür)
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="white" />
        <path d="M50 12 L22 22 C22 22 19 65 50 88 C81 65 78 22 78 22 L50 12Z" fill="#1D2D4C" stroke="#E30613" strokeWidth="4"/>
        <text x="50" y="55" fill="#E30613" fontSize="20" fontWeight="900" textAnchor="middle">BGB</text>
      </svg>
    </div>
  );
};

export default Logo;
