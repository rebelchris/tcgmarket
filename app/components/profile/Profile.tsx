'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const ProfileDropdown = dynamic(
  () => import(/* webpackChunkName: "profileMenu" */ './ProfileDropdown')
);

export const Profile = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Tab':
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prevIndex) => (prevIndex < 4 - 1 ? prevIndex + 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 4 - 1));
        break;
      case 'Enter':
        event.preventDefault();
        console.log(activeIndex);
        // if (activeIndex >= 0) {
        //     menuItemRefs.current[activeIndex]?.click()
        // }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className='relative z-20' onKeyDown={handleKeyDown}>
      <button
        className='flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full p-0.5 transition-all duration-300 hover:scale-105'
        aria-expanded={isOpen}
        aria-haspopup='true'
        onClick={() => setIsOpen(!isOpen)}
        title={user.name || 'User profile'}
      >
        <div className='relative'>
          <img
            className='rounded-full w-9 h-9 border-2 border-white/20 shadow-md'
            src={user.image}
            alt={`${user.name || 'User'}'s Avatar`}
          />
          <div className='absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white'></div>
        </div>
      </button>
      {isOpen && <ProfileDropdown activeIndex={activeIndex} />}
    </div>
  );
};
