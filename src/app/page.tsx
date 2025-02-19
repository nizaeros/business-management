import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Link 
        href="/login"
        className="px-4 py-2 bg-[#1034A6] text-white rounded hover:bg-opacity-90 transition-colors"
      >
        Go to Login
      </Link>
    </div>
  );
}