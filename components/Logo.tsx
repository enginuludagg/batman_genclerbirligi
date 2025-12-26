
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <img 
        src="https://i.ibb.co/LzhYpDCC/batman-logo.png" 
        alt="Batman GB Logo" 
        className="w-full h-full object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=BGB";
        }}
      />
    </div>
  );
};

export default Logo;
