'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';

import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  Copy,
  Download,
  Settings,
  History,
  Sparkles,
  Wand2,
  RefreshCw,
  FileText,
  Clock,
  Shield,
} from 'lucide-react';

const mockMagicFixJobs = [
  {
    id: 'MF-2024-001',
    title: 'Q4 Campaign Assets',
    type: 'marketing',
    status: 'completed',
    originalScore: 72,
    fixedScore: 96,
    fixesApplied: 12,
    timeSaved: '45 min',
    createdAt: '2024-01-15 10:30',
    completedAt: '2024-01-15 10:32',
    violations: [
      { ruleId: 'BR-001', original: 'best solution', fixed: 'leading solution', autoFixed: true },
      { ruleId: 'BR-004', original: 'Florén', fixed: 'Florén™', autoFixed: true },
      { ruleId: 'BR-002', original: 'super awesome', fixed: 'excellent', autoFixed: true },
      { ruleId: 'BR-008', original: '10x faster', fixed: '10x faster (per benchmark v3.2)', autoFixed: false },
    ],
  },
  {
    id: 'MF-2024-002',
    title: 'Product Launch Email',
    type: 'email',
    status: 'completed',
    originalScore: 68,
    fixedScore: 94,
    fixesApplied: 8,
    timeSaved: '32 min',
    createdAt: '2024-01-14 14:22',
    completedAt: '2024-01-14 14:24',
    violations: [
      { ruleId: 'BR-001', original: '#1 platform', fixed: 'top-rated platform', autoFixed: true },
      { ruleId: 'BR-003', original: 'better than CompetitorX', fixed: 'outperforms alternatives', autoFixed: false },
      { ruleId: 'BR-004', original: 'Aurevia', fixed: 'Aurevia®', autoFixed: true },
    ],
  },
  {
    id: 'MF-2024-003',
    title: 'Social Media Posts Batch',
    type: 'social',
    status: 'processing',
    originalScore: 78,
    fixedScore: null,
    fixesApplied: 0,
    timeSaved: '0 min',
    createdAt: '2024-01-15 15:45',
    completedAt: null,
    violations: [],
  },
  {
    id: 'MF-2024-004',
    title: 'Blog Article: AI in Marketing',
    type: 'blog',
    status: 'review',
    originalScore: 81,
    fixedScore: 95,
    fixesApplied: 5,
    timeSaved: '28 min',
    createdAt: '2024-01-13 09:15',
    completedAt: '2024-01-13 09:17',
    violations: [
      { ruleId: 'BR-002', original: 'really great', fixed: 'highly effective', autoFixed: true },
      { ruleId: 'BR-005', original: 'guys', fixed: 'team', autoFixed: true },
      { ruleId: 'BR-004', original: 'Florén', fixed: 'Florén™', autoFixed: true },
    ],
  },
  {
    id: 'MF-2024-005',
    title: 'Press Release: Series B',
    type: 'press',
    status: 'completed',
    originalScore: 75,
    fixedScore: 97,
    fixesApplied: 9,
    timeSaved: '38 min',
    createdAt: '2024-01-12 11:00',
    completedAt: '2024-01-12 11:02',
    violations: [
      { ruleId: 'BR-001', original: 'revolutionary', fixed: 'innovative', autoFixed: true },
      { ruleId: 'BR-008', original: '50% improvement', fixed: '50% improvement (per internal study)', autoFixed: false },
      { ruleId: 'BR-004', original: 'Aurevia Global', fixed: 'Aurevia Global®', autoFixed: true },
    ],
  },
];

const mockCurrentJob = {
  id: 'MF-2024-006',
  title: 'Landing Page Copy - New Feature',
  type: 'web',
  content: `Introducing the all-new Command Center — the best dashboard for brand management. Our revolutionary AI-powered features will supercharge your workflow. With 10x faster processing, you'll never miss a violation. Florén helps teams stay compliant effortlessly.`,
  originalScore: 65,
  violations: [
    { id: 'v1', ruleId: 'BR-001', ruleName: 'No Unauthorized Superlative Claims', severity: 'high', original: 'the best dashboard', suggested: 'a leading dashboard', autoFixed: true, applied: false, rejected: false },
    { id: 'v2', ruleId: 'BR-008', ruleName: 'Evidence Required for Performance Claims', severity: 'high', original: '10x faster processing', suggested: '10x faster processing (per benchmark v3.2)', autoFixed: false, applied: false, rejected: false },
    { id: 'v3', ruleId: 'BR-001', ruleName: 'No Unauthorized Superlative Claims', severity: 'high', original: 'revolutionary', suggested: 'innovative', autoFixed: true, applied: false, rejected: false },
    { id: 'v4', ruleId: 'BR-002', ruleName: 'Brand Voice: Professional & Approachable', severity: 'medium', original: 'supercharge', suggested: 'accelerate', autoFixed: true, applied: false, rejected: false },
    { id: 'v5', ruleId: 'BR-004', ruleName: 'Required Trademark Symbols', severity: 'medium', original: 'Florén', suggested: 'Florén™', autoFixed: true, applied: false, rejected: false },
  ],
};

export default function MagicFixPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'new'>('history');
  const [selectedJob, setSelectedJob] = useState<typeof mockMagicFixJobs[0] | null>(null);
  const [currentJob, setCurrentJob] = useState(mockCurrentJob);
  const [processing, setProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { success, info } = useToast();

  const handleApplyAllFixes = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const updatedJob = {
      ...currentJob,
      violations: currentJob.violations.map(v => ({ ...v, applied: v.autoFixed })),
      originalScore: 92,
    };
    setCurrentJob(updatedJob);
    setProcessing(false);
    success('Magic Fix applied', `${currentJob.violations.filter(v => v.autoFixed).length} auto-fixes applied.`);
  };

  const handleApplyFix = (violationId: string) => {
    setCurrentJob(prev => ({
      ...prev,
      violations: prev.violations.map(v =>
        v.id === violationId ? { ...v, applied: true } : v
      ),
    }));
    info('Fix applied', 'Individual fix applied successfully.');
  };

  const handleRejectFix = (violationId: string) => {
    setCurrentJob(prev => ({
      ...prev,
      violations: prev.violations.map(v =>
        v.id === violationId ? { ...v, applied: false, rejected: true } : v
      ),
    }));
    info('Fix rejected', 'Fix rejected — original text preserved.');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': return { label: 'Completed', variant: 'success' as const, icon: <CheckCircle className="h-3 w-3" /> };
      case 'processing': return { label: 'Processing...', variant: 'info' as const, icon: <Loader2 className="h-3 w-3 animate-spin" /> };
      case 'review': return { label: 'Needs Review', variant: 'warning' as const, icon: <AlertTriangle className="h-3 w-3" /> };
      case 'failed': return { label: 'Failed', variant: 'error' as const, icon: <XCircle className="h-3 w-3" /> };
      default: return { label: status, variant: 'neutral' as const, icon: <Clock className="h-3 w-3" /> };
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <Wand2 className="h-6 w-6 text-primary" />
              Magic Fix
            </h1>
            <p className="mt-1 text-sm text-text-muted">AI-powered automatic brand compliance corrections</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Fix Settings
            </Button>
            <Button onClick={() => setActiveTab('new')}>
              <Sparkles className="h-4 w-4 mr-2" />
              New Magic Fix
            </Button>
          </div>
        </div>

        <Tabs defaultValue="history" onChange={(value: string) => setActiveTab(value as 'history' | 'new')}>
          <TabsList>
            <TabsTrigger value="history">Fix History ({mockMagicFixJobs.length})</TabsTrigger>
            <TabsTrigger value="new">New Magic Fix</TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockMagicFixJobs.map((job) => {
                const config = getStatusConfig(job.status);
                return (
                  <Card key={job.id} variant="outlined" className="hover:shadow-md transition-shadow" onClick={() => setSelectedJob(job)}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="font-mono text-sm text-primary">{job.id}</code>
                            <Badge variant={config.variant} size="sm">{config.icon} {config.label}</Badge>
                          </div>
                          <h3 className="font-semibold text-text-main truncate">{job.title}</h3>
                          <p className="text-xs text-text-muted mt-0.5">{job.type.charAt(0).toUpperCase() + job.type.slice(1)} • {job.createdAt}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-text-muted flex-shrink-0" />
                      </div>

                      {job.status === 'completed' || job.status === 'review' ? (
                        <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-error">{job.originalScore}%</p>
                            <p className="text-xs text-text-muted">Before</p>
                          </div>
                          <div className="text-center">
                            <ArrowRight className="h-5 w-5 mx-auto text-primary" />
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-success">{job.fixedScore}%</p>
                            <p className="text-xs text-text-muted">After</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-3 text-text-muted">
                          <Loader2 className="h-6 w-6 mx-auto animate-spin mb-2" />
                          <p>Processing...</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-text-muted">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {job.fixesApplied} fixes
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.timeSaved} saved
                          </span>
                        </div>
                        <Badge variant="default" size="sm">View Details</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* New Magic Fix Tab */}
          <TabsContent value="new" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Panel */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content to Fix
                  </CardTitle>
                  <CardDescription>Paste content and apply AI-powered corrections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={currentJob.content}
                    onChange={(e) => setCurrentJob({ ...currentJob, content: e.target.value })}
                    className="w-full min-h-[250px] p-4 border border-border rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm leading-relaxed resize-y"
                    placeholder="Paste content to auto-fix..."
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <span>{currentJob.content.length} characters</span>
                      <span>{currentJob.content.split(/\s+/).filter(Boolean).length} words</span>
                      <Badge variant="default" size="sm">
                        <Shield className="h-3 w-3 mr-1" />
                        Score: {currentJob.originalScore}%
                      </Badge>
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleApplyAllFixes}
                      disabled={processing || currentJob.violations.every(v => v.applied || v.rejected)}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Applying Fixes...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Apply All Fixes
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Violations Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Detected Issues
                  </CardTitle>
                  <CardDescription>{currentJob.violations.length} violations found</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                  {currentJob.violations.map((violation) => (
                    <div
                      key={violation.id}
                      className={cn(
                        'p-3 rounded-lg border transition-colors',
                        violation.applied ? 'bg-success-light border-success/20' :
                        violation.rejected ? 'bg-gray-100 border-gray-200' :
                        'bg-error-light border-error/20'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={violation.severity === 'high' ? 'error' : 'warning'}
                              size="sm"
                            >
                              {violation.severity}
                            </Badge>
                            <code className="font-mono text-xs text-primary">{violation.ruleId}</code>
                            {violation.autoFixed && (
                              <Badge variant="success" size="sm">
                                <Zap className="h-2.5 w-2.5 mr-1" />
                                Auto
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-text-muted">{violation.ruleName}</p>
                        </div>
                        {violation.applied && (
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-xs text-text-muted mb-0.5">Original</label>
                          <code className="text-error font-mono block p-1.5 bg-white/50 rounded">{violation.original}</code>
                        </div>
                        <div>
                          <label className="block text-xs text-text-muted mb-0.5">Fixed</label>
                          <code className="text-success font-mono block p-1.5 bg-white/50 rounded">{violation.suggested}</code>
                        </div>
                      </div>

                      {!violation.applied && !violation.rejected && !violation.autoFixed && (
                        <div className="mt-2 flex gap-2">
                          <Button variant="primary" size="sm" className="flex-1" onClick={() => handleApplyFix(violation.id)}>
                            Apply
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleRejectFix(violation.id)}>
                            Reject
                          </Button>
                        </div>
                      )}

                      {violation.rejected && (
                        <p className="mt-2 text-xs text-text-muted">Fix rejected — original preserved</p>
                      )}
                    </div>
                  ))}

                  {currentJob.violations.every(v => v.applied || v.rejected) && (
                    <div className="text-center py-4 text-success">
                      <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                      <p className="font-medium">All fixes reviewed</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setShowPreview(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Fixed Content
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Job Detail Modal */}
        {selectedJob && (
          <Modal
            open={true}
            onClose={() => setSelectedJob(null)}
            title={selectedJob.title}
            size="xl"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Job ID</label>
                  <code className="font-mono text-sm text-primary">{selectedJob.id}</code>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Type</label>
                  <Badge variant="default">{selectedJob.type}</Badge>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Status</label>
                  <Badge variant={getStatusConfig(selectedJob.status).variant} dot>{getStatusConfig(selectedJob.status).label}</Badge>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Created</label>
                  <span className="text-sm text-text-secondary">{selectedJob.createdAt}</span>
                </div>
              </div>

              {selectedJob.status === 'completed' || selectedJob.status === 'review' ? (
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-error">{selectedJob.originalScore}%</p>
                    <p className="text-xs text-text-muted">Original Score</p>
                  </div>
                  <div className="text-center flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-success">{selectedJob.fixedScore}%</p>
                    <p className="text-xs text-text-muted">Fixed Score</p>
                  </div>
                </div>
              ) : null}

              <div>
                <h4 className="font-medium text-text-main mb-3">Fixes Applied</h4>
                <div className="space-y-3">
                  {selectedJob.violations.map((v, i) => (
                    <div key={i} className="p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={v.autoFixed ? 'success' : 'warning'} size="sm">
                          {v.autoFixed ? <Zap className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />} {v.autoFixed ? 'Auto' : 'Manual'}
                        </Badge>
                        <code className="font-mono text-xs text-primary">{v.ruleId}</code>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-error-light rounded text-error font-mono">{v.original}</div>
                        <div className="p-2 bg-success-light rounded text-success font-mono">{v.fixed}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="secondary" onClick={() => setSelectedJob(null)}>Close</Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <Modal
            open={true}
            onClose={() => setShowPreview(false)}
            title="Preview Fixed Content"
            size="xl"
          >
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-xs font-medium text-text-muted mb-1">Fixed Content</label>
                <pre className="text-sm text-text-main font-mono whitespace-pre-wrap">{currentJob.violations.reduce((text, v) => text.replace(v.original, v.suggested), currentJob.content)}</pre>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowPreview(false)}>Close</Button>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AppShell>
  );
}