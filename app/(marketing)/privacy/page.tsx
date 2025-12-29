"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <motion.div
      key="privacy-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-lg space-y-8 p-4"
    >
      <div className="space-y-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-neutral-500 hover:text-white -ml-2"
        >
          <Link href="/">
            <ArrowLeft className="size-4" /> Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Privacy Policy
        </h1>
      </div>

      <div className="space-y-6 text-sm text-neutral-400 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">
            Personal Project
          </h2>
          <p>
            BudgetApp is a personal project developed for portfolio and
            individual use. It is not a commercial product.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">
            Data Collection
          </h2>
          <p>
            We use Google Social Sign-In for authentication. When you sign in,
            we store your email, name, and profile picture URL provided by
            Google.
          </p>
          <p>
            Any budget and transaction data you enter is stored in our database
            to provide the application&apos;s core functionality.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">Third Parties</h2>
          <p>
            Your data is stored using Turso (SQLite) and managed via
            Better-Auth. We do not sell or share your data with any other third
            parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">Your Control</h2>
          <p>
            As this is a personal project, professional data deletion mechanisms
            are not in place. If you wish to have your data removed, please
            contact the creator directly.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
