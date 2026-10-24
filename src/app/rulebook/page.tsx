'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';

import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';

const ruleCategories = [
  { value: 'all', label: 'All Categories' },
  { value: 'voice', label: 'Voice & Tone' },
  { value: 'terminology', label: 'Terminology' },
  { value: 'claims', label: 'Claims & Evidence' },
  { value: 'formatting', label: 'Formatting' },
  { value: 'legal', label: 'Legal & Compliance' },
  { value: 'visual', label: 'Visual Identity' },
];

interface Rule {
  id: string;
  name: string;
  category: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  status: string;
  examples: string[];
  autoFix: boolean;
  lastModified: string;
  modifiedBy: string;
}

const mockRules: Rule[] = [
  {
    id: 'BR-001',
    name: 'No Unauthorized Superlative Claims',
    category: 'claims',
    description: 'Content must not use superlative claims (e.g., "best", "#1", "leading") without verified third-party evidence.',
    severity: 'high',
    status: 'active',
    examples: ['❌ "We are the best solution" → ✅ "A top-rated solution according to G2"'],
    autoFix: true,
    lastModified: '2024-01-15',
    modifiedBy: 'Alex Morgan',
  },
  {
    id: 'BR-002',
    name: 'Brand Voice: Professional & Approachable',
    category: 'voice',
    description: 'Maintain a professional yet approachable tone. Avoid overly formal language or casual slang.',
    severity: 'medium',
    status: 'active',
    examples: ['❌ "Yo, check this out!" → ✅ "Discover our latest features"'],
    autoFix: true,
    lastModified: '2024-01-10',
    modifiedBy: 'Sarah Chen',
  },
  {
    id: 'BR-003',
    name: 'Prohibited Competitor References',
    category: 'legal',
    description: 'Direct competitor comparisons or naming competitors is prohibited unless approved by Legal.',
    severity: 'high',
    status: 'active',
    examples: ['❌ "Better than CompetitorX" → ✅ "Outperforms alternatives"'],
    autoFix: false,
    lastModified: '2024-01-08',
    modifiedBy: 'Legal Team',
  },
  {
    id: 'BR-004',
    name: 'Required Trademark Symbols',
    category: 'formatting',
    description: 'Brand names must include appropriate trademark symbols (™, ®) on first use in each content piece.',
    severity: 'medium',
    status: 'active',
    examples: ['❌ "Florén helps" → ✅ "Florén™ helps"'],
    autoFix: true,
    lastModified: '2024-01-05',
    modifiedBy: 'Alex Morgan',
  },
  {
    id: 'BR-005',
    name: 'Inclusive Language Standards',
    category: 'voice',
    description: 'Use inclusive, bias-free language. Avoid gendered terms when neutral alternatives exist.',
    severity: 'medium',
    status: 'active',
    examples: ['❌ "guys" → ✅ "team/everyone", ❌ "master/slave" → ✅ "primary/secondary"'],
    autoFix: true,
    lastModified: '2024-01-12',
    modifiedBy: 'DEI Council',
  },
  {
    id: 'BR-006',
    name: 'Approved Product Terminology',
    category: 'terminology',
    description: 'Use only approved product names and feature terminology. Refer to the Product Glossary.',
    severity: 'high',
    status: 'active',
    examples: ['❌ "dashboard thing" → ✅ "Command Center"'],
    autoFix: true,
    lastModified: '2024-01-03',
    modifiedBy: 'Product Marketing',
  },
  {
    id: 'BR-007',
    name: 'Missing Trademark Symbols',
    category: 'formatting',
    description: 'All registered trademarks must display ® symbol. Unregistered marks use ™.',
    severity: 'medium',
    status: 'active',
    examples: ['❌ "Aurevia Global" → ✅ "Aurevia Global®"'],
    autoFix: true,
    lastModified: '2024-01-14',
    modifiedBy: 'Brand Team',
  },
  {
    id: 'BR-008',
    name: 'Evidence Required for Performance Claims',
    category: 'claims',
    description: 'Any performance, speed, or efficiency claims must cite verifiable benchmarks or studies.',
    severity: 'high',
    status: 'active',
    examples: ['❌ "10x faster" → ✅ "10x faster (per internal benchmark v3.2)"'],
    autoFix: false,
    lastModified: '2024-01-11',
    modifiedBy: 'Legal Team',
  },
  {
    id: 'BR-009',
    name: 'Color Palette Compliance',
    category: 'visual',
    description: 'Only approved brand colors may be used. Hex values must match the brand guidelines exactly.',
    severity: 'low',
    status: 'draft',
    examples: ['❌ #4F46E6 → ✅ #4F46E5'],
    autoFix: true,
    lastModified: '2024-01-16',
    modifiedBy: 'Design Team',
  },
  {
    id: 'BR-010',
    name: 'Logo Clear Space Requirements',
    category: 'visual',
    description: 'Maintain minimum clear space around logo equal to the height of the "F" in Florén.',
    severity: 'low',
    status: 'active',
    examples: ['Visual reference required'],
    autoFix: false,
    lastModified: '2024-01-02',
    modifiedBy: 'Design Team',
  },
];

export default function RulebookPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'asc' });
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newRuleModalOpen, setNewRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const { success, error } = useToast();

  const filteredRules = mockRules.filter((rule) => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || rule.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedRules = [...filteredRules].sort((a, b) => {
    if (!sortConfig) return 0;
    const aVal = a[sortConfig.key as keyof typeof a];
    const bVal = b[sortConfig.key as keyof typeof b];
    if (aVal === bVal) return 0;
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    return aVal > bVal ? direction : -direction;
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleEdit = (rule: typeof mockRules[0]) => {
    setEditingRule(rule);
    setEditModalOpen(true);
  };

  const handleDelete = (rule: typeof mockRules[0]) => {
    setSelectedRule(rule);
    setDeleteModalOpen(true);
  };

  const handleSave = () => {
    if (editingRule) {
      success('Rule updated', `${editingRule.name} has been saved.`);
    } else {
      success('Rule created', 'New rule has been added.');
    }
    setEditModalOpen(false);
    setEditingRule(null);
  };

  const handleConfirmDelete = () => {
    if (selectedRule) {
      success('Rule deleted', `${selectedRule.name} has been removed.`);
    }
    setDeleteModalOpen(false);
    setSelectedRule(null);
  };

  const columns: Column<Rule>[] = [
    {
      key: 'id',
      header: 'Rule ID',
      width: '100px',
      sortable: true,
      render: (row: Rule) => <code className="font-mono text-sm text-primary">{row.id}</code>,
    },
    {
      key: 'name',
      header: 'Rule Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-text-main">{row.name}</p>
          <p className="text-sm text-text-muted truncate-2 mt-0.5">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: '140px',
      sortable: true,
      render: (row: Rule) => {
        const category = ruleCategories.find(c => c.value === row.category);
        return <Badge variant="default" size="sm">{category?.label || row.category}</Badge>;
      },
    },
    {
      key: 'severity',
      header: 'Severity',
      width: '100px',
      sortable: true,
      render: (row: Rule) => {
        const variants: Record<'high' | 'medium' | 'low', 'error' | 'warning' | 'info'> = { high: 'error', medium: 'warning', low: 'info' };
        return <Badge variant={variants[row.severity]} size="sm">{row.severity.charAt(0).toUpperCase() + row.severity.slice(1)}</Badge>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      sortable: true,
      render: (row: Rule) => {
        const variants: Record<string, 'success' | 'warning' | 'neutral'> = { active: 'success', draft: 'warning', archived: 'neutral' };
        return <Badge variant={variants[row.status]} size="sm" dot>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</Badge>;
      },
    },
    {
      key: 'autoFix',
      header: 'Auto-Fix',
      width: '90px',
      align: 'center',
      render: (row: Rule) => (
        <Badge variant={row.autoFix ? 'success' : 'neutral'} size="sm" dot>
          {row.autoFix ? 'Enabled' : 'Manual'}
        </Badge>
      ),
    },
    {
      key: 'lastModified',
      header: 'Modified',
      width: '130px',
      sortable: true,
      align: 'right',
      render: (row: Rule) => <span className="text-text-muted">{row.lastModified}</span>,
    },
    {
      key: 'actions',
      header: '',
      width: '100px',
      render: (row: Rule) => (
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded hover:bg-light-blue-surface transition-colors text-text-muted hover:text-text-main"
            aria-label={`Edit ${row.name}`}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded hover:bg-error-light text-error hover:text-error transition-colors"
            aria-label={`Delete ${row.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const ruleDetailTabs = [
    { value: 'details', label: 'Details' },
    { value: 'examples', label: 'Examples' },
    { value: 'history', label: 'History' },
    { value: 'testing', label: 'Test Rule' },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Brand Rulebook</h1>
            <p className="mt-1 text-sm text-text-muted">Manage brand compliance rules — v2.4</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode('table')}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewMode('cards')}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </Button>
            <Button onClick={() => { setEditingRule(null); setEditModalOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              New Rule
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card variant="outlined" padding="md">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
              options={ruleCategories}
              className="w-[180px]"
              placeholder="All Categories"
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
                { value: 'archived', label: 'Archived' },
              ]}
              className="w-[160px]"
              placeholder="All Statuses"
            />
            <Button variant="outline" onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); }}>
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Clear
            </Button>
          </div>
        </Card>

        {/* Rule List */}
        {viewMode === 'table' ? (
          <Card>
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={sortedRules}
                keyField="id"
                pagination
                pageSize={10}
                striped
                hoverable
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedRules.map((rule) => (
              <Card key={rule.id} variant="outlined" className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="font-mono text-sm text-primary">{rule.id}</code>
                        <Badge variant="default" size="sm">{ruleCategories.find(c => c.value === rule.category)?.label}</Badge>
                      </div>
                      <h3 className="font-semibold text-text-main mb-1">{rule.name}</h3>
                      <p className="text-sm text-text-muted mb-3 line-clamp-2">{rule.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <Badge variant={({ high: 'error', medium: 'warning', low: 'info' } as const)[rule.severity]} size="sm">{rule.severity}</Badge>
                        <Badge variant={({ active: 'success', draft: 'warning', archived: 'neutral' } as const)[rule.status]} size="sm" dot>{rule.status}</Badge>
                        <Badge variant={rule.autoFix ? 'success' : 'neutral'} size="sm" dot>{rule.autoFix ? 'Auto-fix' : 'Manual'}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => handleEdit(rule)} className="p-1.5 rounded hover:bg-light-blue-surface transition-colors text-text-muted" aria-label="Edit"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(rule)} className="p-1.5 rounded hover:bg-error-light text-error transition-colors" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Rule Detail Modal */}
        {selectedRule && (
          <Modal
            open={true}
            onClose={() => setSelectedRule(null)}
            title={selectedRule.name}
            size="xl"
          >
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                {ruleDetailTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="details" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Rule ID</label>
                    <code className="font-mono text-sm text-text-main">{selectedRule.id}</code>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Category</label>
                    <Badge variant="default">{ruleCategories.find(c => c.value === selectedRule.category)?.label}</Badge>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Severity</label>
                    <Badge variant={({ high: 'error', medium: 'warning', low: 'info' } as const)[selectedRule.severity]} dot>{selectedRule.severity}</Badge>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Status</label>
                    <Badge variant={({ active: 'success', draft: 'warning', archived: 'neutral' } as const)[selectedRule.status]} dot>{selectedRule.status}</Badge>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Auto-Fix</label>
                    <Badge variant={selectedRule.autoFix ? 'success' : 'neutral'} dot>{selectedRule.autoFix ? 'Enabled' : 'Manual'}</Badge>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Last Modified</label>
                    <span className="text-sm text-text-secondary">{selectedRule.lastModified} by {selectedRule.modifiedBy}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
                  <p className="text-text-secondary">{selectedRule.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="mt-6 space-y-4">
                <h4 className="font-medium text-text-main">Examples</h4>
                {selectedRule.examples.map((ex, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <code className="text-sm text-text-main block whitespace-pre-wrap">{ex}</code>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <DataTable
                  columns={[
                    { key: 'date', header: 'Date', width: '120px' },
                    { key: 'user', header: 'Modified By', width: '140px' },
                    { key: 'changes', header: 'Changes' },
                  ]}
                  data={[
                    { date: '2024-01-15', user: 'Alex Morgan', changes: 'Updated severity to high, enabled auto-fix' },
                    { date: '2024-01-10', user: 'Sarah Chen', changes: 'Refined description and examples' },
                    { date: '2024-01-05', user: 'Legal Team', changes: 'Added legal review requirement' },
                  ]}
                  keyField="date"
                  pagination={false}
                  striped
                />
              </TabsContent>

              <TabsContent value="testing" className="mt-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-text-main">Test Content</label>
                  <textarea
                    className="w-full min-h-[120px] p-3 border border-border rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Paste content to test against this rule..."
                  />
                  <Button variant="primary" className="w-full sm:w-auto">
                    <Shield className="h-4 w-4 mr-2" />
                    Test Rule
                  </Button>
                  <div className="p-4 bg-success-light rounded-lg border border-success/20">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Rule passed</span>
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">No violations detected in test content.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Modal>
        )}

        {/* Edit/Create Rule Modal */}
        <Modal
          open={editModalOpen}
          onClose={() => { setEditModalOpen(false); setEditingRule(null); }}
          title={editingRule ? `Edit Rule: ${editingRule.name}` : 'Create New Rule'}
          size="lg"
        >
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Rule ID" value={editingRule?.id || ''} disabled={!!editingRule} placeholder="BR-011" />
              <Select
                label="Category"
                value={editingRule?.category || 'voice'}
                onValueChange={(v) => setEditingRule({ ...(editingRule || { id: '', name: '', category: '', description: '', severity: 'medium', status: 'draft', examples: [], autoFix: false, lastModified: '', modifiedBy: '' }), category: v })}
                options={ruleCategories.filter(c => c.value !== 'all')}
              />
            </div>
            <Input label="Rule Name" value={editingRule?.name || ''} onChange={(e) => setEditingRule({ ...(editingRule || { id: '', name: '', category: '', description: '', severity: 'medium', status: 'draft', examples: [], autoFix: false, lastModified: '', modifiedBy: '' }), name: e.target.value })} placeholder="Enter rule name" />
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Description</label>
              <textarea
                className="w-full min-h-[80px] p-3 border border-border rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                value={editingRule?.description || ''}
                onChange={(e) => setEditingRule({ ...(editingRule || { id: '', name: '', category: '', description: '', severity: 'medium', status: 'draft', examples: [], autoFix: false, lastModified: '', modifiedBy: '' }), description: e.target.value })}
                placeholder="Describe the rule..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Severity"
                value={editingRule?.severity || 'medium'}
                onValueChange={(v) => setEditingRule({ ...(editingRule || { id: '', name: '', category: '', description: '', severity: 'medium', status: 'draft', examples: [], autoFix: false, lastModified: '', modifiedBy: '' }), severity: v as 'high' | 'medium' | 'low' })}
                options={[
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' },
                ]}
              />
              <Select
                label="Status"
                value={editingRule?.status || 'draft'}
                onValueChange={(v) => setEditingRule({ ...(editingRule || { id: '', name: '', category: '', description: '', severity: 'medium', status: 'draft', examples: [], autoFix: false, lastModified: '', modifiedBy: '' }), status: v as 'active' | 'draft' | 'archived' })}
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'active', label: 'Active' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
              <Select
                label="Auto-Fix"
                value={editingRule?.autoFix ? 'true' : 'false'}
                onValueChange={(v) => setEditingRule({ ...(editingRule || { id: '', name: '', category: '', description: '', severity: 'medium', status: 'draft', examples: [], autoFix: false, lastModified: '', modifiedBy: '' }), autoFix: v === 'true' })}
                options={[
                  { value: 'true', label: 'Enabled' },
                  { value: 'false', label: 'Manual Only' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Examples (one per line)</label>
              <textarea
                className="w-full min-h-[80px] p-3 border border-border rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                value={editingRule?.examples.join('\n') || ''}
                onChange={(e) => setEditingRule({ ...(editingRule || { id: '', name: '', category: '', description: '', severity: 'medium', status: 'draft', examples: [], autoFix: false, lastModified: '', modifiedBy: '' }), examples: e.target.value.split('\n').filter(Boolean) })}
                placeholder="❌ Bad example → ✅ Good example"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="secondary" onClick={() => { setEditModalOpen(false); setEditingRule(null); }}>Cancel</Button>
              <Button type="submit" loading={false}>{editingRule ? 'Save Changes' : 'Create Rule'}</Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          open={deleteModalOpen}
          onClose={() => { setDeleteModalOpen(false); setSelectedRule(null); }}
          onConfirm={handleConfirmDelete}
          title="Delete Rule"
          message={selectedRule ? `Are you sure you want to delete "${selectedRule.name}" (${selectedRule.id})? This action cannot be undone.` : ''}
          variant="danger"
          confirmLabel="Delete"
        />
      </div>
    </AppShell>
  );
}