import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex  justify-between">
      <Link href="/" className="text-2xl font-bold">
        Hacker news clone
      </Link>
      <ul className="flex items-center space-x-6">
        <li className="hover:text-gray-300">
          <Link href="/new" className="px-3 py-2 rounded-md text-white hover:bg-gray-700">
            New
          </Link>
        </li>
        <li className="hover:text-gray-300">
          <Link href="/best" className="px-3 py-2 rounded-md text-white hover:bg-gray-700">
            Best
          </Link>
        </li>
        <li className="hover:text-gray-300">
          <Link href="/ask" className="px-3 py-2 rounded-md text-white hover:bg-gray-700">
            Ask
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
