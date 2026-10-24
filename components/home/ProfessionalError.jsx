"use client";

import { useState } from "react";

const errors = [
  {
    title: "Failed to load some vehicles",
    description: "Some vehicle listings could not be retrieved from the server. Please retry or refresh the page.",
  },
  {
    title: "Search service unavailable",
    description: "The real-time search index is temporarily offline. Results may be incomplete.",
  },
  {
    title: "Unable to connect to server",
    description: "Connection timed out. Please check your network connection and try again.",
  },
  {
    title: "Some images failed to load",
    description: "CDN resources could not be fetched. Placeholder images are displayed instead.",
  },
  {
    title: "Authentication required",
    description: "Sign in to unlock personalised pricing, saved vehicles, and booking history.",
  },
];

export default function ProfessionalError() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => setIsRetrying(false), 2000);
  };

  return (
    <section className="bg-obsidian-900 pt-10 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-3xl overflow-hidden border border-error/15 bg-error/5 backdrop-blur-xl"
          style={{ boxShadow: "0 0 60px rgba(255,77,77,0.05), 0 4px 30px rgba(0,0,0,0.5)" }}
        >
          {/* Subtle top edge accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-error/50 to-transparent" />
          {/* Background ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-error/8 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 rounded-full bg-error/10 border border-error/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white leading-tight">
                    We found some problems
                  </h2>
                  <p className="text-platinum-500 font-body text-sm mt-0.5">
                    Please fix the following errors to continue
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-obsidian-950/80 hover:bg-black border border-error/25 hover:border-error/50 rounded-xl text-white text-xs font-semibold font-body tracking-wider uppercase transition-all duration-300 disabled:opacity-60"
                >
                  <svg
                    className={`w-3.5 h-3.5 text-error transition-transform duration-700 ${isRetrying ? "animate-spin" : "group-hover:rotate-180"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isRetrying ? "Retrying…" : "Retry All"}
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-platinum-500 hover:text-white hover:bg-white/5 transition-all duration-200"
                  aria-label="Dismiss"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Error cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {errors.map((error) => (
                <div
                  key={error.title}
                  className="group flex items-start gap-3 p-4 rounded-2xl bg-black/25 border border-white/5 hover:border-error/25 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,77,77,0.1)] transition-all duration-300 cursor-default"
                >
                  <div className="shrink-0 w-7 h-7 rounded-full bg-error/10 border border-error/25 flex items-center justify-center mt-0.5 group-hover:bg-error/20 transition-colors duration-300">
                    <div className="w-2 h-2 rounded-full bg-error" />
                  </div>
                  <div>
                    <p className="text-[13px] font-body font-semibold text-white leading-snug mb-1">
                      {error.title}
                    </p>
                    <p className="text-[11px] font-body text-platinum-500 leading-relaxed">
                      {error.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
