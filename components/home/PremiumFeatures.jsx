const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "100% Secure",
    description: "Your data is protected",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "24/7 Support",
    description: "We're here to help",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Best Prices",
    description: "Guaranteed",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Free Cancellation",
    description: "Up to 24 hours",
  },
];

export default function PremiumFeatures() {
  return (
    <section className="pb-24 bg-obsidian-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-16" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative flex flex-col items-center text-center p-7 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-gold/20 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
            >
              {/* Gold glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: "0 0 30px rgba(201,168,76,0.06) inset" }} />

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gold/5 border border-gold/10 flex items-center justify-center text-gold mb-5 group-hover:bg-gold/10 group-hover:border-gold/25 group-hover:scale-105 transition-all duration-500">
                {feature.icon}
              </div>

              <h3 className="font-display font-semibold text-white text-base mb-1.5 group-hover:text-gold transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-xs font-body text-platinum-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
