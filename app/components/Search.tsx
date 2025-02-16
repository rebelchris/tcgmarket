'use client';
import {useState} from 'react';
import Link from 'next/link'
import {SearchCard, searchCard} from "@/app/actions";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "cmdk";


export const Search = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<SearchCard[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputChange = async (value: any) => {
        setQuery(value);
        const data: SearchCard[] = await searchCard(value);
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
                            <Link href={`/pokemon/singles/${user.setSlug}/${user.slug}`} className={'w-full'}>
                                {user.name}
                            </Link>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
};
