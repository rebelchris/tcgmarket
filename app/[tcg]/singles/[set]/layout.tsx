import React from 'react';

export default async function TCGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='container mx-auto flex flex-col gap-4'>{children}</div>
  );
}
