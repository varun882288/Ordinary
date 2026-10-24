'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';
import { appConstants } from '@/lib/design-tokens';
import { Dropdown, UserDropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface TopBarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  notifications: number;
  onSearch: (query: string) => void;
  onCheckNewContent: () => void;
  onNotificationsClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onSignOut: () => void;
}

export function TopBar({
  sidebarCollapsed,
  onToggleSidebar,
  notifications,
  onSearch,
  onCheckNewContent,
  onNotificationsClick,
  onProfileClick,
  onSettingsClick,
  onSignOut,
}: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-[64px] bg-white border-b border-border z-[150] transition-all duration-300',
        sidebarCollapsed ? 'left-[72px]' : 'left-[280px]'
      )}
      role="banner"
    >
      <div className="flex h-full items-center gap-4 px-4 lg:px-6">
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-light-blue-surface transition-colors text-text-secondary"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Sidebar Toggle (Desktop) */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 rounded-lg hover:bg-light-blue-surface transition-colors text-text-secondary"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronDown className="h-5 w-5 rotate-90" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Breadcrumb & Title */}
        <div className="hidden md:flex flex-1 items-center gap-3">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <span className="text-text-muted">{appConstants.organization}</span>
            <ChevronDown className="h-3 w-3 text-text-muted" />
            <span className="font-medium text-text-main">Governance Console</span>
          </nav>
        </div>

        {/* Global Search */}
        <div className="relative flex-1 max-w-xl hidden lg:block">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search rules, content, history... (⌘K)"
              className="w-full pl-10 pr-4 py-2 bg-light-blue-surface border border-transparent rounded-lg text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-primary focus:bg-white transition-colors"
              aria-label="Global search"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-text-muted bg-white/50 rounded">
              <span className="font-mono">⌘K</span>
            </kbd>
          </form>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden flex-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search... (⌘K)"
              className="w-full pl-10 pr-4 py-2 bg-light-blue-surface border border-transparent rounded-lg text-sm text-text-main placeholder-text-muted focus:outline-none focus:border-primary focus:bg-white transition-colors"
              aria-label="Global search"
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Check New Content Button */}
          <Button
            onClick={onCheckNewContent}
            className="hidden sm:flex items-center gap-2"
            size="md"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Check New Content
          </Button>

          {/* Notification Bell & User Dropdown */}
          <UserDropdown
            user={appConstants.demoUser}
            notifications={notifications}
            onProfileClick={onProfileClick}
            onSettingsClick={onSettingsClick}
            onSignOut={onSignOut}
            onNotificationsClick={onNotificationsClick}
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[140] bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {mobileMenuOpen && (
        <aside className="lg:hidden fixed top-0 left-0 h-full w-[280px] bg-white border-r border-border z-[160] animate-in">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <p className="font-semibold text-text-main">Navigation</p>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-light-blue-surface transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {[
                { href: '/dashboard', label: 'Dashboard', icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
                { href: '/rulebook', label: 'Brand Rulebook', icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
                { href: '/content-checker', label: 'Content Checker', icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                { href: '/magic-fix', label: 'Magic Fix', icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
                { href: '/review-queue', label: 'Review Queue', icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                { href: '/reports', label: 'Reports & History', icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
                { href: '/settings', label: 'Settings & Tutorial', icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-light-blue-surface hover:text-text-main transition-colors"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>
      )}
    </header>
  );
}