"use client";

import { ChevronDown, Search, Bell, Menu } from "lucide-react";

export default function Topbar({ 
  setSidebarOpen, 
  timeRange, 
  setTimeRange, 
  branch, 
  setBranch 
}) {
  const branchOptions = ["All Branches", "Mumbai", "Delhi", "Hyderabad"];
  const timeOptions = ["Today", "This Week", "This Month"];

  return (
    <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm">
      <div className="flex items-center">
        <button
          className="lg:hidden mr-4"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
      <div className="flex gap-4">
        <div className="hidden md:flex relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none px-4 py-2 border rounded-lg shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 pr-8"
          >
            {timeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="appearance-none px-4 py-2 border rounded-lg shadow-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 pr-8"
          >
            {branchOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
        <button className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );
}