"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const topMenuItems = [
    { name: 'Chat', href: '/chat' },
    { name: 'Own GPT', href: '/own-gpt' },
    { name: 'Image', href: '/image', },
    { name: 'Assistant', href: '/assistant' },
    { name: 'Tools', href: '/Tools' },
    { name: 'Education', href: '/education' },
  ];

  const bottomMenuItems = [
    { name: 'Contact', href: '/contact' },
    { name: 'API Access', href: '/api-access' },
  ];

  return (
    <nav className="w-64 bg-gray-800 text-white p-6 flex flex-col justify-between min-h-screen">
      {/* Top Section */}
      <div>
        <ul className="space-y-4">
          {topMenuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  block px-4 py-2 rounded
                  hover:bg-gray-700 transition-colors duration-150
                  ${pathname === item.href ? 'bg-gray-700' : ''}
                `}
              >
                {item.name}
                {item.roadmap && (
                  <span className="text-red-500"> (On Roadmap)</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* Bottom Section */}
      <div>
        <ul className="space-y-4">
          {bottomMenuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  block px-4 py-2 rounded
                  hover:bg-gray-700 transition-colors duration-150
                  ${pathname === item.href ? 'bg-gray-700' : ''}
                `}
              >
                {item.name}
                {item.roadmap && (
                  <span className="text-red-500"> (On Roadmap)</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
