
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Ana Kalkan Formu */}
        <path 
          d="M50 5 L15 15 C15 15 12 65 50 95 C88 65 85 15 85 15 L50 5Z" 
          fill="#1D2D4C" 
          stroke="#E30613" 
          strokeWidth="3"
        />
        
        {/* Kırmızı Şerit */}
        <path 
          d="M18 25 Q50 35 82 25" 
          stroke="#E30613" 
          strokeWidth="2" 
          fill="none"
        />

        {/* Yarasa Silueti (Batman Teması) */}
        <path 
          d="M30 45 C30 45 35 42 40 48 C45 42 55 42 60 48 C65 42 70 45 70 45 C70 45 65 55 50 60 C35 55 30 45 30 45Z" 
          fill="#E30613"
        />

        {/* Top Figürü */}
        <circle cx="50" cy="75" r="8" fill="white" />
        <path d="M45 75 H55 M50 70 V80" stroke="#1D2D4C" strokeWidth="1" />
        
        {/* Kulüp Baş Harfleri */}
        <text 
          x="50" 
          y="35" 
          fill="white" 
          fontSize="10" 
          fontWeight="900" 
          textAnchor="middle" 
          fontFamily="Arial"
          style={{ fontStyle: 'italic' }}
        >
          BGB
        </text>
      </svg>
    </div>
  );
};

export default Logo;
