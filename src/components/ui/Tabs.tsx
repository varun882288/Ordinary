'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextType {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export function Tabs({ children, defaultValue, value: controlledValue, onChange, className }: {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  const handleChange = (value: string) => {
    if (!isControlled) setUncontrolledValue(value);
    onChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex gap-1 bg-gray-50 rounded-lg p-1', className)} role="tablist">
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, className, disabled }: { children: ReactNode; value: string; className?: string; disabled?: boolean }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { value: currentValue, onChange } = context;
  const isActive = currentValue === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      disabled={disabled}
      onClick={() => !disabled && onChange(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isActive
          ? 'bg-white text-text-main shadow-sm'
          : 'text-text-muted hover:text-text-main',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className, forceMount }: { children: ReactNode; value: string; className?: string; forceMount?: boolean }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { value: currentValue } = context;
  const isActive = currentValue === value;

  if (!isActive && !forceMount) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isActive}
      className={cn('mt-4', className)}
    >
      {children}
    </div>
  );
}