'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  searchable?: boolean;
  clearable?: boolean;
}

export function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  className,
  disabled = false,
  error,
  helperText,
  searchable = false,
  clearable = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onValueChange(option.value);
      setOpen(false);
      setSearchQuery('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange('');
    setOpen(false);
  };

  return (
    <div className="w-full" ref={selectRef}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text-main mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          className={cn(
            'w-full px-3 py-2 bg-white border rounded-lg text-left',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            disabled ? 'bg-gray-50 text-text-muted cursor-not-allowed' : 'text-text-main',
            error ? 'border-error focus:ring-error' : 'border-border hover:border-text-muted',
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={label ? undefined : inputId}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          disabled={disabled}
          id={inputId}
        >
          <div className="flex items-center justify-between">
            <span className={cn('truncate', !selectedOption && 'text-text-muted')}>
              {selectedOption?.label || placeholder}
            </span>
            <div className="flex items-center gap-1.5 ml-2">
              {clearable && value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded hover:bg-gray-100 transition-colors text-text-muted"
                  aria-label="Clear selection"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {open ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
            </div>
          </div>
        </button>

        {open && (
          <div
            className="absolute z-[100] mt-1 w-full max-h-60 overflow-auto bg-white border border-border rounded-lg shadow-lg"
            role="listbox"
            aria-label={label}
          >
            {searchable && (
              <div className="p-2 border-b border-border sticky top-0 bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-border rounded-lg text-sm text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-text-muted text-sm">
                {searchQuery ? 'No matching options' : 'No options available'}
              </div>
            ) : (
              <ul role="listbox" className="py-1">
                {filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      'px-3 py-2 text-sm cursor-pointer transition-colors',
                      option.value === value ? 'bg-primary-light text-primary' : 'text-text-main hover:bg-gray-50',
                      option.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}