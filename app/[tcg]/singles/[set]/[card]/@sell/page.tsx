import { getCard } from '@/app/actions';
import SellPanelClient from './SellPanelClient';
import React from 'react';

export default async function SellPanel({
  params,
}: {
  params: { card: string };
}) {
  const { card } = await params;
  const data = await getCard(card);
  if (!data) return <div className='text-red-600'>Card not found</div>;
  return <SellPanelClient cardId={data.id} />;
}
