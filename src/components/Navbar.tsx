"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dasbor HPP" },
  { href: "/inventory", label: "Inventaris" },
  { href: "/purchases", label: "Pembelian" },
  { href: "/sales", label: "Penjualan" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Aplikasi COGS Obat
        </Link>
        <div className="flex items-center space-x-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
