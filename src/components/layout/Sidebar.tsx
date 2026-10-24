'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Home, BookOpen, FileText, Wand2, Inbox, BarChart2, Settings, HelpCircle, Sparkles } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, badge: null },
  { href: '/rulebook', label: 'Brand Rulebook', icon: BookOpen, badge: 'v2.4' },
  { href: '/content-checker', label: 'Content Checker', icon: FileText, badge: null },
  { href: '/magic-fix', label: 'Magic Fix', icon: Wand2, badge: 'AI' },
  { href: '/review-queue', label: 'Review Queue', icon: Inbox, badge: '23' },
  { href: '/reports', label: 'Reports & History', icon: BarChart2, badge: null },
  { href: '/settings', label: 'Settings & Tutorial', icon: Settings, badge: null },
];

const helpItems = [
  { label: 'Documentation', icon: BookOpen, action: () => console.log('docs') },
  { label: 'Help Center', icon: HelpCircle, action: () => console.log('help') },
  { label: 'Interactive Tutorial', icon: Sparkles, action: () => console.log('tutorial') },
  { label: 'Keyboard Shortcuts', icon: Sparkles, action: () => console.log('shortcuts') },
];

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const [hovered, setHovered] = useState(false);
  const isExpanded = collapsed && hovered;

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-[200] h-full bg-white border-r border-border transition-all duration-300',
        'flex flex-col',
        collapsed ? 'w-[72px]' : 'w-[280px]'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Main navigation"
    >
      {/* Logo / Brand */}
      <div className={cn('flex items-center justify-between h-[64px] px-4 border-b border-border', collapsed && 'justify-center')}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-text-main">Florén</p>
              <p className="text-xs text-text-muted">AI Enterprise</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={cn(
            'p-2 rounded-lg hover:bg-light-blue-surface transition-colors text-text-muted',
            collapsed ? 'rotate-180' : ''
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-text-secondary hover:bg-light-blue-surface hover:text-text-main'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} aria-hidden="true" />
              {!collapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-primary-light text-primary rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className={cn('px-3 pb-4 border-t border-border', collapsed && 'hidden')}>
        <p className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">Help & Resources</p>
        <div className="space-y-1">
          {helpItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-light-blue-surface hover:text-text-main transition-colors"
              >
                <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Info (collapsed tooltip) */}
      {collapsed && isExpanded && (
        <div className="absolute left-full top-[64px] w-64 bg-white border border-border rounded-xl shadow-lg p-3 z-[210] animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              AM
            </div>
            <div>
              <p className="font-medium text-text-main">Alex Morgan</p>
              <p className="text-sm text-text-muted">Brand Director</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={cn('p-3 border-t border-border', collapsed && 'hidden')}>
        <p className="text-xs text-text-muted text-center">
          Florén AI Enterprise v2.4
        </p>
      </div>
    </aside>
  );
}