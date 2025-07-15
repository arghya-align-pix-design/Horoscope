'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Chat', path: '/chat' },
  { name: 'Reports', path: '/reports' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <nav className="w-full bg-indigo-600 shadow text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`hover:text-white font-medium transition ${
                pathname === item.path
                  ? 'border-b-2 border-white text-white pb-1'
                  : 'text-indigo-200'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 hover:text-red-200 text-sm text-red-100"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
