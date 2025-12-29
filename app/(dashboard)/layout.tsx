import * as React from "react";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="container mx-auto p-6 space-y-4 max-w-xl">
        {children}
      </div>
    </AuthGuard>
  );
}
