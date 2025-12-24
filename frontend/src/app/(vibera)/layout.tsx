import type { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* header placeholder */}
      <header className="h-16 birder-b flex items-center px-4">
        <span> Header</span>
      </header>
      {/* Main content */}
      <main className="flex-1 px-4 py-6">{children}</main>
      {/* Footer placefolder */}
      <footer className="h-12 border-t flex items-center justify-center text-sm">
        Footer
      </footer>
    </div>
  );
}
