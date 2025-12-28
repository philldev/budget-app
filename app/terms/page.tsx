"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen relative bg-neutral-950">
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-lg space-y-8">
          <div className="space-y-4">
            <Button asChild variant="ghost" size="sm" className="gap-2 text-neutral-500 hover:text-white -ml-2">
              <Link href="/">
                <ArrowLeft className="size-4" /> Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-white">Terms of Service</h1>
          </div>

          <div className="space-y-6 text-sm text-neutral-400 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">Acceptance of Risk</h2>
              <p>
                By using BudgetApp, you acknowledge that this is a personal project. You use the application at your own risk.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">No Warranty</h2>
              <p>
                The application is provided &quot;as is&quot; without any warranties of any kind, either express or implied. The creator does not guarantee that the application will always be available, secure, or free of bugs.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">Limitation of Liability</h2>
              <p>
                The creator shall not be held responsible for any loss of data, security breaches, financial errors, or any other damages arising from the use of this application.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">Personal Use Only</h2>
              <p>
                This application is designed for personal, individual use. It should not be used for critical financial management or business operations.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-white">Changes</h2>
              <p>
                The creator reserves the right to modify or discontinue the service at any time without prior notice.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-white/5 py-8 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] text-neutral-500 tracking-wide uppercase">
            BudgetApp &copy; {new Date().getFullYear()} Deddy Wolley
          </p>
        </div>
      </footer>

      <BackgroundBeams />
    </div>
  );
}
