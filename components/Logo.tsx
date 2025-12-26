
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ minWidth: '40px', minHeight: '40px', display: 'flex' }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
      >
        {/* Arka Plan Dairesi */}
        <circle cx="50" cy="50" r="48" fill="white" />
        
        {/* Kalkan Gövdesi */}
        <path 
          d="M50 12 L22 22 C22 22 19 65 50 88 C81 65 78 22 78 22 L50 12Z" 
          fill="#1D2D4C" 
          stroke="#E30613" 
          strokeWidth="4"
        />
        
        {/* Batman Yarasa Figürü */}
        <path 
          d="M35 45 C35 45 40 42 45 47 C50 42 55 42 60 47 C65 42 70 45 70 45 C70 45 65 55 52 60 C38 55 35 45 35 45Z" 
          fill="#E30613"
        />

        {/* Futbol Topu */}
        <circle cx="52" cy="74" r="6" fill="white" stroke="#E30613" strokeWidth="1" />
        
        {/* BGB Yazısı */}
        <text 
          x="50" 
          y="36" 
          fill="white" 
          fontSize="13" 
          fontWeight="900" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif"
          style={{ letterSpacing: '0.5px' }}
        >
          BGB
        </text>
      </svg>
    </div>
  );
};

export default Logo;
