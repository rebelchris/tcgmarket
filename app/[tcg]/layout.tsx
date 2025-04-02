import React from 'react';

export default async function TCGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className='flex flex-1 bg-purple-50'>{children}</main>
    </>
  );
}
