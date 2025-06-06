'use client';

import React, { useState, useEffect } from 'react';

export default function CardTabs({
  info,
  sell,
  wants,
  user,
}: {
  info: React.ReactNode;
  sell: React.ReactNode;
  wants: React.ReactNode;
  user?: boolean | object | null;
}) {
  const [tab, setTab] = useState<'info' | 'sell' | 'wants'>('info');

  // If not logged in, force tab to 'info' if user tries to select others
  useEffect(() => {
    if (!user && tab !== 'info') setTab('info');
  }, [user, tab]);

  return (
    <div>
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${
            tab === 'info'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-blue-600'
          }`}
          onClick={() => setTab('info')}
          type="button"
        >
          Info
        </button>
        {user && (
          <>
            <button
              className={`px-4 py-2 font-semibold border-b-2 ${
                tab === 'sell'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-600'
              }`}
              onClick={() => setTab('sell')}
              type="button"
            >
              Sell
            </button>
            <button
              className={`px-4 py-2 font-semibold border-b-2 ${
                tab === 'wants'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-600'
              }`}
              onClick={() => setTab('wants')}
              type="button"
            >
              Wants
            </button>
          </>
        )}
      </div>
      <div>
        {tab === 'info' && info}
        {user && tab === 'sell' && sell}
        {user && tab === 'wants' && wants}
      </div>
    </div>
  );
}

CardTabs.defaultProps = {
  user: undefined,
};
