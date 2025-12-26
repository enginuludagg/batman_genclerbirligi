
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* Arka Plan Daire (Görünürlüğü Garanti Eder) */}
        <circle cx="50" cy="50" r="48" fill="white" />
        
        {/* Ana Kalkan Formu */}
        <path 
          d="M50 10 L20 20 C20 20 17 65 50 90 C83 65 80 20 80 20 L50 10Z" 
          fill="#1D2D4C" 
          stroke="#E30613" 
          strokeWidth="4"
        />
        
        {/* Yarasa Silueti (Batman Vurgusu) */}
        <path 
          d="M35 45 C35 45 40 42 45 47 C50 42 55 42 60 47 C65 42 70 45 70 45 C70 45 65 55 52 60 C38 55 35 45 35 45Z" 
          fill="#E30613"
        />

        {/* Futbol Topu */}
        <circle cx="52" cy="74" r="7" fill="white" stroke="#E30613" strokeWidth="1" />
        <path d="M48 74 H56 M52 70 V78" stroke="#1D2D4C" strokeWidth="1" />
        
        {/* BGB Metni */}
        <text 
          x="50" 
          y="35" 
          fill="white" 
          fontSize="12" 
          fontWeight="900" 
          textAnchor="middle" 
          fontFamily="sans-serif"
          letterSpacing="1"
        >
          BGB
        </text>
      </svg>
    </div>
  );
};

export default Logo;
