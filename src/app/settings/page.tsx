'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';

import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Database,
  Zap,
  BookOpen,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  MoreHorizontal,
  BarChart2,
  Copy,
  Download,
  Upload,
  Moon,
  Sun,
  Monitor,
  Lock,
  Unlock,
  Mail,
  Smartphone,
  RotateCcw,
} from 'lucide-react';

const mockIntegrations = [
  { id: 'slack', name: 'Slack', description: 'Receive notifications in Slack channels', connected: true, category: 'notifications' },
  { id: 'teams', name: 'Microsoft Teams', description: 'Get alerts in Teams', connected: false, category: 'notifications' },
  { id: 'jira', name: 'Jira', description: 'Create tickets for violations', connected: true, category: 'workflow' },
  { id: 'github', name: 'GitHub', description: 'Check code comments and docs', connected: false, category: 'workflow' },
  { id: 'figma', name: 'Figma', description: 'Validate design system compliance', connected: true, category: 'design' },
  { id: 'contentful', name: 'Contentful', description: 'Check content before publishing', connected: false, category: 'cms' },
  { id: 'salesforce', name: 'Salesforce', description: 'Validate sales collateral', connected: false, category: 'crm' },
  { id: 'hubspot', name: 'HubSpot', description: 'Check marketing emails and pages', connected: true, category: 'marketing' },
];

const mockApiKeys = [
  { id: 'key-1', name: 'Production API', prefix: 'bg_live_', created: '2024-01-10', lastUsed: '2 hours ago', status: 'active' },
  { id: 'key-2', name: 'Development API', prefix: 'bg_dev_', created: '2024-01-12', lastUsed: '3 days ago', status: 'active' },
  { id: 'key-3', name: 'CI/CD Pipeline', prefix: 'bg_ci_', created: '2024-01-08', lastUsed: '1 week ago', status: 'revoked' },
];

const mockWebhooks = [
  { id: 'wh-1', name: 'Violation Alerts', url: 'https://api.company.com/webhooks/violations', events: ['violation.detected', 'violation.resolved'], status: 'active' },
  { id: 'wh-2', name: 'Review Notifications', url: 'https://api.company.com/webhooks/reviews', events: ['review.requested', 'review.completed'], status: 'active' },
  { id: 'wh-3', name: 'Magic Fix Complete', url: 'https://api.company.com/webhooks/fix', events: ['fix.completed', 'fix.failed'], status: 'paused' },
];

const mockTeamMembers = [
  { id: '1', name: 'Alex Morgan', email: 'alex.morgan@aurevia.com', role: 'Brand Director', status: 'active', lastActive: '2 min ago' },
  { id: '2', name: 'Sarah Chen', email: 'sarah.chen@aurevia.com', role: 'Senior Reviewer', status: 'active', lastActive: '15 min ago' },
  { id: '3', name: 'Mike Johnson', email: 'mike.johnson@aurevia.com', role: 'Content Creator', status: 'active', lastActive: '1 hour ago' },
  { id: '4', name: 'Emma Wilson', email: 'emma.wilson@aurevia.com', role: 'Reviewer', status: 'away', lastActive: '3 hours ago' },
  { id: '5', name: 'David Park', email: 'david.park@aurevia.com', role: 'Content Creator', status: 'active', lastActive: '30 min ago' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState({
    email: { violations: true, reviews: true, magicFix: true, weeklyDigest: true },
    push: { violations: true, reviews: false, magicFix: true },
    inApp: { violations: true, reviews: true, magicFix: true },
  });
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('utc');
  const [dateFormat, setDateFormat] = useState('us');
  const [dashboardView, setDashboardView] = useState('overview');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [contentDensity, setContentDensity] = useState('comfortable');
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [sidebarBehavior, setSidebarBehavior] = useState('persistent');
  const [defaultSeverity, setDefaultSeverity] = useState('medium');
  const [autoFixDefault, setAutoFixDefault] = useState('enabled');
  const [retentionPeriod, setRetentionPeriod] = useState('2y');
  const [strictnessLevel, setStrictnessLevel] = useState('standard');
  const [processingMode, setProcessingMode] = useState('async');
  const [saving, setSaving] = useState(false);
  const { success, info } = useToast();

  const tabs = [
    { value: 'general', label: 'General', icon: <Settings className="h-4 w-4" /> },
    { value: 'appearance', label: 'Appearance', icon: <Palette className="h-4 w-4" /> },
    { value: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { value: 'integrations', label: 'Integrations', icon: <Zap className="h-4 w-4" /> },
    { value: 'api', label: 'API & Webhooks', icon: <Key className="h-4 w-4" /> },
    { value: 'team', label: 'Team', icon: <Users className="h-4 w-4" /> },
    { value: 'rulebook', label: 'Rulebook', icon: <BookOpen className="h-4 w-4" /> },
    { value: 'tutorial', label: 'Tutorial', icon: <Sparkles className="h-4 w-4" /> },
    { value: 'advanced', label: 'Advanced', icon: <Shield className="h-4 w-4" /> },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    success('Settings saved', 'Your preferences have been updated.');
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Settings & Tutorial
            </h1>
            <p className="mt-1 text-sm text-text-muted">Manage your preferences, integrations, and learn the platform</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" onChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2 justify-center py-3">
                {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue="Alex Morgan" />
                  <Input label="Email" type="email" defaultValue="alex.morgan@aurevia.com" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Role" defaultValue="Brand Director" disabled />
                  <Input label="Organization" defaultValue="Aurevia Global" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Bio</label>
                  <textarea
                    className="w-full min-h-[80px] p-3 border border-border rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    defaultValue="Brand Director at Aurevia Global. Leading brand compliance initiatives across all marketing channels."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline"><Upload className="h-4 w-4 mr-2" /> Change Avatar</Button>
                  <Button variant="ghost" onClick={() => info('Avatar removed', 'Default avatar restored')}>Remove</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Preferences</CardTitle>
                <CardDescription>Language, timezone, and display preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select label="Language" value={language} onValueChange={setLanguage} options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                    { value: 'de', label: 'German' },
                    { value: 'ja', label: 'Japanese' },
                  ]} />
                  <Select label="Timezone" value={timezone} onValueChange={setTimezone} options={[
                    { value: 'utc', label: 'UTC' },
                    { value: 'est', label: 'Eastern Time (ET)' },
                    { value: 'pst', label: 'Pacific Time (PT)' },
                    { value: 'gmt', label: 'GMT' },
                    { value: 'cet', label: 'Central European Time' },
                  ]} />
                  <Select label="Date Format" value={dateFormat} onValueChange={setDateFormat} options={[
                    { value: 'us', label: 'MM/DD/YYYY (US)' },
                    { value: 'eu', label: 'DD/MM/YYYY (EU)' },
                    { value: 'iso', label: 'YYYY-MM-DD (ISO)' },
                  ]} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select label="Default Dashboard View" value={dashboardView} onValueChange={setDashboardView} options={[
                    { value: 'overview', label: 'Overview' },
                    { value: 'violations', label: 'Top Violations' },
                    { value: 'activity', label: 'Recent Activity' },
                  ]} />
                  <Select label="Items per Page" value={itemsPerPage} onValueChange={setItemsPerPage} options={[
                    { value: '10', label: '10' },
                    { value: '25', label: '25' },
                    { value: '50', label: '50' },
                    { value: '100', label: '100' },
                  ]} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" /> Security</CardTitle>
                <CardDescription>Password, 2FA, and session management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-text-main">Two-Factor Authentication</p>
                    <p className="text-sm text-text-muted">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="primary" size="sm"><Shield className="h-4 w-4 mr-2" /> Enable 2FA</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-text-main">Change Password</p>
                    <p className="text-sm text-text-muted">Last changed 45 days ago</p>
                  </div>
                  <Button variant="outline" size="sm"><Key className="h-4 w-4 mr-2" /> Change</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-text-main">Active Sessions</p>
                    <p className="text-sm text-text-muted">3 active sessions across devices</p>
                  </div>
                  <Button variant="outline" size="sm"><RotateCcw className="h-4 w-4 mr-2" /> Revoke All</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Theme</CardTitle>
                <CardDescription>Choose your preferred color scheme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: 'Light', icon: Sun, desc: 'Always use light mode' },
                    { value: 'dark', label: 'Dark', icon: Moon, desc: 'Always use dark mode' },
                    { value: 'system', label: 'System', icon: Monitor, desc: 'Match system preference' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value as any)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-left',
                        theme === option.value
                          ? 'border-primary bg-primary-light'
                          : 'border-border hover:border-text-muted'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <option.icon className={cn('h-6 w-6', theme === option.value ? 'text-primary' : 'text-text-muted')} />
                        <div>
                          <p className="font-medium text-text-main">{option.label}</p>
                          <p className="text-xs text-text-muted">{option.desc}</p>
                        </div>
                      </div>
                      {theme === option.value && <CheckCircle className="h-5 w-5 text-primary ml-auto" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Brand Colors</CardTitle>
                <CardDescription>Customize Florén accent colors (Enterprise only)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-text-main">Custom Brand Colors</p>
                      <p className="text-sm text-text-muted">Override default indigo/purple theme with your brand colors</p>
                    </div>
                    <Badge variant="warning" size="sm">Enterprise Feature</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Primary Color</label>
                      <input type="color" className="w-full h-10 rounded-lg border border-border cursor-pointer" defaultValue="#4F46E5" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Secondary Color</label>
                      <input type="color" className="w-full h-10 rounded-lg border border-border cursor-pointer" defaultValue="#8B5CF6" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Success Color</label>
                      <input type="color" className="w-full h-10 rounded-lg border border-border cursor-pointer" defaultValue="#10B981" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Warning Color</label>
                      <input type="color" className="w-full h-10 rounded-lg border border-border cursor-pointer" defaultValue="#F59E0B" />
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-3">Requires Enterprise plan. Contact sales to enable.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Interface</CardTitle>
                <CardDescription>Density, animations, and sidebar behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select label="Content Density" value={contentDensity} onValueChange={setContentDensity} options={[
                    { value: 'compact', label: 'Compact' },
                    { value: 'comfortable', label: 'Comfortable' },
                    { value: 'spacious', label: 'Spacious' },
                  ]} />
                  <Select label="Animation Speed" value={animationSpeed} onValueChange={setAnimationSpeed} options={[
                    { value: 'none', label: 'None (Reduce Motion)' },
                    { value: 'fast', label: 'Fast' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'slow', label: 'Slow' },
                  ]} />
                  <Select label="Sidebar Behavior" value={sidebarBehavior} onValueChange={setSidebarBehavior} options={[
                    { value: 'persistent', label: 'Always Visible' },
                    { value: 'auto-collapse', label: 'Auto-collapse on Hover' },
                    { value: 'collapsed', label: 'Start Collapsed' },
                  ]} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Email Notifications</CardTitle>
                <CardDescription>Configure when you receive email alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'violations', label: 'New Violations', desc: 'When brand violations are detected in your content' },
                  { key: 'reviews', label: 'Review Requests', desc: 'When content is submitted for your review' },
                  { key: 'magicFix', label: 'Magic Fix Complete', desc: 'When auto-corrections finish processing' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of compliance metrics every Monday' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-text-main">{item.label}</p>
                      <p className="text-sm text-text-muted">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={notifications.email[item.key as keyof typeof notifications.email]}
                        onChange={(e) => setNotifications(prev => ({ ...prev, email: { ...prev.email, [item.key]: e.target.checked } }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5" /> Push Notifications</CardTitle>
                <CardDescription>Browser push notifications for real-time alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'violations', label: 'High Severity Violations', desc: 'Immediate alert for critical brand violations' },
                  { key: 'reviews', label: 'Assigned Reviews', desc: 'When content is assigned to you for review' },
                  { key: 'magicFix', label: 'Magic Fix Results', desc: 'When auto-fix jobs complete' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-text-main">{item.label}</p>
                      <p className="text-sm text-text-muted">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={notifications.push[item.key as keyof typeof notifications.push]}
                        onChange={(e) => setNotifications(prev => ({ ...prev, push: { ...prev.push, [item.key]: e.target.checked } }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> In-App Notifications</CardTitle>
                <CardDescription>Notifications shown in the app notification center</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'violations', label: 'All Violations', desc: 'Show all detected violations in notification center' },
                  { key: 'reviews', label: 'Review Updates', desc: 'Review status changes and comments' },
                  { key: 'magicFix', label: 'Magic Fix Updates', desc: 'Progress and completion notifications' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-text-main">{item.label}</p>
                      <p className="text-sm text-text-muted">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={notifications.inApp[item.key as keyof typeof notifications.inApp]}
                        onChange={(e) => setNotifications(prev => ({ ...prev, inApp: { ...prev.inApp, [item.key]: e.target.checked } }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="mt-6 space-y-6">
            {['notifications', 'workflow', 'design', 'cms', 'crm', 'marketing'].map((category) => {
              const categoryIntegrations = mockIntegrations.filter(i => i.category === category);
              if (categoryIntegrations.length === 0) return null;
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">{category}</CardTitle>
                    <CardDescription>Connect with {category} tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryIntegrations.map((integration) => (
                        <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                              <Zap className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-text-main">{integration.name}</p>
                              <p className="text-sm text-text-muted">{integration.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked={integration.connected}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* API & Webhooks Tab */}
          <TabsContent value="api" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> API Keys</CardTitle>
                <CardDescription>Manage API keys for programmatic access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-text-muted">API keys provide access to Florén APIs. Keep them secure.</p>
                  <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" /> Generate Key</Button>
                </div>
                <div className="space-y-3">
                  {mockApiKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                          <Key className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-main">{key.name}</p>
                          <p className="text-sm text-text-muted font-mono">{key.prefix}••••••••</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span>Created: {key.created}</span>
                        <span>Last used: {key.lastUsed}</span>
                        <Badge variant={key.status === 'active' ? 'success' : 'error'} size="sm">
                          {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm"><Copy className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-error"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5" /> Webhooks</CardTitle>
                <CardDescription>Configure webhook endpoints for real-time events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-text-muted">Webhooks send real-time events to your endpoints.</p>
                  <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" /> Add Webhook</Button>
                </div>
                <div className="space-y-3">
                  {mockWebhooks.map((webhook) => (
                    <div key={webhook.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium text-text-main">{webhook.name}</p>
                          <Badge variant={webhook.status === 'active' ? 'success' : 'warning'} size="sm">{webhook.status}</Badge>
                        </div>
                        <p className="text-sm text-text-muted font-mono truncate max-w-md">{webhook.url}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="default" size="sm">{event}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" className="text-error"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Team Members</CardTitle>
                <CardDescription>Manage team access and roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-text-muted">{mockTeamMembers.length} team members</p>
                  <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" /> Invite Member</Button>
                </div>
                <div className="space-y-3">
                  {mockTeamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-text-main">{member.name}</p>
                          <p className="text-sm text-text-muted">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="default" size="sm">{member.role}</Badge>
                        <Badge variant={member.status === 'active' ? 'success' : 'warning'} size="sm" dot>
                          {member.status}
                        </Badge>
                        <span className="text-sm text-text-muted">{member.lastActive}</span>
                        <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Roles & Permissions</CardTitle>
                <CardDescription>Define what each role can access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                        <th className="pb-3">Permission</th>
                        <th className="pb-3 text-center">Brand Director</th>
                        <th className="pb-3 text-center">Senior Reviewer</th>
                        <th className="pb-3 text-center">Reviewer</th>
                        <th className="pb-3 text-center">Content Creator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {[
                        { perm: 'View Dashboard', roles: [true, true, true, true] },
                        { perm: 'Check Content', roles: [true, true, true, true] },
                        { perm: 'Magic Fix', roles: [true, true, true, true] },
                        { perm: 'View Reports', roles: [true, true, false, false] },
                        { perm: 'Manage Rulebook', roles: [true, true, false, false] },
                        { perm: 'Approve Content', roles: [true, true, true, false] },
                        { perm: 'Reject Content', roles: [true, true, false, false] },
                        { perm: 'Manage Team', roles: [true, false, false, false] },
                        { perm: 'Configure Integrations', roles: [true, false, false, false] },
                        { perm: 'Manage API Keys', roles: [true, false, false, false] },
                        { perm: 'Access Audit Log', roles: [true, true, false, false] },
                        { perm: 'Delete Content', roles: [true, false, false, false] },
                      ].map((item, i) => (
                        <tr key={item.perm} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                          <td className="py-3 font-medium text-text-main">{item.perm}</td>
                          {item.roles.map((allowed, j) => (
                            <td key={j} className="py-3 text-center">
                              {allowed ? (
                                <CheckCircle className="h-5 w-5 text-success mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rulebook Tab */}
          <TabsContent value="rulebook" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Rulebook Settings</CardTitle>
                <CardDescription>Configure rulebook behavior and versioning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">Current Version</label>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-light rounded-lg">
                      <code className="font-mono text-primary text-lg">v2.4</code>
                    </div>
                    <div>
                      <p className="font-medium text-text-main">Active Rulebook Version</p>
                      <p className="text-sm text-text-muted">Released January 15, 2024</p>
                    </div>
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-2" /> View Changelog</Button>
                    <Button variant="outline" size="sm"><RotateCcw className="h-4 w-4 mr-2" /> Rollback</Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-text-main">Auto-update Rules</p>
                      <p className="text-sm text-text-muted">Automatically apply new rule versions when published</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Default Severity for New Rules" value={defaultSeverity} onValueChange={setDefaultSeverity} options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                    ]} />
                    <Select label="Auto-fix Default" value={autoFixDefault} onValueChange={setAutoFixDefault} options={[
                      { value: 'enabled', label: 'Enabled' },
                      { value: 'disabled', label: 'Disabled' },
                    ]} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">Custom Dictionary</label>
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-text-muted mb-3">Add organization-specific terms, acronyms, and approved language</p>
                    <textarea
                      className="w-full min-h-[120px] p-3 border border-border rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                      placeholder="Aurevia Global®
Florén™
Command Center
Magic Fix™
Governance Engine"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorial Tab */}
          <TabsContent value="tutorial" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> Interactive Tutorial</CardTitle>
                <CardDescription>Learn Florén with guided walkthroughs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Getting Started', desc: 'Learn the basics of Florén in 5 minutes', duration: '5 min', completed: true, icon: CheckCircle },
                  { title: 'Content Checker Walkthrough', desc: 'How to check content for brand compliance', duration: '8 min', completed: true, icon: CheckCircle },
                  { title: 'Magic Fix Tutorial', desc: 'Using AI-powered auto-corrections', duration: '6 min', completed: false, icon: Zap },
                  { title: 'Rulebook Management', desc: 'Creating and managing brand rules', duration: '10 min', completed: false, icon: BookOpen },
                  { title: 'Review Queue Guide', desc: 'Managing the content review workflow', duration: '7 min', completed: false, icon: Shield },
                  { title: 'Reports & Analytics', desc: 'Understanding compliance metrics', duration: '8 min', completed: false, icon: BarChart2 },
                  { title: 'Advanced: API Integration', desc: 'Connecting Florén to your workflow', duration: '12 min', completed: false, icon: Key },
                  { title: 'Admin: Team & Permissions', desc: 'Setting up roles and access control', duration: '6 min', completed: false, icon: Users },
                ].map((tutorial, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: tutorial.completed ? '#D1FAE5' : '#EFF4FF' }}>
                        {tutorial.completed ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <tutorial.icon className={cn('h-5 w-5', tutorial.completed ? 'text-success' : 'text-primary')} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-text-main">{tutorial.title}</p>
                        <p className="text-sm text-text-muted">{tutorial.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-text-muted">{tutorial.duration}</span>
                      <Button
                        variant={tutorial.completed ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => info('Tutorial started', `Starting "${tutorial.title}"...`)}
                      >
                        {tutorial.completed ? 'Replay' : 'Start'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" /> Help Resources</CardTitle>
                <CardDescription>Documentation, support, and community</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 text-left justify-start gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium text-text-main">Documentation</p>
                    <p className="text-sm text-text-muted">Complete guides and API reference</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-text-muted" />
                </Button>
                <Button variant="outline" className="h-auto p-4 text-left justify-start gap-3">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium text-text-main">Help Center</p>
                    <p className="text-sm text-text-muted">FAQs and troubleshooting</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-text-muted" />
                </Button>
                <Button variant="outline" className="h-auto p-4 text-left justify-start gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium text-text-main">Community Forum</p>
                    <p className="text-sm text-text-muted">Connect with other Florén users</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-text-muted" />
                </Button>
                <Button variant="outline" className="h-auto p-4 text-left justify-start gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium text-text-main">Contact Support</p>
                    <p className="text-sm text-text-muted">Get help from our support team</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-text-muted" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Data & Privacy</CardTitle>
                <CardDescription>Data retention, export, and deletion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-text-main">Data Retention Period</p>
                    <p className="text-sm text-text-muted">How long to keep compliance history and audit logs</p>
                  </div>
                  <Select value={retentionPeriod} onValueChange={setRetentionPeriod} options={[
                    { value: '1y', label: '1 Year' },
                    { value: '2y', label: '2 Years' },
                    { value: '5y', label: '5 Years' },
                    { value: '7y', label: '7 Years (Compliance)' },
                    { value: 'indefinite', label: 'Indefinite' },
                  ]} className="w-[180px]" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-text-main">Anonymize Old Data</p>
                    <p className="text-sm text-text-muted">Remove PII from data older than retention period</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export All Data</Button>
                  <Button variant="destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete Account</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Governance Engine</CardTitle>
                <CardDescription>Configure the Aurevia Global Governance Engine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-text-main">Engine Version</p>
                      <p className="text-sm text-text-muted">Aurevia Global Governance Engine</p>
                    </div>
                    <Badge variant="default">v2.4.1</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Strictness Level" value={strictnessLevel} onValueChange={setStrictnessLevel} options={[
                      { value: 'lenient', label: 'Lenient' },
                      { value: 'standard', label: 'Standard' },
                      { value: 'strict', label: 'Strict' },
                      { value: 'custom', label: 'Custom' },
                    ]} />
                    <Select label="Processing Mode" value={processingMode} onValueChange={setProcessingMode} options={[
                      { value: 'sync', label: 'Synchronous' },
                      { value: 'async', label: 'Asynchronous' },
                    ]} />
                  </div>
                  <div className="mt-4 p-3 bg-warning-light border border-warning/20 rounded-lg">
                    <p className="text-sm text-warning"><strong>Note:</strong> Changing engine settings affects all content checks. Test in staging first.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Unlock className="h-5 w-5" /> Feature Flags</CardTitle>
                <CardDescription>Enable or disable experimental features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Magic Fix v2 (Beta)', desc: 'Enhanced AI model with better context awareness', enabled: false, beta: true },
                  { name: 'Real-time Collaboration', desc: 'Multiple reviewers can edit simultaneously', enabled: true, beta: false },
                  { name: 'Advanced Analytics', desc: 'ML-powered compliance predictions', enabled: false, beta: true },
                  { name: 'Custom ML Models', desc: 'Train organization-specific compliance models', enabled: false, beta: true },
                  { name: 'Voice & Tone Scoring', desc: 'Quantitative brand voice analysis', enabled: true, beta: false },
                  { name: 'Multi-language Support', desc: 'Check content in 15+ languages', enabled: false, beta: true },
                ].map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-text-main">{feature.name}</p>
                        {feature.beta && <Badge variant="warning" size="sm">Beta</Badge>}
                      </div>
                      <p className="text-sm text-text-muted">{feature.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={feature.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

// Need to import Users
import { Users } from 'lucide-react';