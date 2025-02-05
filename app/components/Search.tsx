'use client';
import {useState} from 'react';
import {searchCard} from '../actions';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from '@/components/ui/command';
import Link from 'next/link'
import {usePathname} from "next/navigation";

export const Search = () => {
    const pathname = usePathname()
    const [query, setQuery] = useState('');
    const [result, setResult] = useState([]);

    const handleInputChange = async (value) => {
        setQuery(value);
        const data = await searchCard(value);
        console.log(data);
        setResult(data);
    };

    return (
        <Command className='rounded-lg border shadow-md md:min-w-[450px]'>
            <CommandInput
                placeholder='Search cards...'
                value={query}
                onValueChange={(search) => {
                    console.log(search);
                    handleInputChange(search);
                }}
                className='border-none p-0 focus:ring-0'
            />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {result.map((user) => (
                        <CommandItem
                            key={user.id}
                            value={user.name}
                            onSelect={(currentValue) => {
                                console.log('selecting', currentValue, user);
                            }}
                        >
                            <Link href={`${pathname}/singles/${user.setSlug}/${user.slug}`} className={'w-full'}>
                                {user.name}
                            </Link>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
};
