"use client";

import Link from "next/link";
import { SiGithub, SiX } from "react-icons/si";
import { FaGlobe } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 py-6 relative z-10">
      <div className="container mx-auto px-6 max-w-lg">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs tracking-tight text-muted-foreground"
            >
              BudgetApp
            </Link>
            <Link
              href="https://github.com/philldev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <SiGithub className="size-3.5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://twitter.com/deddywolley"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <SiX className="size-3" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://deddywolley.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              <FaGlobe className="size-3.5" />
              <span className="sr-only">Website</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-[9px] text-neutral-500 uppercase tracking-widest font-medium">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>

          <p className="text-[9px] text-neutral-600 tracking-tight font-medium uppercase">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
