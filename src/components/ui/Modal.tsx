'use client';

import { useEffect, ReactNode, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

export function Modal({ open, onClose, title, description, children, size = 'md', showClose = true }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }
  }, [open]);

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative w-full bg-white rounded-xl shadow-xl overflow-hidden',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          sizes[size]
        )}
      >
        <div className="flex items-start justify-between p-4 border-b border-border">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-text-main">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-text-muted">{description}</p>
            )}
          </div>
          {showClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: 'default' | 'danger';
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'default',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-text-secondary">{message}</p>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'destructive' : 'primary'}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}