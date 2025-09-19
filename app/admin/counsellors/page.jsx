"use client";

import { useState, useEffect } from "react";
import {
  UserCheck,
  UserPlus,
  Wallet,
  TrendingUp,
  Filter,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Search,
  Calendar,
  Building
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import MetricCard from "../../../components/MetricCard";
import { usePatients } from "@/app/hooks/usePatients";

export default function CounsellorDashboard() {
  const [activePage, setActivePage] = useState("Counsellors");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("consults");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCounsellor, setExpandedCounsellor] = useState(null);

  // ✅ fetch filtered patients for the branch + time
  const { patients, loading, error, refresh } = usePatients();

  // Group patients by counsellor
  const counsellorStats = patients?.reduce((acc, p) => {
    const cName = p?.counselling?.counsellor || "Unknown";

    if (!acc[cName]) {
      acc[cName] = {
        consults: 0,
        converted: 0,
        amount: 0,
        conversionRate: 0,
        patients: []
      };
    }

    acc[cName].consults += 1;
    if (p?.counselling?.converted === "Yes") {
      acc[cName].converted += 1;
    }
    acc[cName].amount += Number(p?.payment?.amountReceived || 0);
    acc[cName].patients.push(p);
    
    // Calculate conversion rate
    if (acc[cName].consults > 0) {
      acc[cName].conversionRate = Math.round((acc[cName].converted / acc[cName].consults) * 100);
    }

    return acc;
  }, {}) || {};

  // Filter and sort counsellors
  const filteredCounsellors = Object.entries(counsellorStats)
    .filter(([cName]) => 
      cName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(([aName, aStats], [bName, bStats]) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case "name":
          aValue = aName;
          bValue = bName;
          break;
        case "converted":
          aValue = aStats.converted;
          bValue = bStats.converted;
          break;
        case "amount":
          aValue = aStats.amount;
          bValue = bStats.amount;
          break;
        case "conversionRate":
          aValue = aStats.conversionRate;
          bValue = bStats.conversionRate;
          break;
        case "consults":
        default:
          aValue = aStats.consults;
          bValue = bStats.consults;
      }
      
      if (typeof aValue === 'string') {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  // Toggle sort order
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Toggle counsellor details
  const toggleCounsellorDetails = (counsellorName) => {
    if (expandedCounsellor === counsellorName) {
      setExpandedCounsellor(null);
    } else {
      setExpandedCounsellor(counsellorName);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="flex-1 p-4 lg:p-6">
       

        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Counsellor Performance</h1>
          <p className="text-gray-600 mt-1">Track and analyze counsellor performance metrics</p>
        </div>



           {/* Summary Stats */}
        {!loading && filteredCounsellors.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-800">
                  {filteredCounsellors.length}
                </div>
                <div className="text-sm text-blue-600">Total Counsellors</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-800">
                  {filteredCounsellors.reduce((sum, [_, stats]) => sum + stats.consults, 0)}
                </div>
                <div className="text-sm text-green-600">Total Consults</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-800">
                  {filteredCounsellors.reduce((sum, [_, stats]) => sum + stats.converted, 0)}
                </div>
                <div className="text-sm text-purple-600">Total Converted</div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-800">
                  {formatCurrency(filteredCounsellors.reduce((sum, [_, stats]) => sum + stats.amount, 0))}
                </div>
                <div className="text-sm text-indigo-600">Total Revenue</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 my-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search counsellors..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Sort by:</span>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="consults">Consults</option>
              <option value="converted">Converted</option>
              <option value="amount">Revenue</option>
              <option value="conversionRate">Conversion Rate</option>
              <option value="name">Name</option>
            </select>
            
            <button 
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-xl text-red-700 text-center">
            Error loading data: {error.message}
          </div>
        ) : filteredCounsellors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No counsellors found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search query" : "No data available for the selected filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredCounsellors.map(([cName, stats], idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Counsellor Header */}
                <div 
                  className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCounsellorDetails(cName)}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-indigo-700">
                        {cName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cName}</h3>
                      <p className="text-sm text-gray-500">{stats.consults} consults</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{stats.converted}</div>
                        <div className="text-xs text-gray-500">Converted</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{stats.conversionRate}%</div>
                        <div className="text-xs text-gray-500">Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{formatCurrency(stats.amount)}</div>
                        <div className="text-xs text-gray-500">Revenue</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {expandedCounsellor === cName ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {expandedCounsellor === cName && (
                  <div className="border-t border-gray-200 p-5 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <MetricCard
                        title="Total Consults"
                        value={stats.consults}
                        icon={UserPlus}
                        color="from-indigo-500 to-indigo-600"
                        trend={stats.consults > 5 ? "up" : "neutral"}
                      />
                      <MetricCard
                        title="Converted"
                        value={stats.converted}
                        icon={UserCheck}
                        color="from-green-500 to-green-600"
                        trend={stats.conversionRate > 30 ? "up" : "down"}
                        subtitle={`${stats.conversionRate}% conversion rate`}
                      />
                      <MetricCard
                        title="Revenue Generated"
                        value={formatCurrency(stats.amount)}
                        icon={Wallet}
                        color="from-purple-500 to-purple-600"
                        trend={stats.amount > 50000 ? "up" : "down"}
                      />
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-4">Recent Patients</h4>
                    <div className="bg-white rounded-lg shadow-xs overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {stats.patients.slice(0, 5).map((patient, i) => (
                            <tr key={i}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-xs font-medium text-indigo-700">
                                      {patient.personal?.name?.charAt(0) || 'P'}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {patient.personal?.name || 'Unknown Patient'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {patient.personal?.phone || 'No phone'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  patient.counselling?.converted === "Yes" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {patient.counselling?.converted === "Yes" ? "Converted" : "Pending"}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {new Date(patient.personal?.visitDate || new Date()).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(patient.payment?.amountReceived || 0)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

     
      </main>
    </div>
  );
}