'use client';

import { type KeyboardEvent, useId, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { Chip } from './Chip';

interface TagOption {
  id: string;
  name: string;
}

export interface TagPickerProps {
  options: TagOption[];
  selected: string[]; // array of IDs
  onChange: (selected: string[]) => void;
  placeholder?: string;
  max?: number; // max selectable tags
  label: string;
  className?: string;
}

export function TagPicker({
  options,
  selected,
  onChange,
  placeholder,
  max,
  label,
  className,
}: TagPickerProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const inputId = `${baseId}-input`;

  const atMax = max !== undefined && selected.length >= max;

  const selectedOptions = useMemo(
    () =>
      selected
        .map((id) => options.find((o) => o.id === id))
        .filter((o): o is TagOption => Boolean(o)),
    [selected, options],
  );

  const matches = useMemo(() => {
    if (atMax) return [];
    const q = query.trim().toLowerCase();
    return options.filter((o) => !selected.includes(o.id) && o.name.toLowerCase().includes(q));
  }, [options, selected, query, atMax]);

  const showDropdown = open && (matches.length > 0 || atMax);
  const activeOption = showDropdown && !atMax ? matches[highlight] : undefined;

  const addTag = (id: string) => {
    if (atMax || selected.includes(id)) return;
    onChange([...selected, id]);
    setQuery('');
    setHighlight(0);
  };

  const removeTag = (id: string) => onChange(selected.filter((s) => s !== id));

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setOpen(true);
        setHighlight((h) => (matches.length ? (h + 1) % matches.length : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlight((h) => (matches.length ? (h - 1 + matches.length) % matches.length : 0));
        break;
      case 'Enter':
        if (activeOption) {
          e.preventDefault();
          addTag(activeOption.id);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
      case 'Backspace':
        if (query === '' && selected.length) {
          removeTag(selected[selected.length - 1]);
        }
        break;
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex flex-wrap items-center gap-2 rounded-sm border border-border bg-surface p-2 focus-within:border-[1.5px] focus-within:border-primary focus-within:shadow-focus"
        >
          {selectedOptions.map((o) => (
            <Chip
              key={o.id}
              variant="tag"
              size="sm"
              removable
              label={o.name}
              onRemove={() => removeTag(o.id)}
            >
              {o.name}
            </Chip>
          ))}
          <input
            id={inputId}
            ref={inputRef}
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={listboxId}
            aria-activedescendant={activeOption ? `${baseId}-opt-${activeOption.id}` : undefined}
            aria-autocomplete="list"
            value={query}
            placeholder={selectedOptions.length ? undefined : placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setHighlight(0);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={handleKeyDown}
            className="min-w-[80px] flex-1 bg-transparent text-[14.5px] text-ink placeholder:text-text-meta focus:outline-none"
          />
        </div>
        {showDropdown && (
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-sm border border-border bg-surface py-1 shadow-card"
          >
            {atMax ? (
              <li className="px-3 py-2 text-[13px] text-text-meta">
                Maximum of {max} selected
              </li>
            ) : (
              matches.map((o, i) => (
                <li
                  key={o.id}
                  id={`${baseId}-opt-${o.id}`}
                  role="option"
                  aria-selected={i === highlight}
                  // onMouseDown (not onClick) so selection fires before the input's onBlur closes the list
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTag(o.id);
                  }}
                  onMouseEnter={() => setHighlight(i)}
                  className={cn(
                    'cursor-pointer px-3 py-2 text-[14px]',
                    i === highlight ? 'bg-tag-bg text-tag-text' : 'text-ink',
                  )}
                >
                  {o.name}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
