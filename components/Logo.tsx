
import React, { useEffect, useState } from 'react';

const getDirectUrl = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
  }
  return url;
};

const DEFAULT_ID = "1T6HGO_QAqUAVghAwgWTh-mtyG3d67Gup";
const GLOBAL_LOGO_URL = `https://lh3.googleusercontent.com/d/${DEFAULT_ID}`; 

interface LogoProps {
  className?: string;
  overrideUrl?: string | null;
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12", overrideUrl }) => {
  const [currentLogo, setCurrentLogo] = useState<string>(GLOBAL_LOGO_URL);
  const [hasError, setHasError] = useState(false);

  const updateLogo = () => {
    if (overrideUrl) {
      setCurrentLogo(getDirectUrl(overrideUrl));
      setHasError(false);
      return;
    }
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
    if (!overrideUrl) {
      window.addEventListener('storage', updateLogo);
      window.addEventListener('logoUpdated', updateLogo);
    }
    
    return () => {
      window.removeEventListener('storage', updateLogo);
      window.removeEventListener('logoUpdated', updateLogo);
    };
  }, [overrideUrl]);

  return (
    <div className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}>
      <img 
        src={hasError || !currentLogo ? GLOBAL_LOGO_URL : currentLogo} 
        alt="BGB Logo" 
        className="w-full h-full object-contain block align-middle transition-opacity duration-300"
        style={{ 
          imageRendering: '-webkit-optimize-contrast', // Chrome/Safari için netleştirme
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)' // GPU render zorlama
        }}
        crossOrigin="anonymous"
        onError={() => {
          if (!hasError) setHasError(true);
        }}
      />
    </div>
  );
};

export default Logo;
