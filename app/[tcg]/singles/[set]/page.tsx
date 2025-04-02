import {getCardsBySet} from '@/app/actions';
import Link from 'next/link';
import Breadcrumb from '@/app/components/Breadcrumb.tsx';

export async function generateStaticParams() {
    return [];
}

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ tcg: string; set: string }>;
}) {
    const {set, tcg} = await params;
    const cards = await getCardsBySet(set);

    return (
        <div className='container mx-auto px-6 py-8'>
            <Breadcrumb
                items={[
                    {
                        label: tcg.charAt(0).toUpperCase() + tcg.slice(1),
                        href: `/${tcg}`,
                    },
                    {
                        label: set.charAt(0).toUpperCase() + set.slice(1),
                        active: true,
                    },
                ]}
            />

            <div className='mt-6'>
                {cards.length === 0 ? (
                    <p className='text-center py-4 text-gray-500'>No cards available</p>
                ) : (
                    <div className='bg-white p-6 border-gray-200 border rounded-lg'>
                        <div className='overflow-x-auto'>
                            <table className='min-w-full divide-y divide-gray-200'>
                                <thead className='bg-gray-50'>
                                <tr>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        Card Name
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        Number
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        Rarity
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        Available
                                    </th>
                                    <th
                                        scope='col'
                                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                                    >
                                        Price
                                    </th>
                                </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                {cards.map((card, index) => (
                                    <tr
                                        key={card.id}
                                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                    >
                                        <td className='px-6 py-4 whitespace-wrap'>
                                            <Link
                                                href={`/${tcg}/singles/${card.setSlug}/${card.slug}`}
                                                className='text-blue-600 hover:text-blue-800 hover:underline'
                                            >
                                                {card.searchName}
                                            </Link>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                            {card.number}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                            {card.rarity}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                            2323
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                            R0.15
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
