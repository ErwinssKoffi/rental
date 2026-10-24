"use client";

import { useState } from "react";

const errors = [
  {
    title: "Failed to load some vehicles",
    description: "Some vehicle listings could not be retrieved from the server.",
  },
  {
    title: "Search service unavailable",
    description: "The real-time search index is temporarily offline.",
  },
  {
    title: "Unable to connect to server",
    description: "Connection timed out. Please check your network and retry.",
  },
  {
    title: "Some images failed to load",
    description: "CDN resources could not be fetched. Placeholders are shown.",
  },
  {
    title: "Authentication required",
    description: "Sign in to access personalised pricing and saved vehicles.",
  },
];

export default function ErrorSection() {
  const [retrying, setRetrying] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => setRetrying(false), 1800);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
      <div
        className="relative rounded-2xl overflow-hidden border border-error/20 bg-error/5 backdrop-blur-xl p-6 sm:p-8"
        style={{ boxShadow: "0 0 40px rgba(255,77,77,0.06), 0 4px 24px rgba(0,0,0,0.4)" }}
      >
        {/* Subtle top-edge red glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-error/40 to-transparent" />

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="shrink-0 w-10 h-10 rounded-full bg-error/10 border border-error/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display font-semibold text-white text-lg leading-snug">
                We found some problems
              </h2>
              <p className="text-platinum-500 text-sm mt-0.5 font-body">
                Please fix the following errors to continue
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRetry}
              className="group flex items-center gap-2 px-4 py-2 text-xs font-body font-semibold text-error border border-error/30 rounded-lg bg-error/5 hover:bg-error/10 transition-all duration-300 tracking-wider uppercase"
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-700 ${retrying ? "animate-spin" : "group-hover:rotate-180"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry All
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-platinum-500 hover:text-white hover:bg-white/5 transition-all duration-200"
              aria-label="Dismiss errors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {errors.map((error) => (
            <div
              key={error.title}
              className="group relative flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:border-error/25 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,77,77,0.1)] transition-all duration-300 cursor-default"
            >
              {/* Red dot icon */}
              <div className="shrink-0 w-7 h-7 rounded-full bg-error/10 border border-error/30 flex items-center justify-center mt-0.5 group-hover:bg-error/20 transition-colors duration-300">
                <div className="w-2 h-2 rounded-full bg-error" />
              </div>
              <div className="min-w-0">
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
    </section>
  );
}
