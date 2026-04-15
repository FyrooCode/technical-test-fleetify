import React, { useState } from 'react';
import { ChevronDown, Menu, BarChart3, ShoppingCart, Kanban, Mail, Users, Package, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="fixed top-4 left-4 z-50 inline-flex sm:hidden items-center justify-center p-2 rounded-base text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
      >
        <Menu size={24} />
        <span className="sr-only">Open sidebar</span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 border-r border-gray-200 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {/* Dashboard */}
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-gray-700 rounded-base hover:bg-gray-100 group"
              >
                <BarChart3 size={20} className="text-gray-700 group-hover:text-blue-600" />
                <span className="ms-3">Dashboard</span>
              </a>
            </li>

            {/* E-commerce with Dropdown */}
            <li>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center w-full justify-between px-2 py-1.5 text-gray-700 rounded-base hover:bg-gray-100 group"
              >
                <div className="flex items-center">
                  <ShoppingCart size={20} className="text-gray-700 group-hover:text-blue-600" />
                  <span className="flex-1 ms-3 text-left">E-commerce</span>
                </div>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {dropdownOpen && (
                <ul className="py-2 space-y-2">
                  <li>
                    <a
                      href="#"
                      className="pl-10 flex items-center px-2 py-1.5 text-gray-700 rounded-base hover:bg-gray-100"
                    >
                      Products
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="pl-10 flex items-center px-2 py-1.5 text-gray-700 rounded-base hover:bg-gray-100"
                    >
                      Billing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="pl-10 flex items-center px-2 py-1.5 text-gray-700 rounded-base hover:bg-gray-100"
                    >
                      Invoice
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Kanban */}
            <li>
              <a
                href="#"
                className="flex items-center justify-between px-2 py-1.5 text-gray-700 rounded-base hover:bg-gray-100 group"
              >
                <div className="flex items-center">
                  <Kanban size={20} className="text-gray-700 group-hover:text-blue-600" />
                  <span className="flex-1 ms-3 whitespace-nowrap">Kanban</span>
                </div>
                <span className="bg-gray-200 text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded">
                  Pro
                </span>
              </a>
            </li>

            {/* Inbox */}
            <li>
              <a
                href="#"
                className="flex items-center justify-between px-2 py-1.5 text-gray-700 rounded-base hover:bg-gray-100 group"
              >
                <div className="flex items-center">
                  <Mail size={20} className="text-gray-700 group-hover:text-blue-600" />
                  <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                </div>
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                  2
                </span>
              </a>
            </li>

            {/* Users */}
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-gray-700 rounded-base hover:bg-gray-100 group"
              >
                <Users size={20} className="text-gray-700 group-hover:text-blue-600" />
                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
              </a>
            </li>

            {/* Products */}
            <li>
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-gray-700 rounded-base hover:bg-gray-100 group"
              >
                <Package size={20} className="text-gray-700 group-hover:text-blue-600" />
                <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
              </a>
            </li>

            {/* Sign Out - at bottom */}
            <li className="mt-auto pt-4 border-t border-gray-200">
              <a
                href="#"
                className="flex items-center px-2 py-1.5 text-gray-700 rounded-base hover:bg-gray-100 group"
              >
                <LogOut size={20} className="text-gray-700 group-hover:text-red-600" />
                <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
