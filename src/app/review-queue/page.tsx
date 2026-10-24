'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';

import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import {
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  MessageSquare,
  FileText,
  User,
  Shield,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Download,
} from 'lucide-react';

const mockSubmissions = [
  {
    id: 'SUB-2024-001',
    title: 'Q4 Campaign Launch Email',
    type: 'email',
    author: 'Sarah Chen',
    department: 'Marketing',
    submittedAt: '2024-01-15 09:30',
    status: 'pending',
    priority: 'high',
    score: 72,
    violations: 5,
    autoFixable: 3,
    content: 'Subject: Introducing the best solution for your business...',
  },
  {
    id: 'SUB-2024-002',
    title: 'Product Landing Page Copy',
    type: 'web',
    author: 'Mike Johnson',
    department: 'Product Marketing',
    submittedAt: '2024-01-15 11:15',
    status: 'in_review',
    priority: 'high',
    score: 68,
    violations: 7,
    autoFixable: 4,
    content: 'The #1 platform that revolutionizes your workflow...',
    reviewer: 'Alex Morgan',
    reviewStartedAt: '2024-01-15 11:45',
  },
  {
    id: 'SUB-2024-003',
    title: 'Social Media Campaign Bundle',
    type: 'social',
    author: 'Emma Wilson',
    department: 'Social Media',
    submittedAt: '2024-01-15 13:22',
    status: 'pending',
    priority: 'medium',
    score: 81,
    violations: 2,
    autoFixable: 2,
    content: 'Super excited to announce our new features! Guys, this is awesome...',
  },
  {
    id: 'SUB-2024-004',
    title: 'Press Release: Series B Funding',
    type: 'press',
    author: 'David Park',
    department: 'Communications',
    submittedAt: '2024-01-14 16:45',
    status: 'approved',
    priority: 'high',
    score: 94,
    violations: 1,
    autoFixable: 1,
    content: 'Aurevia Global announces $50M Series B led by TopVC...',
    reviewer: 'Alex Morgan',
    reviewedAt: '2024-01-15 08:30',
    decision: 'Approved with minor fixes applied',
  },
  {
    id: 'SUB-2024-005',
    title: 'Blog: AI in Modern Marketing',
    type: 'blog',
    author: 'Lisa Anderson',
    department: 'Content',
    submittedAt: '2024-01-14 10:00',
    status: 'rejected',
    priority: 'medium',
    score: 58,
    violations: 12,
    autoFixable: 6,
    content: 'AI is literally the best thing ever for marketers...',
    reviewer: 'Alex Morgan',
    reviewedAt: '2024-01-14 14:20',
    decision: 'Rejected — multiple superlative claims, missing evidence',
  },
  {
    id: 'SUB-2024-006',
    title: 'Ad Copy: Holiday Campaign',
    type: 'ads',
    author: 'James Miller',
    department: 'Paid Media',
    submittedAt: '2024-01-13 14:30',
    status: 'approved',
    priority: 'low',
    score: 97,
    violations: 0,
    autoFixable: 0,
    content: 'Celebrate the season with Florén™ — trusted by 5000+ teams.',
    reviewer: 'Sarah Chen',
    reviewedAt: '2024-01-13 15:00',
    decision: 'Approved',
  },
  {
    id: 'SUB-2024-007',
    title: 'Internal Newsletter',
    type: 'email',
    author: 'Rachel Kim',
    department: 'HR',
    submittedAt: '2024-01-13 09:00',
    status: 'changes_requested',
    priority: 'low',
    score: 75,
    violations: 4,
    autoFixable: 2,
    content: 'Hey team! Just wanted to share some updates...',
    reviewer: 'Alex Morgan',
    reviewedAt: '2024-01-13 11:00',
    decision: 'Changes requested — tone too casual, missing trademark symbols',
  },
];

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_review', label: 'In Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'changes_requested', label: 'Changes Requested' },
];

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'email', label: 'Email' },
  { value: 'web', label: 'Web' },
  { value: 'social', label: 'Social' },
  { value: 'press', label: 'Press' },
  { value: 'blog', label: 'Blog' },
  { value: 'ads', label: 'Ads' },
];

export default function ReviewQueuePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<'approve' | 'reject' | 'changes'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');
  const { success, info } = useToast();

  const filteredSubmissions = mockSubmissions.filter((sub) => {
    const matchesSearch = sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || sub.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || sub.type === typeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Pending', variant: 'info' as const, icon: <Clock className="h-3 w-3" /> };
      case 'in_review': return { label: 'In Review', variant: 'warning' as const, icon: <Eye className="h-3 w-3" /> };
      case 'approved': return { label: 'Approved', variant: 'success' as const, icon: <CheckCircle className="h-3 w-3" /> };
      case 'rejected': return { label: 'Rejected', variant: 'error' as const, icon: <XCircle className="h-3 w-3" /> };
      case 'changes_requested': return { label: 'Changes Requested', variant: 'warning' as const, icon: <AlertTriangle className="h-3 w-3" /> };
      default: return { label: status, variant: 'neutral' as const, icon: <Clock className="h-3 w-3" /> };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high': return { label: 'High', variant: 'error' as const };
      case 'medium': return { label: 'Medium', variant: 'warning' as const };
      case 'low': return { label: 'Low', variant: 'info' as const };
      default: return { label: priority, variant: 'neutral' as const };
    }
  };

  interface Submission {
  id: string;
  title: string;
  type: string;
  author: string;
  department: string;
  submittedAt: string;
  status: string;
  priority: string;
  score: number;
  violations: number;
  autoFixable: number;
  content: string;
  reviewer?: string;
  reviewStartedAt?: string;
  reviewedAt?: string;
  decision?: string;
}

const columns: Column<Submission>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '130px',
      render: (row: Submission) => <code className="font-mono text-sm text-primary">{row.id}</code>,
    },
    {
      key: 'title',
      header: 'Title',
      render: (row: Submission) => (
        <div>
          <p className="font-medium text-text-main">{row.title}</p>
          <p className="text-xs text-text-muted truncate">{row.content}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      width: '100px',
      render: (row: Submission) => <Badge variant="default" size="sm">{row.type.charAt(0).toUpperCase() + row.type.slice(1)}</Badge>,
    },
    {
      key: 'author',
      header: 'Author',
      width: '140px',
      render: (row: Submission) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-light text-primary text-xs font-medium flex items-center justify-center">
            {row.author.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-sm text-text-main">{row.author}</span>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      width: '140px',
      render: (row: Submission) => <span className="text-sm text-text-secondary">{row.department}</span>,
    },
    {
      key: 'score',
      header: 'Score',
      width: '80px',
      align: 'center',
      render: (row: Submission) => (
        <Badge variant={row.score >= 90 ? 'success' : row.score >= 75 ? 'warning' : 'error'} size="sm">
          {row.score}%
        </Badge>
      ),
    },
    {
      key: 'violations',
      header: 'Issues',
      width: '80px',
      align: 'center',
      render: (row: Submission) => (
        <span className="text-sm font-medium text-text-main">{row.violations}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '140px',
      render: (row: Submission) => {
        const config = getStatusConfig(row.status);
        return (
          <Badge variant={config.variant} size="sm" dot>
            {config.icon} {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '100px',
      render: (row: Submission) => {
        const config = getPriorityConfig(row.priority);
        return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
      },
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      width: '140px',
      render: (row: Submission) => <span className="text-sm text-text-muted">{row.submittedAt}</span>,
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => { setSelectedSubmission(row); setReviewModalOpen(true); }}
            className="p-1.5 rounded hover:bg-light-blue-surface transition-colors text-text-muted"
            aria-label={`Review ${row.title}`}
          >
            <Eye className="h-4 w-4" />
          </button>
          {row.status === 'pending' && (
            <button
              onClick={() => info('Claimed', `You claimed ${row.title}`)}
              className="p-1.5 rounded hover:bg-light-blue-surface transition-colors text-text-muted"
              aria-label={`Claim ${row.title}`}
            >
              <Shield className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleReviewSubmit = () => {
    if (selectedSubmission) {
      const actionLabels = { approve: 'Approved', reject: 'Rejected', changes: 'Changes Requested' };
      success(`${actionLabels[reviewDecision]}`, `${selectedSubmission.title} has been ${reviewDecision}d.`);
      setReviewModalOpen(false);
      setSelectedSubmission(null);
      setReviewNotes('');
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <Inbox className="h-6 w-6" />
              Review Queue
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              {filteredSubmissions.filter(s => s.status === 'pending').length} pending •
              {filteredSubmissions.filter(s => s.status === 'in_review').length} in review •
              {filteredSubmissions.filter(s => s.status === 'approved').length} approved
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <Card variant="outlined" padding="md">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter} options={statusOptions} className="w-[160px]" placeholder="All Statuses" />
            <Select value={priorityFilter} onValueChange={setPriorityFilter} options={priorityOptions} className="w-[140px]" placeholder="All Priorities" />
            <Select value={typeFilter} onValueChange={setTypeFilter} options={typeOptions} className="w-[140px]" placeholder="All Types" />
            <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setPriorityFilter('all'); setTypeFilter('all'); }}>
              Clear
            </Button>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted">Pending Review</p>
                  <p className="text-3xl font-bold text-text-main mt-1">{mockSubmissions.filter(s => s.status === 'pending').length}</p>
                </div>
                <div className="p-3 bg-info-light rounded-xl">
                  <Inbox className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted">In Progress</p>
                  <p className="text-3xl font-bold text-text-main mt-1">{mockSubmissions.filter(s => s.status === 'in_review').length}</p>
                </div>
                <div className="p-3 bg-warning-light rounded-xl">
                  <Eye className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted">Avg. Review Time</p>
                  <p className="text-3xl font-bold text-text-main mt-1">2.3 hrs</p>
                </div>
                <div className="p-3 bg-primary-light rounded-xl">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted">Approval Rate</p>
                  <p className="text-3xl font-bold text-text-main mt-1">87%</p>
                </div>
                <div className="p-3 bg-success-light rounded-xl">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={filteredSubmissions}
              keyField="id"
              pagination
              pageSize={10}
              striped
              hoverable
              rowClassName={(row) => row.status === 'in_review' && row.reviewer === 'Alex Morgan' ? 'bg-primary-light/20' : ''}
            />
          </CardContent>
        </Card>
      </div>

      {/* Review Modal */}
      {selectedSubmission && reviewModalOpen && (
        <Modal
          open={true}
          onClose={() => { setReviewModalOpen(false); setSelectedSubmission(null); setReviewNotes(''); }}
          title={`Review: ${selectedSubmission.title}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Submission Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Submission ID</label>
                <code className="font-mono text-sm text-primary">{selectedSubmission.id}</code>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Type</label>
                <Badge variant="default">{selectedSubmission.type}</Badge>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Author</label>
                <span className="text-sm text-text-main">{selectedSubmission.author}</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Department</label>
                <span className="text-sm text-text-secondary">{selectedSubmission.department}</span>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-text-muted mb-1">Submitted</label>
                <span className="text-sm text-text-secondary">{selectedSubmission.submittedAt}</span>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-text-muted mb-1">Compliance Score</label>
                <Badge variant={selectedSubmission.score >= 90 ? 'success' : selectedSubmission.score >= 75 ? 'warning' : 'error'} size="lg">
                  {selectedSubmission.score}%
                </Badge>
              </div>
            </div>

            {/* Content Preview */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Content Preview</label>
              <div className="p-4 bg-gray-50 rounded-lg border border-border max-h-64 overflow-y-auto">
                <pre className="text-sm text-text-main font-mono whitespace-pre-wrap">{selectedSubmission.content}</pre>
              </div>
            </div>

            {/* Violations Summary */}
            <div className="p-4 bg-warning-light border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span className="font-medium text-text-main">{selectedSubmission.violations} violations detected</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span>{selectedSubmission.autoFixable} auto-fixable</span>
                <span>{selectedSubmission.violations - selectedSubmission.autoFixable} require manual review</span>
              </div>
              <Button variant="outline" size="sm" className="mt-3">
                <FileText className="h-4 w-4 mr-2" />
                View Full Report
              </Button>
            </div>

            {/* Review Action */}
            <div className="pt-4 border-t border-border">
              <label className="block text-sm font-medium text-text-main mb-3">Review Decision</label>
              <div className="flex gap-3 mb-4">
                {(['approve', 'changes', 'reject'] as const).map((decision) => {
                  const configs = {
                    approve: { label: 'Approve', variant: 'success' as const, icon: CheckCircle, desc: 'Content meets all brand standards' },
                    changes: { label: 'Request Changes', variant: 'warning' as const, icon: AlertTriangle, desc: 'Minor fixes needed before approval' },
                    reject: { label: 'Reject', variant: 'error' as const, icon: XCircle, desc: 'Significant violations require rewrite' },
                  };
                  const config = configs[decision];
                  const Icon = config.icon;
                  return (
                    <button
                      key={decision}
                      onClick={() => setReviewDecision(decision)}
                      className={cn(
                        'flex-1 p-4 rounded-lg border-2 transition-all text-left',
                        reviewDecision === decision
                          ? `border-${config.variant} bg-${config.variant}-light`
                          : 'border-border hover:border-text-muted'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn('h-5 w-5', reviewDecision === decision ? `text-${config.variant}` : 'text-text-muted')} />
                        <div>
                          <p className="font-medium text-text-main">{config.label}</p>
                          <p className="text-xs text-text-muted">{config.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Review Notes (optional)</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-border rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add notes for the author..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="secondary" onClick={() => { setReviewModalOpen(false); setSelectedSubmission(null); setReviewNotes(''); }}>
                  Cancel
                </Button>
                <Button
                  variant={reviewDecision === 'reject' ? 'destructive' : reviewDecision === 'changes' ? 'secondary' : 'primary'}
                  onClick={handleReviewSubmit}
                >
                  {reviewDecision.charAt(0).toUpperCase() + reviewDecision.slice(1)} Submission
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </AppShell>
  );
}

// Need to import Search icon
import { Search } from 'lucide-react';