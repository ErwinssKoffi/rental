"use client";

import Link from "next/link";

const GOLD = "#D4AF37";

export default function CTABanner() {
  return (
    <section
      style={{
        background: "#050505",
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Deep atmospheric background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Grid pattern */}
      <div
        className="grid-pattern"
        style={{ position: "absolute", inset: 0, opacity: 0.15, pointerEvents: "none" }}
      />
      {/* Top/bottom edge lines */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)",
        }}
      />

      {/* ── Centered container ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          paddingLeft: "clamp(24px, 4vw, 64px)",
          paddingRight: "clamp(24px, 4vw, 64px)",
        }}
      >
        {/* ── Glassmorphism CTA box ── */}
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            textAlign: "center",
            padding: "clamp(40px, 6vw, 60px) clamp(24px, 5vw, 50px)",
            borderRadius: "28px",
            background: "rgba(15,15,15,0.7)",
            border: "1px solid rgba(212,175,55,0.15)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 80px rgba(212,175,55,0.04) inset",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Inner top gold glow */}
          <div
            style={{
              position: "absolute",
              top: 0, left: "20%", right: "20%", height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
            }}
          />
          {/* Ambient glow orb behind text */}
          <div
            style={{
              position: "absolute",
              top: "40%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "200px",
              background: "radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div style={{ width: "24px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
            <span
              className="font-body font-semibold uppercase"
              style={{ fontSize: "9px", color: GOLD, letterSpacing: "0.35em" }}
            >
              Start Today
            </span>
            <div style={{ width: "28px", height: "1px", background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          </div>

          {/* Heading */}
          <h2
            className="font-display font-bold"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              lineHeight: "1.1",
              color: "#ffffff",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
              position: "relative",
            }}
          >
            Ready to Take the{" "}
            <span className="text-gold-gradient">Wheel?</span>
          </h2>

          {/* Subtitle */}
          <p
            className="font-body font-light"
            style={{
              fontSize: "clamp(13px, 1vw, 15px)",
              lineHeight: "1.7",
              color: "rgba(232,232,232,0.55)",
              maxWidth: "480px",
              margin: "0 auto 32px auto",
              position: "relative",
            }}
          >
            Join thousands of satisfied clients who have elevated their journey with Velox. Book your premium vehicle today.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              position: "relative",
              marginBottom: "24px",
            }}
          >
            {/* Primary CTA */}
            <CTAButton href="/cars" primary>Book Your Car Now</CTAButton>
            {/* Ghost CTA */}
            <CTAButton href="#contact" primary={false}>Contact Support</CTAButton>
          </div>

          {/* Trust indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              position: "relative",
            }}
          >
            <svg
              style={{ width: "12px", height: "12px", color: "#34d399", flexShrink: 0 }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span
              className="font-body"
              style={{ fontSize: "10px", color: "rgba(232,232,232,0.35)", letterSpacing: "0.05em" }}
            >
              No deposit required for selected vehicles.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTAButton({ href, primary, children }) {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 28px",
    borderRadius: "100px",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    transition: "all 0.35s ease",
    textDecoration: "none",
    cursor: "pointer",
    border: "1px solid",
  };

  const primaryStyle = {
    ...baseStyle,
    background: "linear-gradient(135deg, #c9a84c, #e9c15f)",
    borderColor: "transparent",
    color: "#050505",
    boxShadow: "0 8px 32px rgba(212,175,55,0.3)",
  };

  const ghostStyle = {
    ...baseStyle,
    background: "transparent",
    borderColor: "rgba(212,175,55,0.35)",
    color: GOLD,
  };

  return (
    <Link
      href={href}
      style={primary ? primaryStyle : ghostStyle}
      onMouseEnter={e => {
        if (primary) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 16px 48px rgba(212,175,55,0.45)";
        } else {
          e.currentTarget.style.borderColor = GOLD;
          e.currentTarget.style.color = GOLD;
          e.currentTarget.style.boxShadow = "0 0 24px rgba(212,175,55,0.15)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={e => {
        if (primary) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(212,175,55,0.3)";
        } else {
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <span className="font-body font-semibold">{children}</span>
    </Link>
  );
}
