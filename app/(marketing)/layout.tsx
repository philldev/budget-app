"use client";

import * as React from "react";
import { AnimatePresence } from "motion/react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Footer } from "@/components/shared/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative bg-neutral-950">
      <main className="flex-1 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </main>
      <Footer />
      <BackgroundBeams />
    </div>
  );
}
