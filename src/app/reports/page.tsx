'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';

import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { useToast } from '@/components/ui/Toast';
import {
  BarChart2,
  Download,
  Filter,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Users,
  Shield,
  Zap,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const reportTypes = [
  { value: 'compliance', label: 'Compliance Overview' },
  { value: 'violations', label: 'Violations Analysis' },
  { value: 'team', label: 'Team Performance' },
  { value: 'channel', label: 'Channel Breakdown' },
  { value: 'trends', label: 'Trend Analysis' },
  { value: 'audit', label: 'Audit Trail' },
];

const timeRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
];

const mockMetrics = {
  compliance: {
    current: 94.2,
    previous: 92.1,
    trend: 'up' as 'up' | 'down',
  },
  totalChecks: {
    current: 12847,
    previous: 11420,
    trend: 'up' as 'up' | 'down',
  },
  violations: {
    current: 743,
    previous: 812,
    trend: 'down' as 'up' | 'down',
  },
  avgReviewTime: {
    current: '2.3 hrs',
    previous: '3.1 hrs',
    trend: 'down' as 'up' | 'down',
  },
};

const mockViolationTrends = [
  { date: 'Jan 1', high: 12, medium: 28, low: 45 },
  { date: 'Jan 4', high: 8, medium: 22, low: 38 },
  { date: 'Jan 7', high: 15, medium: 31, low: 52 },
  { date: 'Jan 10', high: 6, medium: 18, low: 29 },
  { date: 'Jan 13', high: 9, medium: 24, low: 35 },
  { date: 'Jan 15', high: 7, medium: 20, low: 31 },
];

const mockTeamPerformance = [
  { name: 'Marketing', checks: 3420, compliance: 96, avgTime: '1.8h', violations: 137 },
  { name: 'Product Marketing', checks: 2180, compliance: 92, avgTime: '2.4h', violations: 174 },
  { name: 'Social Media', checks: 1890, compliance: 89, avgTime: '3.1h', violations: 207 },
  { name: 'Communications', checks: 1250, compliance: 97, avgTime: '1.5h', violations: 38 },
  { name: 'Content', checks: 980, compliance: 91, avgTime: '2.7h', violations: 87 },
  { name: 'Paid Media', checks: 850, compliance: 94, avgTime: '2.1h', violations: 51 },
  { name: 'HR', checks: 420, compliance: 88, avgTime: '3.5h', violations: 50 },
  { name: 'Legal', checks: 310, compliance: 99, avgTime: '1.2h', violations: 3 },
];

const mockChannelData = [
  { channel: 'Email', total: 3420, compliant: 3283, violations: 137, autoFixed: 89, avgScore: 96 },
  { channel: 'Social Media', total: 2890, compliant: 2572, violations: 318, autoFixed: 156, avgScore: 89 },
  { channel: 'Web', total: 1890, compliant: 1833, violations: 57, autoFixed: 34, avgScore: 97 },
  { channel: 'Press', total: 560, compliant: 543, violations: 17, autoFixed: 8, avgScore: 97 },
  { channel: 'Blog', total: 1240, compliant: 1128, violations: 112, autoFixed: 67, avgScore: 91 },
  { channel: 'Ads', total: 2180, compliant: 2047, violations: 133, autoFixed: 78, avgScore: 94 },
  { channel: 'Video', total: 340, compliant: 299, violations: 41, autoFixed: 22, avgScore: 88 },
  { channel: 'Print', total: 120, compliant: 119, violations: 1, autoFixed: 0, avgScore: 99 },
];

const mockTopRules = [
  { rule: 'BR-001', name: 'Unauthorized superlative claims', violations: 145, autoFixed: 89, trend: 'up' },
  { rule: 'BR-004', name: 'Missing trademark symbols', violations: 98, autoFixed: 98, trend: 'down' },
  { rule: 'BR-002', name: 'Brand voice deviation', violations: 87, autoFixed: 65, trend: 'up' },
  { rule: 'BR-008', name: 'Unsupported performance claims', violations: 62, autoFixed: 0, trend: 'down' },
  { rule: 'BR-003', name: 'Prohibited competitor references', violations: 45, autoFixed: 12, trend: 'stable' },
  { rule: 'BR-005', name: 'Inclusive language', violations: 38, autoFixed: 38, trend: 'down' },
  { rule: 'BR-007', name: 'Trademark symbol consistency', violations: 31, autoFixed: 31, trend: 'stable' },
  { rule: 'BR-012', name: 'Tone consistency', violations: 28, autoFixed: 18, trend: 'up' },
];

const mockAuditLog = [
  { id: 'AUD-001', timestamp: '2024-01-15 14:32', user: 'Alex Morgan', action: 'Approved', resource: 'SUB-2024-004', details: 'Press Release approved' },
  { id: 'AUD-002', timestamp: '2024-01-15 11:45', user: 'Alex Morgan', action: 'Started Review', resource: 'SUB-2024-002', details: 'Landing page review started' },
  { id: 'AUD-003', timestamp: '2024-01-15 10:32', user: 'System', action: 'Magic Fix Completed', resource: 'MF-2024-001', details: '12 auto-fixes applied' },
  { id: 'AUD-004', timestamp: '2024-01-15 09:30', user: 'Sarah Chen', action: 'Submitted', resource: 'SUB-2024-001', details: 'Q4 Campaign email submitted' },
  { id: 'AUD-005', timestamp: '2024-01-15 08:30', user: 'Alex Morgan', action: 'Approved', resource: 'SUB-2024-004', details: 'Press Release approved' },
  { id: 'AUD-006', timestamp: '2024-01-14 16:45', user: 'David Park', action: 'Submitted', resource: 'SUB-2024-004', details: 'Press Release submitted' },
  { id: 'AUD-007', timestamp: '2024-01-14 14:20', user: 'Alex Morgan', action: 'Rejected', resource: 'SUB-2024-005', details: 'Blog rejected - superlatives' },
  { id: 'AUD-008', timestamp: '2024-01-14 11:00', user: 'Alex Morgan', action: 'Changes Requested', resource: 'SUB-2024-007', details: 'Newsletter - tone too casual' },
  { id: 'AUD-009', timestamp: '2024-01-14 10:00', user: 'Lisa Anderson', action: 'Submitted', resource: 'SUB-2024-005', details: 'Blog article submitted' },
  { id: 'AUD-010', timestamp: '2024-01-13 15:00', user: 'Sarah Chen', action: 'Approved', resource: 'SUB-2024-006', details: 'Ad copy approved' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState('compliance');
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const { success } = useToast();

  const tabs = [
    { value: 'overview', label: 'Overview', icon: <BarChart2 className="h-4 w-4" /> },
    { value: 'violations', label: 'Violations', icon: <AlertTriangle className="h-4 w-4" /> },
    { value: 'teams', label: 'Teams', icon: <Users className="h-4 w-4" /> },
    { value: 'channels', label: 'Channels', icon: <Shield className="h-4 w-4" /> },
    { value: 'rules', label: 'Rules', icon: <FileText className="h-4 w-4" /> },
    { value: 'audit', label: 'Audit Log', icon: <Shield className="h-4 w-4" /> },
  ];

  const renderMetricCard = (title: string, value: string | number, change: { current: number; previous: number; trend: 'up' | 'down' }, icon: React.ReactNode, color: string) => {
    const changePercent = ((change.current - change.previous) / change.previous * 100).toFixed(1);
    const trendIcon = change.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
    const trendColor = change.trend === 'up' ? 'text-success' : 'text-error';

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">{title}</p>
              <p className="mt-2 text-3xl font-bold text-text-main">{value}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={cn('text-sm font-medium flex items-center gap-1', trendColor)}>
                  {trendIcon}
                  {change.trend === 'up' ? '+' : ''}{changePercent}%
                </span>
                <span className="text-xs text-text-muted">vs previous period</span>
              </div>
            </div>
            <div className={cn('p-3 rounded-xl', `bg-${color}-light text-${color}`)}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderViolationChart = () => (
    <div className="h-64 flex items-end justify-between p-2">
      {mockViolationTrends.map((day, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
          <div className="w-full flex gap-1" style={{ height: `${(day.high + day.medium + day.low) * 1.2}px` }}>
            <div className="flex-1 bg-error/60 rounded-t" style={{ height: `${day.high * 1.2}px` }} title={`High: ${day.high}`} />
            <div className="flex-1 bg-warning/60 rounded-t" style={{ height: `${day.medium * 1.2}px` }} title={`Medium: ${day.medium}`} />
            <div className="flex-1 bg-info/60 rounded-t" style={{ height: `${day.low * 1.2}px` }} title={`Low: ${day.low}`} />
          </div>
          <span className="text-xs text-text-muted">{day.date}</span>
        </div>
      ))}
    </div>
  );

  const renderComplianceChart = () => (
    <div className="h-64 flex items-end justify-between p-2">
      {[92, 93, 91, 94, 95, 93, 94, 96, 95, 94, 96, 94, 95, 94.2].map((value, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
          <div className="w-6 bg-primary-light rounded-t transition-all hover:bg-primary" style={{ height: `${(value - 88) * 15}px` }} title={`${value}%`} />
          <span className="text-xs text-text-muted">{i % 2 === 0 ? `Day ${i + 1}` : ''}</span>
        </div>
      ))}
    </div>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <BarChart2 className="h-6 w-6" />
              Reports & History
            </h1>
            <p className="mt-1 text-sm text-text-muted">Compliance analytics and audit trail — {timeRanges.find(t => t.value === timeRange)?.label}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={reportType} onValueChange={setReportType} options={reportTypes} className="w-[200px]" placeholder="Report Type" />
            <Select value={timeRange} onValueChange={setTimeRange} options={timeRanges} className="w-[160px]" placeholder="Time Range" />
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" onChange={setActiveTab}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderMetricCard('Compliance Rate', `${mockMetrics.compliance.current}%`, mockMetrics.compliance, <CheckCircle className="h-6 w-6" />, 'success')}
              {renderMetricCard('Total Checks', mockMetrics.totalChecks.current.toLocaleString(), mockMetrics.totalChecks, <FileText className="h-6 w-6" />, 'primary')}
              {renderMetricCard('Violations', mockMetrics.violations.current.toLocaleString(), mockMetrics.violations, <AlertTriangle className="h-6 w-6" />, 'error')}
              {renderMetricCard('Avg Review Time', mockMetrics.avgReviewTime.current, { current: 2.3, previous: 3.1, trend: 'down' }, <Clock className="h-6 w-6" />, 'warning')}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Compliance Trend
                  </CardTitle>
                  <CardDescription>Daily compliance rate over selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderComplianceChart()}
                  <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <span className="flex items-center gap-1 text-success"><span className="w-3 h-3 rounded bg-success" /> Compliant</span>
                    <span className="flex items-center gap-1 text-primary"><span className="w-3 h-3 rounded bg-primary" /> Target (95%)</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Violations by Severity
                  </CardTitle>
                  <CardDescription>Daily violation count by severity level</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderViolationChart()}
                  <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-error" /> High</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning" /> Medium</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-info" /> Low</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Magic Fix Impact</CardTitle>
                  <CardDescription>Auto-correction performance this period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-success-light rounded-xl">
                      <p className="text-3xl font-bold text-success">1,247</p>
                      <p className="text-xs text-text-muted mt-1">Auto-fixes Applied</p>
                    </div>
                    <div className="p-4 bg-primary-light rounded-xl">
                      <p className="text-3xl font-bold text-primary">87%</p>
                      <p className="text-xs text-text-muted mt-1">Success Rate</p>
                    </div>
                    <div className="p-4 bg-warning-light rounded-xl">
                      <p className="text-3xl font-bold text-warning">234 hrs</p>
                      <p className="text-xs text-text-muted mt-1">Time Saved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Review Queue Health</CardTitle>
                  <CardDescription>Current review pipeline status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'Pending Review', value: 23, color: 'info' },
                      { label: 'In Progress', value: 5, color: 'warning' },
                      { label: 'Approved Today', value: 12, color: 'success' },
                      { label: 'Rejected Today', value: 2, color: 'error' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <Badge variant={item.color as any} size="sm">{item.value}</Badge>
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(item.value / 25 * 100, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rulebook Health</CardTitle>
                  <CardDescription>Active rules and coverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'Active Rules', value: 42, total: 48 },
                      { label: 'Draft Rules', value: 4, total: 48 },
                      { label: 'Archived Rules', value: 2, total: 48 },
                      { label: 'Auto-fix Enabled', value: 35, total: 42 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{item.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-text-main">{item.value}/{item.total}</span>
                          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${item.value / item.total * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Violations Tab */}
          <TabsContent value="violations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Violations by Rule</CardTitle>
                <CardDescription>Most frequently violated rules in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopRules.map((rule, i) => (
                    <div key={rule.rule} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 text-center text-sm font-medium text-text-muted">{i + 1}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <code className="font-mono text-sm text-primary">{rule.rule}</code>
                              <span className="font-medium text-text-main">{rule.name}</span>
                              <Badge variant={rule.trend === 'up' ? 'error' : rule.trend === 'down' ? 'success' : 'neutral'} size="sm">
                                {rule.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : rule.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <span className="h-3 w-3" />}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium text-error">{rule.violations} violations</span>
                          <Badge variant="success" size="sm">{rule.autoFixed} auto-fixed</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Compliance metrics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                        <th className="pb-3">Team</th>
                        <th className="pb-3 text-right">Checks</th>
                        <th className="pb-3 text-right">Compliance</th>
                        <th className="pb-3 text-right">Avg Review</th>
                        <th className="pb-3 text-right">Violations</th>
                        <th className="pb-3 text-right">Auto-fixed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {mockTeamPerformance.map((team, i) => (
                        <tr key={team.name} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                          <td className="py-3 font-medium text-text-main">{team.name}</td>
                          <td className="py-3 text-right text-text-secondary">{team.checks.toLocaleString()}</td>
                          <td className="py-3 text-right">
                            <Badge variant={team.compliance >= 95 ? 'success' : team.compliance >= 90 ? 'warning' : 'error'} size="sm">
                              {team.compliance}%
                            </Badge>
                          </td>
                          <td className="py-3 text-right text-text-secondary">{team.avgTime}</td>
                          <td className="py-3 text-right text-text-secondary">{team.violations}</td>
                          <td className="py-3 text-right text-success">~{Math.round(team.violations * 0.6)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Breakdown</CardTitle>
                <CardDescription>Compliance performance across marketing channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                        <th className="pb-3">Channel</th>
                        <th className="pb-3 text-right">Total</th>
                        <th className="pb-3 text-right">Compliant</th>
                        <th className="pb-3 text-right">Violations</th>
                        <th className="pb-3 text-right">Auto-fixed</th>
                        <th className="pb-3 text-right">Avg Score</th>
                        <th className="pb-3 text-right">Compliance %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {mockChannelData.map((channel, i) => (
                        <tr key={channel.channel} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                          <td className="py-3 font-medium text-text-main">{channel.channel}</td>
                          <td className="py-3 text-right text-text-secondary">{channel.total.toLocaleString()}</td>
                          <td className="py-3 text-right text-success">{channel.compliant.toLocaleString()}</td>
                          <td className="py-3 text-right text-error">{channel.violations}</td>
                          <td className="py-3 text-right text-primary">{channel.autoFixed}</td>
                          <td className="py-3 text-right font-medium text-text-main">{channel.avgScore}%</td>
                          <td className="py-3 text-right">
                            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-success rounded-full" style={{ width: `${channel.compliant / channel.total * 100}%` }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rule Effectiveness</CardTitle>
                <CardDescription>How each rule performs in catching violations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopRules.map((rule, i) => (
                    <div key={rule.rule} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 text-center text-sm font-medium text-text-muted">{i + 1}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <code className="font-mono text-sm text-primary">{rule.rule}</code>
                              <span className="font-medium text-text-main">{rule.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-text-secondary w-24 text-right">{rule.violations} caught</span>
                          <Badge variant="success" size="sm">{rule.autoFixed} auto-fixed</Badge>
                          <Badge variant={(rule.autoFixed / rule.violations * 100) > 80 ? 'success' : 'warning'} size="sm">
                            {(rule.autoFixed / rule.violations * 100).toFixed(0)}% auto-fix rate
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Complete history of all governance actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                        <th className="pb-3 w-32">Timestamp</th>
                        <th className="pb-3 w-24">User</th>
                        <th className="pb-3 w-28">Action</th>
                        <th className="pb-3 w-32">Resource</th>
                        <th className="pb-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {mockAuditLog.map((entry, i) => (
                        <tr key={entry.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                          <td className="py-3 text-sm text-text-muted font-mono">{entry.timestamp}</td>
                          <td className="py-3 text-sm text-text-main">{entry.user}</td>
                          <td className="py-3">
                            <Badge
                              variant={
                                entry.action === 'Approved' ? 'success' :
                                entry.action === 'Rejected' ? 'error' :
                                entry.action === 'Changes Requested' ? 'warning' :
                                entry.action === 'Submitted' ? 'info' :
                                entry.action === 'Started Review' ? 'warning' :
                                'default'
                              }
                              size="sm"
                            >
                              {entry.action}
                            </Badge>
                          </td>
                          <td className="py-3 text-sm font-mono text-primary">{entry.resource}</td>
                          <td className="py-3 text-sm text-text-secondary">{entry.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}