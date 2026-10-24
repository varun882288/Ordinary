'use client';

import { cn } from '@/lib/utils';
import { Bell, Search, Moon, Sun, Monitor, HelpCircle, LogOut, User, Settings, BookOpen } from 'lucide-react';
import { Dropdown, UserDropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Magic Fix Complete', message: 'MF-2024-001 finished with 12 fixes', time: '2 min ago', read: false },
    { id: '2', title: 'Review Assigned', message: 'You have been assigned to review SUB-2024-002', time: '15 min ago', read: false },
    { id: '3', title: 'New Violation Pattern', message: 'BR-001 violations trending up this week', time: '1 hour ago', read: true },
    { id: '4', title: 'Rulebook Updated', message: 'Version 2.4 is now active', time: '3 hours ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-[150] h-[64px] bg-white border-b border-border',
        'flex items-center justify-between px-4 transition-all duration-300',
        sidebarCollapsed ? 'left-[72px]' : 'left-[280px]'
      )}
      role="banner"
    >
      {/* Left: Sidebar toggle + Search */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="hidden lg:flex"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="search"
            placeholder="Search rules, content, reports..."
            className="w-[280px] pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
            aria-label="Global search"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Theme Toggle */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
              const currentIndex = themes.indexOf(theme);
              setTheme(themes[(currentIndex + 1) % 3]);
            }}
            aria-label={`Current theme: ${theme}. Click to cycle.`}
          >
            {theme === 'light' && <Sun className="h-5 w-5" />}
            {theme === 'dark' && <Moon className="h-5 w-5" />}
            {theme === 'system' && <Monitor className="h-5 w-5" />}
          </Button>
        </div>

        {/* Notifications */}
        <Dropdown
          trigger={
            <Button
              variant="ghost"
              size="sm"
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            >
              <Bell className="h-5 w-5 relative" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          }
          content={
            <div className="w-80">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <p className="font-medium text-text-main">Notifications</p>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                    Mark all read
                  </Button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    className={cn(
                      'w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-border-light',
                      !notification.read && 'bg-primary-light/30'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('w-2 h-2 mt-2 rounded-full flex-shrink-0', !notification.read && 'bg-primary')}>
                      {!notification.read && <span className="sr-only">Unread</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('font-medium text-text-main', !notification.read && 'font-semibold')}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-text-muted mt-0.5">{notification.message}</p>
                      <p className="text-xs text-text-muted mt-1">{notification.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {notifications.length === 0 && (
              <div className="p-6 text-center text-text-muted">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            )}
          </div>
        }
        />

        {/* Help */}
        <Dropdown
          trigger={
            <Button variant="ghost" size="sm" aria-label="Help">
              <HelpCircle className="h-5 w-5" />
            </Button>
          }
          content={
            <div className="w-48">
              <button className="w-full px-3 py-2 text-left text-sm text-text-main hover:bg-gray-50 flex items-center gap-2" role="menuitem">
                <BookOpen className="h-4 w-4" /> Documentation
              </button>
              <button className="w-full px-3 py-2 text-left text-sm text-text-main hover:bg-gray-50 flex items-center gap-2" role="menuitem">
                <HelpCircle className="h-4 w-4" /> Help Center
              </button>
              <button className="w-full px-3 py-2 text-left text-sm text-text-main hover:bg-gray-50 flex items-center gap-2" role="menuitem">
                <Settings className="h-4 w-4" /> Keyboard Shortcuts
              </button>
              <hr className="my-1 border-border" role="separator" />
              <button className="w-full px-3 py-2 text-left text-sm text-text-main hover:bg-gray-50 flex items-center gap-2" role="menuitem">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          }
        />

        {/* User Menu */}
        <UserDropdown
          user={{
            name: 'Alex Morgan',
            email: 'alex.morgan@aurevia.com',
            role: 'Brand Director',
            avatar: null,
          }}
          notifications={unreadCount}
          onProfileClick={() => console.log('Profile')}
          onSettingsClick={() => console.log('Settings')}
          onSignOut={() => console.log('Sign out')}
          onNotificationsClick={() => console.log('Notifications')}
        />
      </div>
    </header>
  );
}