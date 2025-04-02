import { useEffect, useRef, useState } from 'react';
import { SearchCard, searchCard } from '@/app/actions';
import { useParams, useRouter } from 'next/navigation';
import { Combobox, Dialog, DialogBackdrop } from '@headlessui/react';
import Image from 'next/image';

const Search = () => {
  const params = useParams();
  const { tcg } = params;

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [result, setResult] = useState<SearchCard[]>([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [query, setQuery] = useState('');
  const inputRef = useRef();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = async (value: any) => {
    setQuery(value);
    if (value?.length > 1) {
      const data: SearchCard[] = await searchCard({ query: value, tcgId: tcg });
      setResult(data);
    }
  };

  useEffect(() => {
    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', onKeydown);

    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, []);

  if (!tcg) {
    return null;
  }

  return (
    <>
      <div className='relative w-full'>
        <div className='relative'>
          <input
            onClick={() => setIsOpen(true)}
            type='search'
            placeholder='Search cards... (⌘K)'
            autoComplete='off'
            className='w-full bg-white/20 text-white placeholder-white/70 border border-white/30 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 shadow-inner backdrop-blur-sm'
          />
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 text-white/70'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
        </div>
      </div>
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        className='fixed inset-0 p-4 pt-[15vh] overflow-y-auto z-[100]'
        initialFocus={inputRef}
      >
        <DialogBackdrop className='fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]' />
        <Combobox
          immediate
          as='div'
          className='max-w-2xl mx-auto relative flex flex-col z-[101]'
          value={selectedPerson}
          onChange={(value) => {
            if (value !== null) {
              const route = `/pokemon/singles/${value.setSlug}/${value.slug}`;
              router.push(route);
            }
            setIsOpen(false);
          }}
          onClose={() => setQuery('')}
        >
          <div className='bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden border border-indigo-500/30 ring-4 ring-purple-800/10'>
            <div className='flex items-center text-lg font-medium border-b border-indigo-500/30 relative'>
              <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-indigo-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </div>
              <Combobox.Input
                ref={inputRef}
                className='p-5 pl-12 text-white placeholder-indigo-300 w-full bg-transparent border-0 outline-none'
                placeholder='Search for cards...'
                autoComplete='off'
                displayValue={(person) => person?.name}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                <kbd className='px-2 py-1 text-xs bg-indigo-900/50 text-indigo-300 rounded-md border border-indigo-700'>
                  ESC
                </kbd>
              </div>
            </div>
            <Combobox.Options
              className='max-h-80 overflow-y-auto flex flex-col'
              static
            >
              {result.length === 0 && query !== '' ? (
                <div className='py-8 px-4 text-center text-indigo-300'>
                  {query.length > 1
                    ? 'No results found.'
                    : 'Type at least 2 characters to search...'}
                </div>
              ) : (
                result.map((card) => (
                  <Combobox.Option
                    key={card.id}
                    value={card}
                    className='group flex cursor-pointer transition-colors duration-150 items-center gap-2 py-3 px-4 select-none hover:bg-indigo-600/20 data-[focus]:bg-indigo-600/30 border-l-2 border-transparent data-[focus]:border-indigo-500'
                  >
                    <div className='flex items-center gap-3'>
                      {card.images?.large ? (
                        <div className='relative'>
                          <div
                            className='bg-gradient-to-br from-indigo-600 to-purple-700 p-2 rounded-md cursor-pointer'
                            onMouseEnter={(e) => {
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              const hoverElement = e.currentTarget
                                .nextElementSibling as HTMLElement;
                              if (hoverElement) {
                                hoverElement.style.top = `${
                                  rect.top - hoverElement.offsetHeight - 8
                                }px`;
                                hoverElement.style.left = `${rect.left - 16}px`;
                                hoverElement.style.opacity = '1';
                              }
                            }}
                            onMouseLeave={(e) => {
                              const hoverElement = e.currentTarget
                                .nextElementSibling as HTMLElement;
                              if (hoverElement) {
                                hoverElement.style.opacity = '0';
                              }
                            }}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 text-white'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                              />
                            </svg>
                          </div>
                          <div className='fixed opacity-0 transition-opacity duration-200 pointer-events-none z-[9999] w-20'>
                            <div className='bg-gray-900 rounded-lg p-2 shadow-2xl relative z-10'>
                              <Image
                                src={card.images.large}
                                alt={card.name || 'Card image'}
                                width={400}
                                height={560}
                                className='rounded'
                                priority
                              />
                            </div>
                            <div className='w-4 h-4 bg-gray-900 rotate-45 absolute -bottom-2 left-6'></div>
                          </div>
                        </div>
                      ) : (
                        <div className='bg-gradient-to-br from-indigo-600 to-purple-700 p-2 rounded-md'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 text-white'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className='text-base font-medium text-white'>
                          {card.searchName}
                        </div>
                        <div className='text-xs text-indigo-300'>
                          {card.setName}
                        </div>
                      </div>
                    </div>
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
            <div className='px-4 py-3 bg-indigo-900/30 border-t border-indigo-500/30 text-xs text-indigo-300'>
              <div className='flex items-center justify-between'>
                <span>Search powered by TCGmarket</span>
                <div className='flex items-center gap-2'>
                  <span>Navigate</span>
                  <kbd className='px-1.5 py-0.5 bg-indigo-800/50 text-indigo-300 rounded border border-indigo-700'>
                    ↑
                  </kbd>
                  <kbd className='px-1.5 py-0.5 bg-indigo-800/50 text-indigo-300 rounded border border-indigo-700'>
                    ↓
                  </kbd>
                  <span>Select</span>
                  <kbd className='px-1.5 py-0.5 bg-indigo-800/50 text-indigo-300 rounded border border-indigo-700'>
                    Enter
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </Combobox>
      </Dialog>
    </>
  );
};
export default Search;
