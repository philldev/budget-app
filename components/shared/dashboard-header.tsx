"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserNav } from "@/components/auth/user-nav";

interface DashboardHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  backLink?: {
    href: string;
    label: string;
  };
  actions?: React.ReactNode;
}

export function DashboardHeader({
  title,
  description,
  backLink,
  actions,
}: DashboardHeaderProps) {
  const { data: session } = authClient.useSession();

  return (
    <div className="flex flex-col gap-2">
      {backLink && (
        <Link
          href={backLink.href}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">{backLink.label}</span>
        </Link>
      )}

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <div className="text-muted-foreground text-xs">{description}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {session?.user && <UserNav user={session.user} />}
        </div>
      </div>
    </div>
  );
}
