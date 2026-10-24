'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastProvider } from '@/components/ui/Toast';

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  return (
    <ToastProvider>
      <div className={cn('min-h-screen bg-gray-50', className)}>
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
        <Header sidebarCollapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar} />
        <main
          className={cn(
            'pt-[64px] min-h-screen transition-all duration-300',
            sidebarCollapsed ? 'ml-[72px]' : 'ml-[280px]'
          )}
          role="main"
        >
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}