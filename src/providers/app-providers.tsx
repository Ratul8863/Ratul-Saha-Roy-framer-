"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/auth-provider";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SmoothScrollProvider>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            className: "font-ui",
          }}
        />
      </SmoothScrollProvider>
    </AuthProvider>
  );
}
