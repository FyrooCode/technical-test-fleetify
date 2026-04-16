import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { BarChart3, FileText, LogOut, Menu, X, Package, History } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useInvoiceStore } from '@/store/useInvoiceStore';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const resetInvoice = useInvoiceStore((state) => state.resetInvoice);

  const handleSignOut = () => {
    Cookies.remove('token');
    logout();
    resetInvoice();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: BarChart3, href: '/' },
    { label: 'Create Invoice', icon: FileText, href: '/wizard' },
    { label: 'Master Items', icon: Package, href: '/master-items' },
    { label: 'Invoice History', icon: History, href: '/invoices' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 sm:hidden p-2 bg-white border rounded-md print:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r transition-transform duration-300 print:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col px-3 py-6">
          <div className="mb-10 px-2">
            <h1 className="text-xl font-bold text-blue-600">Fleetify Admin</h1>
          </div>

          <ul className="space-y-2 flex-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                    router.pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="ms-3 font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2.5 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span className="ms-3 font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};