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
  Mail,
  Phone,
  Users,
  BriefcaseMedical,
  Settings,
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import MetricCard from "../../../components/MetricCard";

export default function EmployeeDashboard() {
  const [activePage, setActivePage] = useState("Employees");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("totalPatients");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [employeesData, setEmployeesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employees data from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/employees");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setEmployeesData(data.data);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Combine all employees into a single array with role information
  const allEmployees = employeesData
    ? [
        ...employeesData.counsellors.map((emp) => ({
          ...emp,
          role: "counsellor",
        })),
        ...employeesData.implanters.map((emp) => ({
          ...emp,
          role: "implanter",
        })),
        ...employeesData.technicians.map((emp) => ({
          ...emp,
          role: "technician",
        })),
      ]
    : [];

  // Filter and sort employees
  const filteredEmployees = allEmployees
    .filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || employee.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "role":
          aValue = a.role;
          bValue = b.role;
          break;
        case "convertedPatients":
          aValue = a.convertedPatients || 0;
          bValue = b.convertedPatients || 0;
          break;
        case "conversionRate":
          aValue = a.conversionRate || 0;
          bValue = b.conversionRate || 0;
          break;
        case "totalRevenue":
          aValue = a.totalRevenue;
          bValue = b.totalRevenue;
          break;
        case "totalGrafts":
          aValue = a.totalGrafts || 0;
          bValue = b.totalGrafts || 0;
          break;
        case "averageGraftsPerPatient":
          aValue = a.averageGraftsPerPatient || 0;
          bValue = b.averageGraftsPerPatient || 0;
          break;
        case "totalPatients":
        default:
          aValue = a.totalPatients;
          bValue = b.totalPatients;
      }

      if (typeof aValue === "string") {
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
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "counsellor":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "implanter":
        return <BriefcaseMedical className="h-4 w-4 text-green-500" />;
      case "technician":
        return <Settings className="h-4 w-4 text-purple-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "counsellor":
        return "bg-blue-100 text-blue-800";
      case "implanter":
        return "bg-green-100 text-green-800";
      case "technician":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Toggle employee details
  const toggleEmployeeDetails = (employeeIndex) => {
    if (expandedEmployee === employeeIndex) {
      setExpandedEmployee(null);
    } else {
      setExpandedEmployee(employeeIndex);
    }
  };

  // Count employees by role
  const roleCounts = employeesData
    ? {
        counsellor: employeesData.counsellors.length,
        implanter: employeesData.implanters.length,
        technician: employeesData.technicians.length,
        total:
          employeesData.counsellors.length +
          employeesData.implanters.length +
          employeesData.technicians.length,
      }
    : { total: 0, counsellor: 0, implanter: 0, technician: 0 };

  // Get employee-specific metrics based on role
  const getEmployeeMetrics = (employee) => {
    if (employee.role === "counsellor") {
      return {
        primaryMetric: employee.totalPatients,
        primaryLabel: "Total Patients",
        secondaryMetric: employee.convertedPatients,
        secondaryLabel: "Converted",
        tertiaryMetric: `${employee.conversionRate}%`,
        tertiaryLabel: "Conversion Rate",
        revenue: employee.totalRevenue,
      };
    } else if (
      employee.role === "implanter" ||
      employee.role === "technician"
    ) {
      return {
        primaryMetric: employee.totalPatients,
        primaryLabel: "Total Patients",
        secondaryMetric: formatNumber(employee.totalGrafts),
        secondaryLabel: "Total Grafts",
        tertiaryMetric: formatNumber(employee.averageGraftsPerPatient),
        tertiaryLabel: "Avg Grafts/Patient",
        revenue: employee.totalRevenue,
      };
    }
    return {};
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Employee Performance
            </h1>
            <p className="text-gray-600 mt-1">
              Track and analyze employee performance metrics
            </p>
          </div>

          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setViewMode("list")}
            >
              List View
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        {!loading && employeesData && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Performance Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-800">
                  {roleCounts.total || 0}
                </div>
                <div className="text-sm text-blue-600">Total Employees</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-800">
                  {roleCounts.counsellor || 0}
                </div>
                <div className="text-sm text-green-600">Counsellors</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-800">
                  {roleCounts.implanter || 0}
                </div>
                <div className="text-sm text-purple-600">Implanters</div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-800">
                  {roleCounts.technician || 0}
                </div>
                <div className="text-sm text-indigo-600">Technicians</div>
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
              placeholder="Search employees or roles..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Role:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="counsellor">Counsellors</option>
                <option value="implanter">Implanters</option>
                <option value="technician">Technicians</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="role">Role</option>
                <option value="totalPatients">Total Patients</option>
                <option value="convertedPatients">Converted Patients</option>
                <option value="conversionRate">Conversion Rate</option>
                <option value="totalRevenue">Revenue</option>
                <option value="totalGrafts">Total Grafts</option>
                <option value="averageGraftsPerPatient">Avg Grafts</option>
              </select>

              <button
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                {sortOrder === "asc" ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-xl text-red-700 text-center">
            Error loading data: {error}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No employees found
            </h3>
            <p className="text-gray-500">
              {searchQuery || roleFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No data available"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee, index) => {
              const metrics = getEmployeeMetrics(employee);
              return (
                <div
                  key={`${employee.role}-${employee.name}-${index}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                >
                  {/* Employee Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-indigo-700 text-lg">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {employee.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                                employee.role
                              )}`}
                            >
                              {employee.role.charAt(0).toUpperCase() +
                                employee.role.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => toggleEmployeeDetails(index)}
                      >
                        <MoreVertical className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Employee Details */}
                  <div className="p-6">
                    {/* Performance Metrics */}
                    <div className="mb-5 grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {metrics.primaryMetric}
                        </div>
                        <div className="text-xs text-gray-500">
                          {metrics.primaryLabel}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {metrics.secondaryMetric}
                        </div>
                        <div className="text-xs text-gray-500">
                          {metrics.secondaryLabel}
                        </div>
                      </div>
                      {metrics.tertiaryMetric && (
                        <div className="text-center p-3 bg-gray-50 rounded-lg col-span-2">
                          <div className="text-lg font-bold text-gray-900">
                            {metrics.tertiaryMetric}
                          </div>
                          <div className="text-xs text-gray-500">
                            {metrics.tertiaryLabel}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Revenue */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-xl font-bold text-indigo-600">
                          {formatCurrency(metrics.revenue)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Total Revenue
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedEmployee === index && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Performance Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Role:</span>
                          <span className="text-sm font-medium">
                            {employee.role.charAt(0).toUpperCase() +
                              employee.role.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Patients:
                          </span>
                          <span className="text-sm font-medium">
                            {employee.totalPatients}
                          </span>
                        </div>
                        {employee.role === "counsellor" && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                Converted Patients:
                              </span>
                              <span className="text-sm font-medium">
                                {employee.convertedPatients}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                Conversion Rate:
                              </span>
                              <span className="text-sm font-medium">
                                {employee.conversionRate}%
                              </span>
                            </div>
                          </>
                        )}
                        {(employee.role === "implanter" ||
                          employee.role === "technician") && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                Total Grafts:
                              </span>
                              <span className="text-sm font-medium">
                                {formatNumber(employee.totalGrafts)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                Avg Grafts per Patient:
                              </span>
                              <span className="text-sm font-medium">
                                {formatNumber(employee.averageGraftsPerPatient)}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Revenue:
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(employee.totalRevenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance Metrics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((employee, index) => {
                  const metrics = getEmployeeMetrics(employee);
                  return (
                    <>
                      <tr
                        key={`${employee.role}-${employee.name}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mr-3">
                              <span className="font-semibold text-indigo-700">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {employee.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                              employee.role
                            )}`}
                          >
                            {employee.role.charAt(0).toUpperCase() +
                              employee.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>
                              {metrics.primaryMetric}{" "}
                              {metrics.primaryLabel.toLowerCase()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {metrics.secondaryMetric}{" "}
                              {metrics.secondaryLabel.toLowerCase()}
                              {metrics.tertiaryMetric &&
                                ` • ${
                                  metrics.tertiaryMetric
                                } ${metrics.tertiaryLabel.toLowerCase()}`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(employee.totalRevenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => toggleEmployeeDetails(index)}
                          >
                            {expandedEmployee === index
                              ? "Hide Details"
                              : "View Details"}
                          </button>
                        </td>
                      </tr>
                      {expandedEmployee === index && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">
                                  Performance Details
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">
                                      Total Patients:
                                    </span>
                                    <span className="text-sm font-medium">
                                      {employee.totalPatients}
                                    </span>
                                  </div>
                                  {employee.role === "counsellor" && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">
                                          Converted Patients:
                                        </span>
                                        <span className="text-sm font-medium">
                                          {employee.convertedPatients}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">
                                          Conversion Rate:
                                        </span>
                                        <span className="text-sm font-medium">
                                          {employee.conversionRate}%
                                        </span>
                                      </div>
                                    </>
                                  )}
                                  {(employee.role === "implanter" ||
                                    employee.role === "technician") && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">
                                          Total Grafts:
                                        </span>
                                        <span className="text-sm font-medium">
                                          {formatNumber(employee.totalGrafts)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">
                                          Avg Grafts per Patient:
                                        </span>
                                        <span className="text-sm font-medium">
                                          {formatNumber(
                                            employee.averageGraftsPerPatient
                                          )}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3">
                                  Revenue Summary
                                </h4>
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                                  <div className="text-2xl font-bold text-indigo-700 text-center">
                                    {formatCurrency(employee.totalRevenue)}
                                  </div>
                                  <div className="text-sm text-indigo-600 text-center mt-1">
                                    Total Revenue Generated
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
