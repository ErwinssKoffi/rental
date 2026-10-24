export default function CarSpecs({ car }) {
  const { engine, acceleration, topSpeed, transmission, fuelType, seats, year, mileage, doors, luggage, color, features } = car;

  const specGrid = [
    { label: "Engine", value: engine },
    { label: "0-100 km/h", value: acceleration },
    { label: "Top Speed", value: topSpeed },
    { label: "Transmission", value: transmission, capitalize: true },
    { label: "Fuel Type", value: fuelType, capitalize: true },
    { label: "Seats", value: seats },
    { label: "Doors", value: doors || 4 },
    { label: "Luggage", value: luggage ? `${luggage} Bags` : "2 Bags" },
    { label: "Color", value: color || "Signature" },
    { label: "Year", value: year },
  ];

  const amenities = features && features.length > 0 ? features : [
    "Premium Audio System",
    "GPS Navigation with Live Traffic",
    "Heated & Ventilated Leather Seats",
    "Apple CarPlay & Android Auto",
    "Adaptive Cruise Control",
    "24/7 Luxury Roadside Assistance",
    "Complimentary Bottled Water",
    "Full Tank on Delivery",
  ];

  return (
    <div className="space-y-12 pt-[100px] pb-8 border-t border-white/10">

      {/* ── Technical Specifications ── */}
      <div style={{ marginBottom: '80px' }}>
        <h3 className="font-display font-bold text-2xl text-white flex items-center gap-3" style={{ marginTop: '60px', marginBottom: '40px' }}>
          <span className="w-8 h-[1px] bg-[#D6B25E]" />
          Technical Specifications
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {specGrid.map((spec) => (
            <div
              key={spec.label}
              className="group transition-all duration-350 ease-out"
              style={{
                padding: "28px 32px",
                borderRadius: "18px",
                border: "1px solid rgba(214,178,94,0.15)",
                background: "rgba(255,255,255,0.02)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(214,178,94,0.45)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(214,178,94,0.15)";
              }}
            >
              <p className="text-[11px] font-body text-gray-500 uppercase tracking-widest mb-2">{spec.label}</p>
              <p className={`text-[16px] font-body text-white font-medium ${spec.capitalize ? 'capitalize' : ''}`}>
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Premium Amenities ── */}
      <div>
        <h3 className="font-display font-bold text-2xl text-white flex items-center gap-3" style={{ marginBottom: '20px' }}>
          <span className="w-8 h-[1px] bg-[#D6B25E]" />
          Included Amenities
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12" style={{ marginBottom: '80px' }}>
          {amenities.map((feature, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <svg className="w-6 h-6 text-[#D6B25E] shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              <span
                className="font-body transition-colors"
                style={{ fontSize: "20px", color: "#e8e8e8" }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
