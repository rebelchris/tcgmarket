'use client';

import React from 'react';

// Database enum values for conditions
type Condition =
  | 'mint'
  | 'near_mint'
  | 'lightly_played'
  | 'played'
  | 'heavily_played'
  | 'poor';

interface ConditionTagProps {
  condition: Condition | string;
  size?: 'sm' | 'md' | 'lg';
}

// Color mapping for different conditions
const conditionColors: Record<string, { bg: string; text: string }> = {
  mint: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  near_mint: { bg: 'bg-green-100', text: 'text-green-800' },
  lightly_played: { bg: 'bg-blue-100', text: 'text-blue-800' },
  played: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  heavily_played: { bg: 'bg-orange-100', text: 'text-orange-800' },
  poor: { bg: 'bg-red-100', text: 'text-red-800' },
  Default: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

// Display names for conditions
const conditionDisplayNames: Record<string, string> = {
  mint: 'Mint',
  near_mint: 'Near Mint',
  lightly_played: 'Lightly Played',
  played: 'Played',
  heavily_played: 'Heavily Played',
  poor: 'Poor',
};

// Size classes
const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export default function ConditionTag({
  condition,
  size = 'md',
}: ConditionTagProps) {
  // Normalize condition string to match database values
  const normalizedCondition =
    condition && typeof condition === 'string'
      ? condition.trim().toLowerCase()
      : '';

  // Get the condition color scheme, fallback to default if not found
  const colorScheme =
    conditionColors[normalizedCondition] || conditionColors.Default;
  const sizeClass = sizeClasses[size];

  // Get the display name for the condition or fallback to capitalized version
  const displayName =
    conditionDisplayNames[normalizedCondition] ||
    (normalizedCondition
      ? normalizedCondition.charAt(0).toUpperCase() +
        normalizedCondition.slice(1)
      : 'Unknown');

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorScheme.bg} ${colorScheme.text} ${sizeClass}`}
    >
      {displayName}
    </span>
  );
}

// Define default props
ConditionTag.defaultProps = {
  size: 'md',
};
