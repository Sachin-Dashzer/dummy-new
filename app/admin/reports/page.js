"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function ReportsPage() {
  const [activePage, setActivePage] = useState("Reports ");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [filters, setFilters] = useState({
    period: "all",
    category: "all",
    startDate: "",
    endDate: "",
    staffFilter: "",
    techniqueFilter: "",
    statusFilter: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    staff: [],
    techniques: [],
    status: [],
  });

  const reports = [
    {
      id: 1,
      name: "Patient Data Report",
      description:
        "Complete patient database with demographics and medical information",
      category: "Patient Reports",
      type: "patients",
      periods: ["daily", "weekly", "monthly", "custom", "all"],
      showAdvancedFilters: true,
    },
    {
      id: 2,
      name: "Counsellor Performance Report",
      description: "Counsellor performance metrics and conversion rates",
      category: "Staff Reports",
      type: "counsellors",
      periods: ["all"],
    },
    {
      id: 3,
      name: "Agent Referral Report",
      description: "Agent referral performance and commission analytics",
      category: "Staff Reports",
      type: "agents",
      periods: ["all"],
    },
    {
      id: 4,
      name: "Implanter Efficiency Report",
      description: "Implanter surgical efficiency and performance metrics",
      category: "Staff Reports",
      type: "implanters",
      periods: ["all"],
    },
    {
      id: 5,
      name: "Technician Performance Report",
      description: "Technician workload and procedure efficiency",
      category: "Staff Reports",
      type: "technicians",
      periods: ["all"],
    },
    {
      id: 6,
      name: "Surgical Technique Report",
      description: "Surgical technique analysis and success rates",
      category: "Medical Reports",
      type: "techniques",
      periods: ["all"],
    },
    {
      id: 7,
      name: "Transaction Report",
      description: "Payment transactions and financial records",
      category: "Financial Reports",
      type: "transactions",
      periods: ["daily", "weekly", "monthly", "custom", "all"],
    },
    {
      id: 8,
      name: "Patient Status Report",
      description: "Patient status distribution and pipeline analysis",
      category: "Patient Reports",
      type: "status",
      periods: ["all"],
    },
  ];

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(reports.map((report) => report.category)),
  ];

  // Fetch filter options when component mounts
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch("/api/reports/filters");
      const result = await response.json();

      if (result.success) {
        setFilterOptions(result.data);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filters.category === "all" || report.category === filters.category;

    return matchesSearch && matchesCategory;
  });

  const downloadExcel = async (reportType, reportId) => {
    setLoadingId(reportId);
    try {
      const params = new URLSearchParams({
        type: reportType,
        period: filters.period,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.staffFilter && { staffFilter: filters.staffFilter }),
        ...(filters.techniqueFilter && {
          techniqueFilter: filters.techniqueFilter,
        }),
        ...(filters.statusFilter && { statusFilter: filters.statusFilter }),
      });

      const response = await fetch(`/api/reports?${params}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      const { utils, writeFile } = await import("xlsx");
      const wb = utils.book_new();
      const ws = utils.json_to_sheet(result.data);
      utils.book_append_sheet(wb, ws, "Report");

      writeFile(
        wb,
        `${reportType}_report_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Download error:", error);
      alert("Error: " + error.message);
    } finally {
      setLoadingId(null);
    }
  };

  const showDateRange = filters.period === "custom";
  const showAdvancedFilters =
    filters.category === "Patient Reports" ||
    searchTerm.toLowerCase().includes("patient");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="p-10 max-w-7xl mx-auto">
        {/* Improved Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Reports Dashboard
              </h1>
              <p className="text-gray-600">
                Generate and download comprehensive business reports
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last generated</div>
              <div className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Recently Viewed & Favorites */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="font-medium text-gray-700">
                  Recently Viewed
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="font-medium text-gray-700">Favourites</span>
              </div>
            </div>
          </div>
        </div>

        {/* All Reports Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">All Reports</h2>
            <span className="text-sm text-gray-500">
              {filteredReports.length} report
              {filteredReports.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {/* Enhanced Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Reports
                </label>
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period
                </label>
                <select
                  value={filters.period}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, period: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {/* Custom Date Range */}
              {showDateRange && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Filters for Patient Data */}
            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Advanced Patient Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Staff Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Filter by Staff
                    </label>
                    <select
                      value={filters.staffFilter}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          staffFilter: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Staff</option>
                      {filterOptions.staff.map((staff) => (
                        <option key={staff} value={staff}>
                          {staff}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Technique Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Filter by Technique
                    </label>
                    <select
                      value={filters.techniqueFilter}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          techniqueFilter: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Techniques</option>
                      {filterOptions.techniques.map((technique) => (
                        <option key={technique} value={technique}>
                          {technique}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Filter by Status
                    </label>
                    <select
                      value={filters.statusFilter}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          statusFilter: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Status</option>
                      {filterOptions.status.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  These filters apply to Patient Data reports only
                </p>
              </div>
            )}
          </div>

          {/* Reports Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    S.No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report, index) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {report.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md">
                        {report.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          report.category === "Patient Reports"
                            ? "bg-green-100 text-green-800"
                            : report.category === "Staff Reports"
                            ? "bg-blue-100 text-blue-800"
                            : report.category === "Medical Reports"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => downloadExcel(report.type, report.id)}
                        disabled={loadingId === report.id}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm transition-colors min-w-32 justify-center"
                      >
                        {loadingId === report.id ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Download Excel
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-lg">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium mb-2">No reports found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Download Logs Section */}
        {/* <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Download Logs
            </h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search download history..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <svg
              className="w-20 h-20 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No downloads yet
            </h3>
            <p className="text-gray-500 text-sm">
              Your downloaded reports will appear here for easy access
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
