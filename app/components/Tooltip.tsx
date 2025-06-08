"use client";

import React, { useState, useContext, createContext, useId, useMemo } from 'react';

// Tooltip context to manage only one open at a time
const TooltipContext = createContext<{
  openId: string | null;
  setOpenId: (id: string | null) => void;
    } | null>(null);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const value = useMemo(() => ({ openId, setOpenId }), [openId]);
  return (
    <TooltipContext.Provider value={value}>
      {children}
    </TooltipContext.Provider>
  );
}

function useTooltipContext() {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error('Tooltip must be used within a TooltipProvider');
  return ctx;
}

export default function Tooltip({ content, children }: { content: React.ReactNode, children: React.ReactNode }) {
  const { openId, setOpenId } = useTooltipContext();
  const id = useId();
  const open = openId === id;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setOpenId(open ? null : id);
    }
  };

  return (
    <span className="relative inline-block">
      <span
        role="button"
        tabIndex={0}
        onClick={() => setOpenId(open ? null : id)}
        onKeyDown={handleKeyDown}
        className="cursor-pointer"
        aria-label="Show description"
      >
        {children}
      </span>
      {open && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
          {content}
        </span>
      )}
    </span>
  );
} 