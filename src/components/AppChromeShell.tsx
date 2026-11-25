"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface AppChromeShellProps {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Separates standalone public social-share card routes (`/share/[ticketId]` and
 * `/ticket/[id]`) from the main app navbar and dashboard navigation chrome.
 */
export default function AppChromeShell({
  header,
  footer,
  children,
}: AppChromeShellProps) {
  const pathname = usePathname() || "";
  const isStandaloneShareRoute =
    pathname === "/share" ||
    pathname.startsWith("/share/") ||
    pathname === "/ticket" ||
    pathname.startsWith("/ticket/");

  if (isStandaloneShareRoute) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  return (
    <>
      {header}
      <main className="flex-1 flex flex-col">{children}</main>
      {footer}
    </>
  );
}
