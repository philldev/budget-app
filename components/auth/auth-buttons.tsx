"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

import { SiGoogle } from "react-icons/si";

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/budgets",
        fetchOptions: {
          onError: (ctx) => {
            if (ctx.error.status === 401 || ctx.error.message?.includes("authorized")) {
              setError("Your email is not authorized to access this application.");
            } else {
              setError("An error occurred during sign in. Please try again.");
            }
          }
        }
      });
    } catch (err) {
      console.error("Sign in failed", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <Button onClick={handleSignIn} disabled={isLoading} variant="outline" size="lg" className="w-full">
        <SiGoogle className="mr-2 size-4 text-white fill-white" />
        Sign In with Google
      </Button>
      {error && (
        <p className="text-[10px] text-destructive text-center font-medium">
          {error}
        </p>
      )}
    </div>
  );
}