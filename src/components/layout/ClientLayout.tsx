'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';

export function ClientLayout({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}