"use client";

import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    number: "01",
    title: "Choose Your Car",
    description:
      "Browse our curated fleet of premium vehicles. Filter by type, fuel, transmission, and budget to find your perfect match.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Book Instantly",
    description:
      "Select your dates, add extras, and confirm your reservation in under 2 minutes. Flexible cancellation included.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Drive & Enjoy",
    description:
      "We deliver the car to your door or preferred location. Full tank, cleaned, and ready. Return at your convenience.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "60px 60px 0px 60px",
        background: "#050505",
        position: "relative",
        overflow: "hidden",
      }}
      className="how-section-responsive"
    >
      {/* Luxury Background Glow */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background: "rgba(212,175,55,0.06)",
          filter: "blur(140px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      {/* Main Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "1450px",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="flex flex-col items-center justify-center text-center w-full" style={{ marginBottom: "40px" }}>
          <p className="text-[#d4af37] uppercase tracking-[6px] text-xs font-semibold mb-3 font-body">
            Simple Process
          </p>
          <h2 className="text-white font-display font-bold leading-tight tracking-tight mb-4" style={{ fontSize: "clamp(32px, 4vw, 56px)" }}>
            How It <span style={{ color: "#d4af37" }}>Works</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-body max-w-2xl mx-auto">
            Renting a premium vehicle should feel effortless. We&apos;ve distilled the process into three simple steps.
          </p>
        </div>

        {/* Steps Wrapper */}
        <div
          className="steps-wrapper-responsive"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "40px",
            flexWrap: "wrap",
          }}
        >
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width: 1000px) {
          .steps-wrapper-responsive {
            gap: 70px !important;
          }
          .main-title-responsive {
            font-size: 85px !important;
          }
        }
        @media(max-width: 992px) {
          .how-section-responsive {
            padding: 100px 40px !important;
          }
          .main-title-responsive {
            font-size: 70px !important;
          }
          .steps-wrapper-responsive {
            gap: 60px !important;
          }
          .desc-responsive {
            font-size: 20px !important;
          }
        }
        @media(max-width: 600px) {
          .how-section-responsive {
            padding: 80px 20px !important;
          }
          .main-title-responsive {
            font-size: 50px !important;
          }
        }
      `}</style>
    </section>
  );
}

function StepCard({ step, index }) {
  return (
    <div
      style={{
        width: "280px",
        textAlign: "center",
        position: "relative",
      }}
      className="group flex flex-col items-center"
    >
      {/* Luxury Icon Box */}
      <div
        className="icon-box"
        style={{
          width: "100px",
          height: "100px",
          margin: "0 auto 25px",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          transition: "all 0.4s ease",
          color: "#D4AF37",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-12px)";
          e.currentTarget.style.boxShadow = "0 20px 50px rgba(212,175,55,0.18)";
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)";
          e.currentTarget.style.background = "rgba(212,175,55,0.04)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        }}
      >
        {step.icon}
        {/* Step Badge */}
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #c9a84c, #e9c15f)",
            color: "#050505",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "900",
            fontSize: "16px",
            boxShadow: "0 5px 15px rgba(201,168,76,0.4)",
          }}
          className="font-display"
        >
          {index + 1}
        </div>
      </div>

      {/* Card Title */}
      <h3
        className="font-display transition-colors duration-300 group-hover:text-gold"
        style={{
          fontSize: "24px",
          marginBottom: "12px",
          color: "white",
          fontWeight: "600",
          letterSpacing: "-0.01em",
        }}
      >
        {step.title}
      </h3>

      {/* Card Description */}
      <p
        className="font-body"
        style={{
          fontSize: "14px",
          lineHeight: "1.7",
          color: "rgba(255,255,255,0.55)",
          fontWeight: "300",
        }}
      >
        {step.description}
      </p>
    </div>
  );
}
