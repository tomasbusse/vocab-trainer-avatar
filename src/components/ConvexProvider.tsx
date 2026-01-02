"use client";

import { ReactNode } from "react";
import { ConvexProvider as ConvexProviderBase, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

// Only create client if URL is configured
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    // During development without Convex, just render children
    return <>{children}</>;
  }

  return <ConvexProviderBase client={convex}>{children}</ConvexProviderBase>;
}
