'use client';

import { signOut } from 'next-auth/react';

const menuItems = [
  {
    label: 'Your Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    label: 'Settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    label: 'Activity',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    action: () => signOut(),
    label: 'Sign out',
    icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  },
];

export const ProfileDropdown = ({ activeIndex }) => {
  return (
    <div className='absolute right-0 w-64 mt-2 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 border border-indigo-500/30 rounded-xl shadow-2xl'>
      <div className='px-4 py-3 border-b border-indigo-500/30'>
        <p className='text-sm font-medium text-white'>My Account</p>
      </div>
      <div className='py-2'>
        {menuItems.map((item, index) => (
          <a
            onClick={item?.action}
            key={item.label}
            href='#'
            className={`flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 hover:bg-indigo-600/20 transition-colors duration-150 ${
              index === activeIndex
                ? 'bg-indigo-600/30 border-l-2 border-indigo-500'
                : 'border-l-2 border-transparent'
            }`}
            role='menuitem'
            tabIndex={0}
          >
            <div className='p-1.5 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d={item.icon}
                />
              </svg>
            </div>
            {item.label}
          </a>
        ))}
      </div>
      <div className='px-4 py-2 mt-1 bg-indigo-900/30 text-xs text-indigo-300'>
        <p>TCGmarket © 2025</p>
      </div>
    </div>
  );
};

export default ProfileDropdown;
