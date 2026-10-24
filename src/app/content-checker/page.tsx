'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';

import { cn } from '@/lib/utils';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Loader2,
  Zap,
  Eye,
  Copy,
  Download,
  Upload,
  Settings,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Sparkles,
  Shield,
} from 'lucide-react';

const contentTypes = [
  { value: 'marketing', label: 'Marketing Copy' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'social', label: 'Social Media' },
  { value: 'web', label: 'Web Content' },
  { value: 'press', label: 'Press Release' },
  { value: 'blog', label: 'Blog Article' },
  { value: 'ads', label: 'Ad Copy' },
  { value: 'other', label: 'Other' },
];

const mockResults = {
  score: 94,
  status: 'approved' as 'approved' | 'needs_review' | 'rejected',
  violations: [
    {
      id: 'v1',
      ruleId: 'BR-001',
      ruleName: 'No Unauthorized Superlative Claims',
      severity: 'high' as const,
      location: { start: 45, end: 62 },
      originalText: 'the best solution on the market',
      suggestedFix: 'a leading solution in the market',
      explanation: 'Superlative claims require verified third-party evidence',
      autoFixable: true,
    },
    {
      id: 'v2',
      ruleId: 'BR-004',
      ruleName: 'Required Trademark Symbols',
      severity: 'medium' as const,
      location: { start: 120, end: 130 },
      originalText: 'Florén',
      suggestedFix: 'Florén™',
      explanation: 'Brand names must include ™ on first use',
      autoFixable: true,
    },
    {
      id: 'v3',
      ruleId: 'BR-002',
      ruleName: 'Brand Voice: Professional & Approachable',
      severity: 'low' as const,
      location: { start: 200, end: 215 },
      originalText: 'super awesome features',
      suggestedFix: 'excellent features',
      explanation: 'Avoid casual slang; maintain professional tone',
      autoFixable: true,
    },
    {
      id: 'v4',
      ruleId: 'BR-008',
      ruleName: 'Evidence Required for Performance Claims',
      severity: 'high' as const,
      location: { start: 310, end: 328 },
      originalText: '10x faster performance',
      suggestedFix: '10x faster performance (per benchmark v3.2)',
      explanation: 'Performance claims require verifiable benchmarks',
      autoFixable: false,
    },
  ],
  passes: [
    { ruleId: 'BR-005', ruleName: 'Inclusive Language Standards', status: 'passed' },
    { ruleId: 'BR-006', ruleName: 'Approved Product Terminology', status: 'passed' },
    { ruleId: 'BR-007', ruleName: 'Missing Trademark Symbols', status: 'passed' },
    { ruleId: 'BR-009', ruleName: 'Color Palette Compliance', status: 'passed' },
    { ruleId: 'BR-010', ruleName: 'Logo Clear Space Requirements', status: 'passed' },
  ],
};

export default function ContentCheckerPage() {
  const [activeStep, setActiveStep] = useState<'input' | 'results'>('input');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('marketing');
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);
  const [selectedViolation, setSelectedViolation] = useState<typeof mockResults.violations[0] | null>(null);
  const { success, error, info } = useToast();

  const handleCheck = async () => {
    if (!content.trim()) {
      error('No content', 'Please enter content to check.');
      return;
    }

    setChecking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResults(mockResults);
    setActiveStep('results');
    setChecking(false);
    success('Check complete', `Compliance score: ${mockResults.score}%`);
  };

  const handleMagicFix = () => {
    info('Magic Fix', 'Opening Magic Fix with auto-corrections...');
    setActiveStep('input');
  };

  const handleRequestReview = () => {
    success('Review requested', 'Content sent to review queue.');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'neutral';
    }
  };

  const highlightText = (text: string, violations: typeof mockResults.violations) => {
    // Simplified highlighting - in real app would use more sophisticated approach
    return text;
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Content Checker</h1>
            <p className="mt-1 text-sm text-text-muted">Validate content against brand rules — Rulebook v2.4</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Check Settings
            </Button>
            <Button variant="secondary" onClick={() => { setActiveStep('input'); setResults(null); setContent(''); }}>
              <RefreshCw className="h-4 w-4 mr-2" />
              New Check
            </Button>
          </div>
        </div>

        {activeStep === 'input' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Enter Content to Check
              </CardTitle>
              <CardDescription>Paste or upload content for brand compliance validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[300px] p-4 border border-border rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm leading-relaxed resize-y"
                    placeholder="Paste your content here...

Example:
Introducing Florén™ — the best solution for brand compliance. Our super awesome features help you maintain consistent brand voice across all channels. With 10x faster performance than competitors, you'll never worry about violations again."
                  />
                  <div className="mt-2 flex items-center justify-between text-sm text-text-muted">
                    <span>{content.length} characters</span>
                    <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Content Type</label>
                    <Select
                      value={contentType}
                      onValueChange={setContentType}
                      options={contentTypes}
                    />
                  </div>
                  <div className="p-4 bg-light-blue-surface rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-medium">Quick Actions</span>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {
                        setContent(`Introducing Florén™ — the best solution for brand compliance. Our super awesome features help you maintain consistent brand voice across all channels. With 10x faster performance than competitors, you'll never worry about violations again.`);
                      }}>
                        <Upload className="h-4 w-4" />
                        Load Sample
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Upload className="h-4 w-4" />
                        Upload File
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <Button variant="secondary" size="lg">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="primary" size="lg" onClick={handleCheck} disabled={checking || !content.trim()}>
                  {checking ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Check Compliance
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeStep === 'results' && results && (
          <div className="space-y-6">
            {/* Score Header */}
            <Card className={cn(results.status === 'approved' ? 'border-success/30' : results.status === 'rejected' ? 'border-error/30' : 'border-warning/30')}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          className="text-gray-100"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="44"
                          cx="48"
                          cy="48"
                        />
                        <circle
                          className={cn(
                            'transition-all duration-1000',
                            results.status === 'approved' && 'text-success',
                            results.status === 'needs_review' && 'text-warning',
                            results.status === 'rejected' && 'text-error'
                          )}
                          strokeWidth="8"
                          strokeDasharray={276.46}
                          strokeDashoffset={276.46 * (1 - results.score / 100)}
                          strokeLinecap="round"
                          fill="transparent"
                          r="44"
                          cx="48"
                          cy="48"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-text-main">{results.score}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            results.status === 'approved' ? 'success' :
                            results.status === 'rejected' ? 'error' : 'warning'
                          }
                          size="lg"
                          dot
                        >
                          {results.status.charAt(0).toUpperCase() + results.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-text-muted">Rulebook v2.4 • {contentTypes.find(c => c.value === contentType)?.label}</span>
                      </div>
                      <p className="mt-2 text-text-secondary">
                        {results.status === 'approved'
                          ? 'Content passes brand compliance checks.'
                          : results.status === 'rejected'
                          ? `${results.violations.length} violation(s) found requiring attention.`
                          : `${results.violations.length} issue(s) found — review recommended.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" onClick={() => setActiveStep('input')}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Fixed
                    </Button>
                    <Button variant={results.violations.some(v => v.autoFixable) ? 'primary' : 'outline'} onClick={handleMagicFix}>
                      <Zap className="h-4 w-4 mr-2" />
                      Magic Fix
                    </Button>
                    <Button variant="secondary" onClick={handleRequestReview}>
                      <FileText className="h-4 w-4 mr-2" />
                      Request Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Violations Tabs */}
            <Tabs defaultValue="violations">
              <TabsList>
                <TabsTrigger value="violations">Violations ({results.violations.length})</TabsTrigger>
                <TabsTrigger value="passes">Passed ({results.passes.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="violations" className="mt-6 space-y-4">
                {results.violations.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
                      <h3 className="text-lg font-medium text-text-main">No violations found</h3>
                      <p className="mt-1 text-text-muted">Your content complies with all active brand rules.</p>
                    </CardContent>
                  </Card>
                ) : (
                  results.violations.map((violation) => (
                    <Card key={violation.id} variant="outlined" className={cn(
                      violation.severity === 'high' && 'border-error/30',
                      violation.severity === 'medium' && 'border-warning/30',
                      violation.severity === 'low' && 'border-info/30'
                    )}>
                      <CardContent className="p-5">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant={getSeverityColor(violation.severity)}
                                dot
                              >
                                {violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)}
                              </Badge>
                              <code className="font-mono text-sm text-primary">{violation.ruleId}</code>
                              <span className="font-medium text-text-main">{violation.ruleName}</span>
                              {violation.autoFixable && (
                                <Badge variant="success" size="sm">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Auto-fixable
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-text-muted mb-3">{violation.explanation}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">Original</label>
                                <div className="p-3 bg-error-light rounded-lg border border-error/20">
                                  <code className="text-sm text-error font-mono">{violation.originalText}</code>
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">Suggested Fix</label>
                                <div className="p-3 bg-success-light rounded-lg border border-success/20">
                                  <code className="text-sm text-success font-mono">{violation.suggestedFix}</code>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => setSelectedViolation(violation)}
                              className="p-2 rounded-lg hover:bg-light-blue-surface transition-colors text-text-muted"
                              aria-label="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {violation.autoFixable && (
                              <Button variant="primary" size="sm" onClick={() => info('Auto-fix applied', `Applied fix for ${violation.ruleId}`)}>
                                <Zap className="h-4 w-4 mr-2" />
                                Apply Fix
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="passes" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border-light">
                      {results.passes.map((pass) => (
                        <div key={pass.ruleId} className="px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-success" />
                            <div>
                              <code className="font-mono text-sm text-primary">{pass.ruleId}</code>
                              <span className="ml-2 font-medium text-text-main">{pass.ruleName}</span>
                            </div>
                          </div>
                          <Badge variant="success" size="sm">Passed</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Violation Detail Modal */}
        {selectedViolation && (
          <Modal
            open={true}
            onClose={() => setSelectedViolation(null)}
            title={`Violation: ${selectedViolation.ruleName}`}
            size="lg"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Rule ID</label>
                  <code className="font-mono text-sm text-primary">{selectedViolation.ruleId}</code>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Severity</label>
                  <Badge variant={getSeverityColor(selectedViolation.severity)} dot>{selectedViolation.severity}</Badge>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Explanation</label>
                <p className="text-text-secondary">{selectedViolation.explanation}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Original Text</label>
                  <div className="p-3 bg-error-light rounded-lg border border-error/20">
                    <code className="text-sm text-error font-mono">{selectedViolation.originalText}</code>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Suggested Fix</label>
                  <div className="p-3 bg-success-light rounded-lg border border-success/20">
                    <code className="text-sm text-success font-mono">{selectedViolation.suggestedFix}</code>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-light-blue-surface rounded-lg border border-primary/20">
                <label className="block text-xs font-medium text-text-muted mb-1">Location in Content</label>
                <p className="text-sm text-text-secondary">
                  Characters {selectedViolation.location.start}–{selectedViolation.location.end}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="secondary" onClick={() => setSelectedViolation(null)}>Close</Button>
                {selectedViolation.autoFixable && (
                  <Button variant="primary" onClick={() => { info('Auto-fix applied', `Applied fix for ${selectedViolation.ruleId}`); setSelectedViolation(null); }}>
                    <Zap className="h-4 w-4 mr-2" />
                    Apply Fix
                  </Button>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AppShell>
  );
}