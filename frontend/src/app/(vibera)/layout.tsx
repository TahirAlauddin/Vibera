"use client";
import type { ReactNode } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

type MainLayoutProps = {
  children: ReactNode;
  modal?: ReactNode;
};

export default function MainLayout({ children, modal }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* header placeholder */}
      <header className="h-16 birder-b flex items-center">
        <Navbar />
      </header>
      {/* Main content */}
      <main className="flex-1 py-6 color-bg">{children}</main>
      {/* Footer placefolder */}
      <footer>
        <Footer />
      </footer>
      {/* Modal slot for intercepting routes */}
      {modal}
    </div>
  );
}
