'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';

import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  FileText,
  Shield,
  Zap,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const metricCards = [
  {
    title: 'Total Checks',
    value: '12,847',
    change: '+12.5%',
    changeType: 'positive',
    icon: FileText,
    color: 'primary',
  },
  {
    title: 'Compliance Rate',
    value: '94.2%',
    change: '+2.1%',
    changeType: 'positive',
    icon: CheckCircle,
    color: 'success',
  },
  {
    title: 'Violations Detected',
    value: '743',
    change: '-8.3%',
    changeType: 'negative',
    icon: AlertTriangle,
    color: 'error',
  },
  {
    title: 'Pending Review',
    value: '23',
    change: '+5',
    changeType: 'warning',
    icon: Clock,
    color: 'warning',
  },
];

interface RecentActivityItem {
  id: string;
  type: 'check' | 'violation' | 'fix' | 'review';
  title: string;
  status: 'approved' | 'violation' | 'fixed' | 'pending';
  timestamp: string;
  user: string;
}

interface TopViolationItem {
  rule: string;
  name: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
}

interface ComplianceByChannelItem {
  channel: string;
  compliant: number;
  total: number;
  violations: number;
}

const recentActivity: RecentActivityItem[] = [
  { id: '1', type: 'check', title: 'Q4 Campaign Assets', status: 'approved', timestamp: '2 min ago', user: 'Sarah Chen' },
  { id: '2', type: 'violation', title: 'Product Launch Email', status: 'violation', timestamp: '15 min ago', user: 'Mike Johnson' },
  { id: '3', type: 'fix', title: 'Social Media Posts', status: 'fixed', timestamp: '1 hour ago', user: 'AI Magic Fix' },
  { id: '4', type: 'review', title: 'Blog Article Draft', status: 'pending', timestamp: '2 hours ago', user: 'Emma Wilson' },
  { id: '5', type: 'check', title: 'Press Release', status: 'approved', timestamp: '3 hours ago', user: 'David Park' },
  { id: '6', type: 'violation', title: 'Landing Page Copy', status: 'violation', timestamp: '4 hours ago', user: 'Lisa Anderson' },
];

const topViolations: TopViolationItem[] = [
  { rule: 'BR-001', name: 'Unauthorized superlative claims', count: 45, severity: 'high' },
  { rule: 'BR-007', name: 'Missing trademark symbols', count: 38, severity: 'medium' },
  { rule: 'BR-012', name: 'Inconsistent brand voice', count: 29, severity: 'medium' },
  { rule: 'BR-003', name: 'Prohibited competitor references', count: 22, severity: 'high' },
  { rule: 'BR-019', name: 'Tone deviation: too casual', count: 18, severity: 'low' },
];

const complianceByChannel: ComplianceByChannelItem[] = [
  { channel: 'Email', compliant: 96, total: 1250, violations: 50 },
  { channel: 'Social Media', compliant: 91, total: 3420, violations: 308 },
  { channel: 'Web', compliant: 97, total: 890, violations: 27 },
  { channel: 'Print', compliant: 99, total: 120, violations: 1 },
  { channel: 'Video', compliant: 88, total: 340, violations: 41 },
  { channel: 'Ads', compliant: 93, total: 1820, violations: 127 },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ];

  const renderMetricCard = (metric: typeof metricCards[0]) => {
    const Icon = metric.icon;
    const colorClasses = {
      primary: 'bg-primary-light text-primary',
      success: 'bg-success-light text-success',
      error: 'bg-error-light text-error',
      warning: 'bg-warning-light text-warning',
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">{metric.title}</p>
              <p className="mt-2 text-3xl font-bold text-text-main">{metric.value}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={cn(
                  'text-sm font-medium flex items-center gap-1',
                  metric.changeType === 'positive' ? 'text-success' : metric.changeType === 'negative' ? 'text-error' : 'text-warning'
                )}>
                  {metric.changeType === 'positive' && <TrendingUp className="h-4 w-4" />}
                  {metric.changeType === 'negative' && <TrendingDown className="h-4 w-4" />}
                  {metric.changeType === 'warning' && <ArrowUpRight className="h-4 w-4" />}
                  {metric.change}
                </span>
                <span className="text-xs text-text-muted">vs last period</span>
              </div>
            </div>
            <div className={cn('p-3 rounded-xl', colorClasses[metric.color as keyof typeof colorClasses])}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const activityColumns: Column<RecentActivityItem>[] = [
    { key: 'type', header: 'Type', width: '100px', render: (row: RecentActivityItem) => {
      const icons: Record<string, React.ReactNode> = {
        check: <FileText className="h-4 w-4 text-info" />,
        violation: <AlertTriangle className="h-4 w-4 text-error" />,
        fix: <Zap className="h-4 w-4 text-warning" />,
        review: <Clock className="h-4 w-4 text-primary" />,
      };
      const labels: Record<string, string> = { check: 'Check', violation: 'Violation', fix: 'Magic Fix', review: 'Review' };
      return (
        <span className="inline-flex items-center gap-1.5 text-sm">
          {icons[row.type]}
          {labels[row.type]}
        </span>
      );
    }},
    { key: 'title', header: 'Content', render: (row: RecentActivityItem) => <span className="font-medium text-text-main">{row.title}</span> },
    { key: 'status', header: 'Status', width: '120px', render: (row: RecentActivityItem) => {
      const statusConfig: Record<string, { label: string; variant: 'success' | 'error' | 'warning' | 'info'; dot: boolean }> = {
        approved: { label: 'Approved', variant: 'success', dot: true },
        violation: { label: 'Violation', variant: 'error', dot: true },
        fixed: { label: 'Auto-fixed', variant: 'warning', dot: true },
        pending: { label: 'Pending', variant: 'info', dot: true },
      };
      const config = statusConfig[row.status];
      return <Badge variant={config.variant} dot>{config.label}</Badge>;
    }},
    { key: 'timestamp', header: 'Time', width: '100px', render: (row: RecentActivityItem) => <span className="text-text-muted">{row.timestamp}</span> },
    { key: 'user', header: 'User', width: '140px', render: (row: RecentActivityItem) => <span className="text-text-secondary">{row.user}</span> },
  ];

  const violationColumns: Column<TopViolationItem>[] = [
    { key: 'rule', header: 'Rule ID', width: '90px', render: (row: TopViolationItem) => <code className="font-mono text-sm text-text-secondary">{row.rule}</code> },
    { key: 'name', header: 'Rule Name', render: (row: TopViolationItem) => <span className="text-text-main">{row.name}</span> },
    { key: 'count', header: 'Count', width: '80px', align: 'right', render: (row: TopViolationItem) => <span className="font-medium text-text-main">{row.count}</span> },
    { key: 'severity', header: 'Severity', width: '100px', render: (row: TopViolationItem) => {
      const variants: Record<'high' | 'medium' | 'low', 'error' | 'warning' | 'info'> = { high: 'error', medium: 'warning', low: 'info' };
      return <Badge variant={variants[row.severity]}>{row.severity.charAt(0).toUpperCase() + row.severity.slice(1)}</Badge>;
    }},
  ];

  const channelColumns: Column<ComplianceByChannelItem>[] = [
    { key: 'channel', header: 'Channel', width: '140px', render: (row: typeof complianceByChannel[0]) => <span className="font-medium text-text-main">{row.channel}</span> },
    { key: 'compliant', header: 'Compliance', width: '120px', align: 'center', render: (row: typeof complianceByChannel[0]) => (
      <div className="flex items-center justify-center gap-2">
        <div className="relative w-24 h-4">
          <div className="absolute inset-0 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-success rounded-full transition-all"
              style={{ width: `${row.compliant}%` }}
            />
          </div>
        </div>
        <span className="text-sm font-medium text-text-main">{row.compliant}%</span>
      </div>
    )},
    { key: 'total', header: 'Total Checks', width: '120px', align: 'right', render: (row: typeof complianceByChannel[0]) => <span className="text-text-secondary">{row.total.toLocaleString()}</span> },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Dashboard</h1>
            <p className="mt-1 text-sm text-text-muted">Brand compliance overview — {timeRangeOptions.find(o => o.value === timeRange)?.label}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
              options={timeRangeOptions}
              className="w-[160px]"
            />
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map(renderMetricCard)}
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" onChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="violations">Top Violations</TabsTrigger>
            <TabsTrigger value="channels">By Channel</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Compliance Trend
                  </CardTitle>
                  <CardDescription>Daily compliance rate over selected period</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <div className="flex items-end justify-between h-full p-2">
                    {[92, 93, 91, 94, 95, 93, 94, 96, 95, 94, 96, 94, 95, 94.2].map((value, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                        <div
                          className="w-full bg-primary-light rounded-t transition-all hover:bg-primary"
                          style={{ height: `${(value - 90) * 10}%` }}
                        />
                        <span className="text-xs text-text-muted">{i % 3 === 0 ? `Day ${i + 1}` : ''}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5" />
                    Checks by Type
                  </CardTitle>
                  <CardDescription>Distribution of content checks</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <div className="flex items-end justify-around h-full p-2">
                    {[
                      { label: 'Marketing', value: 45 },
                      { label: 'Email', value: 28 },
                      { label: 'Social', value: 18 },
                      { label: 'Web', value: 9 },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <div
                          className="w-16 bg-primary rounded-t transition-all hover:bg-primary-deep"
                          style={{ height: `${item.value}%` }}
                        />
                        <span className="text-xs text-text-muted">{item.label}</span>
                        <span className="text-sm font-medium text-text-main">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Magic Fix Performance
                </CardTitle>
                <CardDescription>Auto-correction success rate and time saved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-success-light rounded-xl">
                    <p className="text-3xl font-bold text-success">87%</p>
                    <p className="text-sm text-text-muted mt-1">Auto-fix Success Rate</p>
                  </div>
                  <div className="text-center p-4 bg-primary-light rounded-xl">
                    <p className="text-3xl font-bold text-primary">234 hrs</p>
                    <p className="text-sm text-text-muted mt-1">Time Saved This Month</p>
                  </div>
                  <div className="text-center p-4 bg-info-light rounded-xl">
                    <p className="text-3xl font-bold text-info">1,247</p>
                    <p className="text-sm text-text-muted mt-1">Auto-fixes Applied</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="violations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Brand Violations</CardTitle>
                <CardDescription>Most frequently violated rules in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={violationColumns}
                  data={topViolations}
                  keyField="rule"
                  pagination={false}
                  striped
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance by Channel</CardTitle>
                <CardDescription>Breakdown of compliance rates across marketing channels</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={channelColumns}
                  data={complianceByChannel}
                  keyField="channel"
                  pagination={false}
                  striped
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest content checks, violations, and reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={activityColumns}
                  data={recentActivity}
                  keyField="id"
                  pagination={false}
                  striped
                  hoverable
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}