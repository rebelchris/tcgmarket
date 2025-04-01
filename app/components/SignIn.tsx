import { signIn } from '@/auth';

export default function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <button
        type='submit'
        className='flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50'
      >
        <svg
          className='w-5 h-5'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 11H20.5M20.5 11L17.5 8M20.5 11L17.5 14'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M18 7V6C18 4.34315 16.6569 3 15 3H6C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H15C16.6569 21 18 19.6569 18 18V17'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>
        Sign in
      </button>
    </form>
  );
}
