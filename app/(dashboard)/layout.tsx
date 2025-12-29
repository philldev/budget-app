import * as React from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Footer } from "@/components/shared/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <main className="container mx-auto flex-1 p-6 space-y-4 max-w-xl">
          {children}
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
