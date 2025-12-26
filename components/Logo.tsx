
import React, { useEffect, useState } from 'react';

/**
 * Google Drive linklerini doğrudan ve kararlı bir resim URL'sine dönüştürür.
 * lh3.googleusercontent.com formatı tarayıcılar tarafından daha iyi desteklenir.
 */
const getDirectUrl = (url: string): string => {
  if (!url) return url;
  
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      // Daha kararlı olan Google Content sunucusunu kullanıyoruz
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
  }
  return url;
};

// Sizin gönderdiğiniz logonun ID'si
const DEFAULT_ID = "1T6HGO_QAqUAVghAwgWTh-mtyG3d67Gup";
const GLOBAL_LOGO_URL = `https://lh3.googleusercontent.com/d/${DEFAULT_ID}`; 

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  const [currentLogo, setCurrentLogo] = useState<string>(GLOBAL_LOGO_URL);
  const [hasError, setHasError] = useState(false);

  const updateLogo = () => {
    const savedLogo = localStorage.getItem('bgb_custom_logo');
    if (savedLogo && savedLogo !== "") {
      setCurrentLogo(getDirectUrl(savedLogo));
    } else {
      setCurrentLogo(GLOBAL_LOGO_URL);
    }
    setHasError(false);
  };

  useEffect(() => {
    updateLogo();
    window.addEventListener('storage', updateLogo);
    window.addEventListener('logoUpdated', updateLogo);
    
    return () => {
      window.removeEventListener('storage', updateLogo);
      window.removeEventListener('logoUpdated', updateLogo);
    };
  }, []);

  if (hasError || !currentLogo) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#1D2D4C" />
          <path d="M50 12 L22 22 C22 22 19 65 50 88 C81 65 78 22 78 22 L50 12Z" fill="white" />
          <text x="50" y="55" fill="#E30613" fontSize="20" fontWeight="900" textAnchor="middle">BGB</text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}>
      <img 
        src={currentLogo} 
        alt="BGB Logo" 
        className="w-full h-full object-contain"
        crossOrigin="anonymous"
        onError={() => {
          console.warn("Logo yüklenemedi, ID formatı değiştiriliyor...");
          // Hata durumunda uc?id formatını tekrar dene
          if (!currentLogo.includes('uc?')) {
            const id = DEFAULT_ID;
            setCurrentLogo(`https://drive.google.com/uc?export=view&id=${id}`);
          } else {
            setHasError(true);
          }
        }}
      />
    </div>
  );
};

export default Logo;
