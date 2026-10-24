"use client";

import Link from "next/link";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from "react-icons/fa";

const GOLD = "#D4AF37";

const fleetLinks = [
  { label: "Economy Cars", href: "/cars?type=economy" },
  { label: "SUVs", href: "/cars?type=suv" },
  { label: "Luxury Sedans", href: "/cars?type=luxury" },
  { label: "Sports Cars", href: "/cars?type=sports" },
  { label: "All Vehicles", href: "/cars" },
];

const companyLinks = [
  { label: "About Velox", href: "/about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Insurance Policy", href: "/insurance" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "Twitter/X",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #080808 50%, #000000 100%)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Atmospheric top gold line ── */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)",
          pointerEvents: "none",
        }}
      />
      {/* ── Radial ambient glow ── */}
      <div
        style={{
          position: "absolute",
          top: "0", left: "50%",
          transform: "translateX(-50%)",
          width: "800px", height: "300px",
          background: "radial-gradient(ellipse, rgba(212,175,55,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Centered content wrapper ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          paddingLeft: "clamp(24px, 4vw, 64px)",
          paddingRight: "clamp(24px, 4vw, 64px)",
        }}
      >
        {/* ── Main footer grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1.2fr",
            gap: "clamp(32px, 4vw, 60px)",
            padding: "72px 0 56px",
          }}
          className="footer-main-grid"
        >

          {/* ── Brand column ── */}
          <div>
            {/* Logo */}
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "36px", height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #c9a84c, #e9c15f)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(212,175,55,0.3)",
                  flexShrink: 0,
                }}
              >
                <svg style={{ width: "18px", height: "18px", color: "#050505" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21L2 3h5.5L12 11.5L16.5 3H22L12 21z" />
                </svg>
              </div>
              <span
                className="font-body font-normal uppercase"
                style={{ fontSize: "16px", letterSpacing: "0.35em", color: "#ffffff", marginLeft: "2px" }}
              >
                VELOX
              </span>
            </Link>

            <p
              className="font-body font-light"
              style={{
                fontSize: "13px",
                lineHeight: "1.8",
                color: "rgba(232,232,232,0.4)",
                marginBottom: "24px",
                maxWidth: "240px",
              }}
            >
              Premium car rental for those who demand the extraordinary. From city transfers to track days — we deliver excellence.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "10px" }}>
              {socialLinks.map((s) => (
                <SocialIcon key={s.label} link={s} />
              ))}
            </div>
          </div>

          {/* ── Fleet column ── */}
          <div>
            <FooterHeading>Fleet</FooterHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
              {fleetLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company column ── */}
          <div>
            <FooterHeading>Company</FooterHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact column ── */}
          <div>
            <FooterHeading>Contact</FooterHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
              <ContactItem icon={<LocationIcon />}>14 Mayfair Crescent, London W1K 5NF</ContactItem>
              <ContactItem icon={<PhoneIcon />}>
                <a href="tel:+442079460000" style={{ color: "inherit", textDecoration: "none", transition: "color 0.25s ease" }}
                  onMouseEnter={e => e.currentTarget.style.color = GOLD}
                  onMouseLeave={e => e.currentTarget.style.color = "inherit"}
                >
                  +44 20 7946 0000
                </a>
              </ContactItem>
              <ContactItem icon={<EmailIcon />}>
                <a href="mailto:hello@veloxrentals.com" style={{ color: "inherit", textDecoration: "none", transition: "color 0.25s ease" }}
                  onMouseEnter={e => e.currentTarget.style.color = GOLD}
                  onMouseLeave={e => e.currentTarget.style.color = "inherit"}
                >
                  hello@veloxrentals.com
                </a>
              </ContactItem>
              <ContactItem icon={<ClockIcon />}>Mon–Sun, 07:00–22:00</ContactItem>
            </ul>
          </div>

        </div>

        {/* ── Bottom divider ── */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          }}
        />

        {/* ── Bottom bar ── */}
        <div
          style={{
            padding: "26px 0",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
          className="footer-bottom-bar"
        >
          {/* Left: Copyright + Developer Credit */}
          <div>
            <p
              className="font-body"
              style={{ fontSize: "15px", color: "rgba(232,232,232,0.3)", letterSpacing: "0.03em" }}
            >
              © {new Date().getFullYear()} Velox Rentals Ltd. All rights reserved.
            </p>
            <p
              className="font-body"
              style={{ fontSize: "15px", color: "rgba(232,232,232,0.3)", marginTop: "5px", letterSpacing: "0.5px" }}
            >
              Designed &amp; Developed by{" "}
              <DeveloperName>Dalin Alkuwatli</DeveloperName>
            </p>
          </div>

          {/* Right: Payment badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              className="font-body"
              style={{ fontSize: "15px", color: "rgba(232,232,232,0.25)", marginRight: "4px" }}
            >
              Accepted payments:
            </span>
            {[
              { id: "visa", icon: <FaCcVisa size={28} /> },
              { id: "mc", icon: <FaCcMastercard size={28} /> },
              { id: "amex", icon: <FaCcAmex size={28} /> },
              { id: "paypal", icon: <FaCcPaypal size={28} /> },
            ].map((p) => (
              <span
                key={p.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                {p.icon}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 900px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 560px) {
          .footer-main-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-bottom-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
}

/* ── Sub-components ── */

function FooterHeading({ children }) {
  return (
    <h3
      className="font-display font-semibold uppercase"
      style={{
        fontSize: "10px",
        letterSpacing: "0.25em",
        color: "rgba(232,232,232,0.5)",
        marginBottom: "20px",
      }}
    >
      {children}
    </h3>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="font-body"
      style={{
        fontSize: "13px",
        color: "rgba(232,232,232,0.4)",
        textDecoration: "none",
        display: "inline-block",
        transition: "color 0.25s ease, padding-left 0.25s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = "#D4AF37";
        e.currentTarget.style.paddingLeft = "5px";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = "rgba(232,232,232,0.4)";
        e.currentTarget.style.paddingLeft = "0";
      }}
    >
      {children}
    </Link>
  );
}

function ContactItem({ icon, children }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
      <span style={{ color: "#D4AF37", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
      <span className="font-body" style={{ fontSize: "13px", color: "rgba(232,232,232,0.4)", lineHeight: "1.6" }}>
        {children}
      </span>
    </li>
  );
}

function SocialIcon({ link }) {
  return (
    <a
      href={link.href}
      aria-label={link.label}
      style={{
        width: "36px", height: "36px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(232,232,232,0.4)",
        textDecoration: "none",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.color = "#D4AF37";
        e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)";
        e.currentTarget.style.background = "rgba(212,175,55,0.07)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(212,175,55,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.color = "rgba(232,232,232,0.4)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {link.icon}
    </a>
  );
}

function DeveloperName({ children }) {
  return (
    <span
      className="font-body font-semibold"
      style={{
        color: "#D4AF37",
        letterSpacing: "0.03em",
        transition: "color 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={e => { e.currentTarget.style.color = "#ffffff"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "#D4AF37"; }}
    >
      {children}
    </span>
  );
}

/* ── Contact icons ── */
function LocationIcon() {
  return (
    <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg style={{ width: "14px", height: "14px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
