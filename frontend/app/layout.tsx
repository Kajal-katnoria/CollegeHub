import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import type { ReactNode } from "react";

export const metadata = {
  title: "CollegeHub",
  description: "Digital Campus Platform",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}