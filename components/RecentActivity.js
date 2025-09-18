"use client";

import { Users } from "lucide-react";

export default function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Activity
        </h2>
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          View all
        </button>
      </div>
      <div className="space-y-4">
        {[
          { id: 1, action: "New patient registration", time: "30 minutes ago", amount: "+₹2,500" },
          { id: 2, action: "Surgery completed", time: "1 hour ago", amount: "+₹15,000" },
          { id: 3, action: "Consultation booking", time: "2 hours ago", amount: "+₹1,200" },
        ].map((item) => (
          <div key={item.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.action}</p>
              <p className="text-xs text-gray-500">{item.time}</p>
            </div>
            <div className="text-sm font-medium text-green-600">
              {item.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}