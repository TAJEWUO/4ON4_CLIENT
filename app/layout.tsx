// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "4ON4",
  description: "4ON4 Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
