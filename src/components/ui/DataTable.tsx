'use client';

import { useState, useMemo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (row: T, index: number) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  pagination?: boolean;
  pageSize?: number;
  striped?: boolean;
  hoverable?: boolean;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  onSort?: (key: string) => void;
  rowClassName?: (row: T) => string;
  emptyMessage?: string;
  loading?: boolean;
}

function DataTable<T>({
  columns,
  data,
  keyField,
  pagination = true,
  pageSize = 10,
  striped = false,
  hoverable = false,
  sortConfig,
  onSort,
  rowClassName,
  emptyMessage = 'No data available',
  loading = false,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortConfig || !onSort) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortConfig.key];
      const bVal = (b as Record<string, unknown>)[sortConfig.key];
      if (aVal === bVal) return 0;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * direction;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      }
      return 0;
    });
  }, [data, sortConfig, onSort]);

  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    if (onSort) onSort(key);
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ChevronsUpDown className="h-4 w-4 text-text-muted" />;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-primary" />
    ) : (
      <ChevronDown className="h-4 w-4 text-primary" />
    );
  };

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border-light">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full" role="grid">
        <thead>
          <tr className="border-b border-border bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.sortable && 'cursor-pointer hover:bg-gray-100 select-none'
                )}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center justify-center gap-1">
                  {column.header}
                  {column.sortable && renderSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={(row as Record<string, unknown>)[keyField] as string}
                className={cn(
                  'border-b border-border-light transition-colors',
                  hoverable && 'hover:bg-gray-50',
                  striped && rowIndex % 2 === 1 && 'bg-gray-50',
                  rowClassName?.(row)
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-sm text-text-main',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                    style={{ width: column.width }}
                  >
                    {column.render ? column.render(row, rowIndex) : (row as Record<string, unknown>)[column.key] as ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <div className="text-sm text-text-muted">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      'w-8 h-8 rounded-lg font-medium transition-colors',
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-gray-100'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataTable };