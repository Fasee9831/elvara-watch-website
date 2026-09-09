import React from 'react';

export interface TechnicalCalloutProps {
  progress?: number;
  className?: string;
}

export const TechnicalCallout: React.FC<TechnicalCalloutProps> = ({ progress = 0.5, className = '' }) => {
  // Calculate active callout stage based on scroll progress (0.0 to 1.0)
  const showCallout1 = progress >= 0.15 && progress <= 0.45;
  const showCallout2 = progress >= 0.35 && progress <= 0.65;
  const showCallout3 = progress >= 0.55 && progress <= 0.85;
  const showCallout4 = progress >= 0.70 && progress <= 0.98;

  return (
    <div className={`absolute inset-0 pointer-events-none z-30 ${className}`}>
      {/* SVG Layer for Precision Target Lines & SVG Reticles */}
      <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Reticle 1: Top Left - Case Architecture */}
        <g className={`transition-opacity duration-500 ${showCallout1 ? 'opacity-100' : 'opacity-0'}`}>
          <path
            d="M 160 160 L 300 230"
            stroke="#D4AF37"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
          <circle cx="300" cy="230" r="4" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
          <circle cx="300" cy="230" r="1.5" fill="#D4AF37" />
        </g>

        {/* Reticle 2: Top Right - Dial & Sapphire Bevels */}
        <g className={`transition-opacity duration-500 ${showCallout2 ? 'opacity-100' : 'opacity-0'}`}>
          <path
            d="M 640 170 L 500 250"
            stroke="#D4AF37"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
          <circle cx="500" cy="250" r="4" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
          <circle cx="500" cy="250" r="1.5" fill="#D4AF37" />
        </g>

        {/* Reticle 3: Bottom Left - Free-Sprung Balance Wheel */}
        <g className={`transition-opacity duration-500 ${showCallout3 ? 'opacity-100' : 'opacity-0'}`}>
          <path
            d="M 180 440 L 360 370"
            stroke="#D4AF37"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
          <circle cx="360" cy="370" r="4" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
          <circle cx="360" cy="370" r="1.5" fill="#D4AF37" />
        </g>

        {/* Reticle 4: Bottom Right - Openworked Bridges & Crown */}
        <g className={`transition-opacity duration-500 ${showCallout4 ? 'opacity-100' : 'opacity-0'}`}>
          <path
            d="M 620 430 L 490 350"
            stroke="#D4AF37"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
          <circle cx="490" cy="350" r="4" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
          <circle cx="490" cy="350" r="1.5" fill="#D4AF37" />
        </g>

      </svg>

      {/* Floating Glassmorphic Telemetry Badges */}
      {/* Badge 1 */}
      <div 
        className={`absolute top-[22%] left-[6%] md:left-[12%] lg:left-[16%] -translate-y-1/2 flex items-center space-x-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded border border-[#D4AF37]/40 text-[10px] md:text-[11px] font-mono tracking-widest text-white shadow-xl transition-all duration-500 ${
          showCallout1 ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-x-2 pointer-events-none'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
        <div>
          <div className="text-[#D4AF37] font-bold">01 / CASE ARCHITECTURE</div>
          <div className="text-white/60 text-[9px]">GRADE 5 TITANIUM MONOBLOC</div>
        </div>
      </div>

      {/* Badge 2 */}
      <div 
        className={`absolute top-[26%] right-[6%] md:right-[10%] lg:right-[15%] -translate-y-1/2 flex items-center space-x-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded border border-[#D4AF37]/40 text-[10px] md:text-[11px] font-mono tracking-widest text-white shadow-xl transition-all duration-500 ${
          showCallout2 ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto' : 'opacity-0 scale-95 translate-x-2 pointer-events-none'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
        <div>
          <div className="text-[#D4AF37] font-bold">02 / DIAL & SAPPHIRE</div>
          <div className="text-white/60 text-[9px]">DOUBLE ANTI-REFLECTIVE CRYSTAL</div>
        </div>
      </div>

      {/* Badge 3 */}
      <div 
        className={`absolute bottom-[22%] left-[6%] md:left-[12%] lg:left-[16%] translate-y-1/2 flex items-center space-x-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded border border-[#D4AF37]/40 text-[10px] md:text-[11px] font-mono tracking-widest text-white shadow-xl transition-all duration-500 ${
          showCallout3 ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-x-2 pointer-events-none'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
        <div>
          <div className="text-[#D4AF37] font-bold">03 / BALANCE & ESCAPEMENT</div>
          <div className="text-white/60 text-[9px]">SILICON HAIRSPRING • 28,800 VPH</div>
        </div>
      </div>

      {/* Badge 4 */}
      <div 
        className={`absolute bottom-[26%] right-[6%] md:right-[10%] lg:right-[15%] translate-y-1/2 flex items-center space-x-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded border border-[#D4AF37]/40 text-[10px] md:text-[11px] font-mono tracking-widest text-white shadow-xl transition-all duration-500 ${
          showCallout4 ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto' : 'opacity-0 scale-95 translate-x-2 pointer-events-none'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
        <div>
          <div className="text-[#D4AF37] font-bold">04 / OPENWORKED BRIDGES</div>
          <div className="text-white/60 text-[9px]">HAND-BEVELED ANGLAGE FINISH</div>
        </div>
      </div>

    </div>
  );
};

export default TechnicalCallout;
