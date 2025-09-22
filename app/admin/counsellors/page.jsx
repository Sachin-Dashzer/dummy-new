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
  Settings
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import MetricCard from "../../../components/MetricCard";
import { usePatients } from "@/app/hooks/usePatients";

export default function EmployeeDashboard() {
  const [activePage, setActivePage] = useState("Employees");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("consults");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // "all", "counsellor", "implanter", "technician"
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  // ✅ fetch filtered patients for the branch + time
  const { patients, loading, error, refresh } = usePatients();

  // Group patients by employee and role
  const employeeStats = patients?.reduce((acc, p) => {
    // Determine role and name for each employee type
    const roles = [];
    
    // Counsellor data
    if (p.counselling?.counsellor) {
      roles.push({
        type: "counsellor",
        name: p.counselling.counsellor,
        email: p.counselling.email || "No email",
        phone: p.counselling.phone || "No phone",
        department: p.counselling.department || "Counselling",
        hiredDate: p.counselling.hiredDate || "Unknown date"
      });
    }
    
    // Implanter data
    if (p.implant?.implanter) {
      roles.push({
        type: "implanter",
        name: p.implant.implanter,
        email: p.implant.email || "No email",
        phone: p.implant.phone || "No phone",
        department: p.implant.department || "Implant",
        hiredDate: p.implant.hiredDate || "Unknown date"
      });
    }
    
    // Technician data
    if (p.technical?.technician) {
      roles.push({
        type: "technician",
        name: p.technical.technician,
        email: p.technical.email || "No email",
        phone: p.technical.phone || "No phone",
        department: p.technical.department || "Technical",
        hiredDate: p.technical.hiredDate || "Unknown date"
      });
    }

    // Process each role
    roles.forEach(role => {
      const key = `${role.type}-${role.name}`;
      
      if (!acc[key]) {
        acc[key] = {
          name: role.name,
          role: role.type,
          consults: 0,
          converted: 0,
          amount: 0,
          conversionRate: 0,
          procedures: 0,
          successfulProcedures: 0,
          successRate: 0,
          patients: [],
          email: role.email,
          phone: role.phone,
          department: role.department,
          hiredDate: role.hiredDate
        };
      }

      // Role-specific metrics
      if (role.type === "counsellor") {
        acc[key].consults += 1;
        if (p.counselling?.converted === "Yes") {
          acc[key].converted += 1;
        }
        acc[key].amount += Number(p.payment?.amountReceived || 0);
        
        // Calculate conversion rate
        if (acc[key].consults > 0) {
          acc[key].conversionRate = Math.round((acc[key].converted / acc[key].consults) * 100);
        }
      } 
      else if (role.type === "implanter") {
        acc[key].procedures += 1;
        if (p.implant?.successful === "Yes") {
          acc[key].successfulProcedures += 1;
        }
        
        // Calculate success rate
        if (acc[key].procedures > 0) {
          acc[key].successRate = Math.round((acc[key].successfulProcedures / acc[key].procedures) * 100);
        }
      }
      else if (role.type === "technician") {
        acc[key].procedures += 1;
        if (p.technical?.successful === "Yes") {
          acc[key].successfulProcedures += 1;
        }
        
        // Calculate success rate
        if (acc[key].procedures > 0) {
          acc[key].successRate = Math.round((acc[key].successfulProcedures / acc[key].procedures) * 100);
        }
      }

      acc[key].patients.push({...p, employeeRole: role.type});
    });

    return acc;
  }, {}) || {};

  // Filter and sort employees
  const filteredEmployees = Object.entries(employeeStats)
    .filter(([key, employee]) => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === "all" || employee.role === roleFilter;
      
      return matchesSearch && matchesRole;
    })
    .sort(([aKey, aStats], [bKey, bStats]) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case "name":
          aValue = aStats.name;
          bValue = bStats.name;
          break;
        case "converted":
          aValue = aStats.converted;
          bValue = bStats.converted;
          break;
        case "procedures":
          aValue = aStats.procedures;
          bValue = bStats.procedures;
          break;
        case "successfulProcedures":
          aValue = aStats.successfulProcedures;
          bValue = bStats.successfulProcedures;
          break;
        case "successRate":
          aValue = aStats.successRate;
          bValue = bStats.successRate;
          break;
        case "amount":
          aValue = aStats.amount;
          bValue = bStats.amount;
          break;
        case "conversionRate":
          aValue = aStats.conversionRate;
          bValue = bStats.conversionRate;
          break;
        case "department":
          aValue = aStats.department;
          bValue = bStats.department;
          break;
        case "role":
          aValue = aStats.role;
          bValue = bStats.role;
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === "Unknown date") return "Unknown date";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch(role) {
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
    switch(role) {
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
  const toggleEmployeeDetails = (employeeKey) => {
    if (expandedEmployee === employeeKey) {
      setExpandedEmployee(null);
    } else {
      setExpandedEmployee(employeeKey);
    }
  };

  // Count employees by role
  const roleCounts = Object.values(employeeStats).reduce((acc, employee) => {
    acc[employee.role] = (acc[employee.role] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    return acc;
  }, {});

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
            <h1 className="text-2xl font-bold text-gray-900">Employee Performance</h1>
            <p className="text-gray-600 mt-1">Track and analyze employee performance metrics</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        {!loading && filteredEmployees.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Performance Summary</h3>
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
              placeholder="Search employees or departments..."
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
                <option value="department">Department</option>
                <option value="consults">Consults</option>
                <option value="converted">Converted</option>
                <option value="conversionRate">Conversion Rate</option>
                <option value="procedures">Procedures</option>
                <option value="successfulProcedures">Successful Procedures</option>
                <option value="successRate">Success Rate</option>
                <option value="amount">Revenue</option>
              </select>
              
              <button 
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
            Error loading data: {error.message}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
            <p className="text-gray-500">
              {searchQuery || roleFilter !== "all" ? "Try adjusting your search or filter criteria" : "No data available"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(([key, employee], idx) => (
              <div key={key} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                {/* Employee Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-indigo-700 text-lg">
                          {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{employee.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(employee.role)}`}>
                            {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                          </span>
                          <p className="text-sm text-gray-500">{employee.department}</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="p-2 rounded-lg hover:bg-gray-100"
                      onClick={() => toggleEmployeeDetails(key)}
                    >
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Employee Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                      <p className="text-sm font-medium text-gray-900">{employee.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Hired Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(employee.hiredDate)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{employee.phone}</span>
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                    {employee.role === "counsellor" ? (
                      <>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{employee.consults}</div>
                          <div className="text-xs text-gray-500">Consults</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{employee.converted}</div>
                          <div className="text-xs text-gray-500">Converted</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{employee.conversionRate}%</div>
                          <div className="text-xs text-gray-500">Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{formatCurrency(employee.amount)}</div>
                          <div className="text-xs text-gray-500">Revenue</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{employee.procedures}</div>
                          <div className="text-xs text-gray-500">Procedures</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{employee.successfulProcedures}</div>
                          <div className="text-xs text-gray-500">Successful</div>
                        </div>
                        <div className="text-center col-span-2">
                          <div className="text-lg font-bold text-gray-900">{employee.successRate}%</div>
                          <div className="text-xs text-gray-500">Success Rate</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Expanded Details */}
                {expandedEmployee === key && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-3">Recent Patients</h4>
                    <div className="space-y-3">
                      {employee.patients.slice(0, 3).map((patient, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 shadow-xs border border-gray-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {patient.personal?.name || 'Unknown Patient'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(patient.personal?.visitDate || new Date()).toLocaleDateString()}
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              patient.counselling?.converted === "Yes" || 
                              patient.implant?.successful === "Yes" ||
                              patient.technical?.successful === "Yes"
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {patient.counselling?.converted === "Yes" || 
                               patient.implant?.successful === "Yes" ||
                               patient.technical?.successful === "Yes" 
                                ? "Successful" : "Pending"}
                            </span>
                          </div>
                          {employee.role === "counsellor" && (
                            <div className="mt-2 text-sm text-gray-700">
                              Amount: {formatCurrency(patient.payment?.amountReceived || 0)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map(([key, employee], idx) => (
                  <>
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mr-3">
                            <span className="font-semibold text-indigo-700">
                              {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(employee.role)}`}>
                          {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employee.role === "counsellor" ? (
                          <div className="text-sm text-gray-900">
                            <div>{employee.consults} consults, {employee.converted} converted</div>
                            <div className="text-xs text-gray-500">{employee.conversionRate}% conversion rate</div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-900">
                            <div>{employee.procedures} procedures, {employee.successfulProcedures} successful</div>
                            <div className="text-xs text-gray-500">{employee.successRate}% success rate</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => toggleEmployeeDetails(key)}
                        >
                          {expandedEmployee === key ? "Hide Details" : "View Details"}
                        </button>
                      </td>
                    </tr>
                    {expandedEmployee === key && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{employee.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{employee.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">Hired: {formatDate(employee.hiredDate)}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">Performance Details</h4>
                              {employee.role === "counsellor" ? (
                                <div className="grid grid-cols-2 gap-4">
                                  <MetricCard
                                    title="Total Consults"
                                    value={employee.consults}
                                    icon={UserPlus}
                                    color="from-blue-500 to-blue-600"
                                    small
                                  />
                                  <MetricCard
                                    title="Converted"
                                    value={employee.converted}
                                    icon={UserCheck}
                                    color="from-green-500 to-green-600"
                                    small
                                  />
                                  <MetricCard
                                    title="Conversion Rate"
                                    value={`${employee.conversionRate}%`}
                                    icon={TrendingUp}
                                    color="from-purple-500 to-purple-600"
                                    small
                                  />
                                  <MetricCard
                                    title="Revenue Generated"
                                    value={formatCurrency(employee.amount)}
                                    icon={Wallet}
                                    color="from-indigo-500 to-indigo-600"
                                    small
                                  />
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-4">
                                  <MetricCard
                                    title="Total Procedures"
                                    value={employee.procedures}
                                    icon={Settings}
                                    color="from-blue-500 to-blue-600"
                                    small
                                  />
                                  <MetricCard
                                    title="Successful"
                                    value={employee.successfulProcedures}
                                    icon={UserCheck}
                                    color="from-green-500 to-green-600"
                                    small
                                  />
                                  <MetricCard
                                    title="Success Rate"
                                    value={`${employee.successRate}%`}
                                    icon={TrendingUp}
                                    color="from-purple-500 to-purple-600"
                                    small
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}