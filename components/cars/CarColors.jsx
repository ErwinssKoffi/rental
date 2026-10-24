"use client";

export default function CarColors({ colors, activeColor, onColorChange }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="pt-[60px] border-t border-white/10" style={{ paddingBottom: '100px' }}>
      <h3 className="font-display font-bold text-2xl text-white flex items-center gap-3" style={{ marginBottom: '40px' }}>
        <span className="w-8 h-[1px] bg-[#D6B25E]" />
        Available Colors
      </h3>

      <div className="flex flex-wrap items-center gap-8">
        {colors.map((colorObj, idx) => {
          const isActive = activeColor.name === colorObj.name;
          return (
            <div 
              key={idx} 
              className="flex items-center gap-4 group cursor-pointer"
              onClick={() => onColorChange(colorObj)}
            >
              <div 
                className="w-[42px] h-[42px] rounded-full transition-all duration-300 relative"
                style={{
                  backgroundColor: colorObj.hex,
                  border: isActive ? "2px solid #D6B25E" : "2px solid rgba(255,255,255,0.1)",
                  transform: isActive ? "scale(1.12)" : "scale(1)",
                  boxShadow: isActive ? "0 0 18px rgba(214,178,94,0.45)" : "0 4px 10px rgba(0,0,0,0.5)"
                }}
              >
                {/* Inner shadow for realism */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)] pointer-events-none" />
              </div>
              <span 
                className="text-[15px] font-body transition-colors duration-300"
                style={{
                  color: isActive ? "#ffffff" : "#888888",
                  fontWeight: isActive ? "600" : "400"
                }}
              >
                {colorObj.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
