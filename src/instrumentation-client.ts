import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  ui_host: "https://eu.posthog.com",
  defaults: "2026-01-30",
  capture_pageview: false,
  capture_pageleave: true,
});

// Required for PostHog Toolbar
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).posthog = posthog;
}
