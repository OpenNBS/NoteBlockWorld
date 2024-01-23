"use client";

import { useState } from "react";
import "./globals.css";
import DefaultLayout from "../../components/common/DefaultLayout";
import Sidebar from "../../components/common/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" className="h-full">
      <body className={"h-full"}>
        <DefaultLayout
          isSidebarOpen={sidebarOpen}
          setSidebarOpen={(open: boolean) => setSidebarOpen(open)}
        >
          {children}
        </DefaultLayout>
      </body>
    </html>
  );
}
