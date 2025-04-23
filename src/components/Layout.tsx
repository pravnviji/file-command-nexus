
import React from 'react';
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
      className
    )}>
      <header className="border-b bg-white dark:bg-gray-900">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-center">
            TTS Demo
          </h1>
        </div>
      </header>
      
      <main className="container py-8">
        {children}
      </main>
      
      <footer className="border-t py-4 bg-white dark:bg-gray-900">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2025 Praveen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
