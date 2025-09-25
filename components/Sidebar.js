"use client";

import { useState } from "react";
import { Building2, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItem = ({ item, href, isActive, onClick }) => (
  <Link href={href} className="block w-full">
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center ${
        isActive
          ? "bg-indigo-100 text-indigo-700 font-semibold shadow-sm"
          : "text-gray-600 hover:bg-gray-100 font-medium"
      }`}
    >
      <span className="flex-grow">{item}</span>
      {isActive && (
        <div className="w-1 h-6 bg-indigo-600 rounded-full ml-2"></div>
      )}
    </button>
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("");

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Patients", path: "/admin/patients" },
    { name: "Counsellors", path: "/admin/counsellors" },
    { name: "Amounts", path: "/admin/amounts" },
    { name: "Implanter", path: "/admin/implanter" },
    { name: "Agents", path: "/admin/agents" },
    { name: "Technique", path: "/admin/technique" },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden h-full"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 lg:sticky w-64 bg-white border-r shadow-sm p-6 space-y-6 z-30 h-screen transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-center font-bold text-xl text-indigo-600 flex items-center"
          >
            <Building2 className="mr-2 my-5" />
            Ryan Clinic
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1 pt-5">
          {navItems.map((item) => (
            <NavItem
              key={item.name}
              item={item.name}
              href={item.path}
              isActive={pathname === item.path || activePage === item.name}
              onClick={() => {
                setActivePage(item.name);
                setSidebarOpen(false); // close on mobile
              }}
            />
          ))}
        </nav>

        {/* Admin Info */}
        <div className="absolute bottom-6 left-6 right-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
