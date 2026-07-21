import { ReactNode } from 'react';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 pt-16 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        {children}
      </main>
    </div>
  );
}
