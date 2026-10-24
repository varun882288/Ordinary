'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  trigger: ReactNode;
  content: ReactNode;
  align?: 'left' | 'right';
  offset?: number;
}

export function Dropdown({ trigger, content, align = 'right', offset = 4 }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
          contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') setOpen(false);
  };

  const dropdownContent = open ? (
    <div
      ref={contentRef}
      className={cn(
        'absolute z-[100] mt-1 min-w-[200px] bg-white border border-border rounded-lg shadow-lg',
        'animate-in fade-in-0 zoom-in-95 duration-150',
        align === 'right' ? 'right-0' : 'left-0'
      )}
      style={{ marginTop: offset }}
      role="menu"
      onKeyDown={handleKeyDown}
    >
      <div className="py-1">{content}</div>
    </div>
  ) : null;

  return (
    <div ref={triggerRef} className="relative inline-block" onKeyDown={handleKeyDown}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {dropdownContent}
    </div>
  );
}

export interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  destructive?: boolean;
}

export function DropdownItem({ children, onClick, disabled = false, icon, destructive = false }: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full px-3 py-2 text-left text-sm transition-colors',
        'focus:outline-none focus:bg-gray-50',
        destructive ? 'text-error hover:bg-error-light' : 'text-text-main hover:bg-gray-50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      role="menuitem"
    >
      <div className="flex items-center gap-2">
        {icon && <span className="h-4 w-4 flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
    </button>
  );
}

export interface DropdownSeparatorProps {
  className?: string;
}

export function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return <hr className={cn('my-1 border-border', className)} role="separator" />;
}

export interface DropdownLabelProps {
  children: ReactNode;
  className?: string;
}

export function DropdownLabel({ children, className }: DropdownLabelProps) {
  return <div className={cn('px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider', className)}>{children}</div>;
}

// User-specific dropdown
export interface UserDropdownProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  };
  notifications: number;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onSignOut: () => void;
  onNotificationsClick: () => void;
}

export function UserDropdown({ user, notifications, onProfileClick, onSettingsClick, onSignOut, onNotificationsClick }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
          contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') setOpen(false);
  };

  const dropdownContent = open ? (
    <div
      ref={contentRef}
      className="absolute right-0 z-[100] mt-2 w-64 bg-white border border-border rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-150"
      role="menu"
      onKeyDown={handleKeyDown}
    >
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-text-main truncate">{user.name}</p>
            <p className="text-sm text-text-muted truncate">{user.email}</p>
            <p className="text-xs text-primary">{user.role}</p>
          </div>
        </div>
      </div>
      <div className="py-1">
        <button
          onClick={() => { onProfileClick(); setOpen(false); }}
          className="w-full px-3 py-2 text-left text-sm text-text-main hover:bg-gray-50 focus:outline-none focus:bg-gray-50 flex items-center gap-2"
          role="menuitem"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          Profile
        </button>
        <button
          onClick={() => { onSettingsClick(); setOpen(false); }}
          className="w-full px-3 py-2 text-left text-sm text-text-main hover:bg-gray-50 focus:outline-none focus:bg-gray-50 flex items-center gap-2"
          role="menuitem"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Settings
        </button>
        <button
          onClick={() => { onNotificationsClick(); setOpen(false); }}
          className="w-full px-3 py-2 text-left text-sm text-text-main hover:bg-gray-50 focus:outline-none focus:bg-gray-50 flex items-center gap-2 relative"
          role="menuitem"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          Notifications
          {notifications > 0 && (
            <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-full">{notifications}</span>
          )}
        </button>
        <hr className="my-1 border-border" role="separator" />
        <button
          onClick={() => { onSignOut(); setOpen(false); }}
          className="w-full px-3 py-2 text-left text-sm text-error hover:bg-error-light focus:outline-none focus:bg-error-light flex items-center gap-2"
          role="menuitem"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div ref={triggerRef} className="relative inline-block" onKeyDown={handleKeyDown}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-light-blue-surface transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="hidden sm:block text-sm font-medium text-text-main">{user.name.split(' ')[0]}</span>
        <ChevronDown className="h-4 w-4 text-text-muted" />
      </button>
      {dropdownContent}
    </div>
  );
}