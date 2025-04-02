import React from 'react';
import Link from 'next/link';

/**
 * Breadcrumb item type
 */
export interface BreadcrumbItem {
  /** The label to display */
  label: string;
  /** Optional URL to link to */
  href?: string;
  /** Whether this is the active/current page */
  active?: boolean;
}

interface BreadcrumbProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb component for navigation
 */
export default function Breadcrumb({ items = [] }: BreadcrumbProps) {
  if (!items.length) return null;

  return (
    <nav className='mb-4' aria-label='Breadcrumb'>
      <ol className='flex flex-wrap items-center space-x-1 text-sm text-gray-500'>
        <li>
          <Link
            href='/'
            className='flex items-center hover:text-blue-600 transition-colors'
          >
            <svg
              className='w-4 h-4 mr-1'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
              />
            </svg>
            Home
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={`breadcrumb-${index}`} className='flex items-center'>
            <svg
              className='w-5 h-5 text-gray-400'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
            {item.href && !item.active ? (
              <Link
                href={item.href}
                className='hover:text-blue-600 transition-colors'
                aria-current={item.active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`${item.active ? 'font-medium text-gray-800' : ''}`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
