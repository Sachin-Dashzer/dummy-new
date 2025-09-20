"use client";

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

// Constants
const STATUS_OPTIONS = [
  "NEW",
  "COUNSELLING",
  "READY",
  "SURGERY_SCHEDULED",
  "POST_OP",
  "CLOSED",
];
const LOCATION_OPTIONS = ["Mumbai", "Delhi", "Hyderabad"];
const PACKAGE_OPTIONS = [
  "Sapphire FUE",
  "PRP",
  "FUE",
  "Hybrid Package",
  "Indian DHI",
  "Standard FUE",
  "DHI",
];

// Status badge colors mapping
const STATUS_COLORS = {
  NEW: "bg-blue-100 text-blue-800",
  COUNSELLING: "bg-purple-100 text-purple-800",
  READY: "bg-yellow-100 text-yellow-800",
  SURGERY_SCHEDULED: "bg-orange-100 text-orange-800",
  POST_OP: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",  
};

export default function PatientDashboard() {
  const searchParams = useSearchParams();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Initialize filters with URL parameters if present
  const [filters, setFilters] = useState({
    search: "",
    status: searchParams.get("status") || "",
    location: "",
    counsellor: "",
    package: searchParams.get("package") || "",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(
    !!searchParams.get("status") ||
      !!searchParams.get("dateFrom") ||
      !!searchParams.get("package")
  );

  // Update filters when URL parameters change
  useEffect(() => {
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const packageFilter = searchParams.get("package");

    if (status || dateFrom || dateTo || packageFilter) {
      setFilters((prev) => ({
        ...prev,
        status: status || prev.status,
        dateFrom: dateFrom || prev.dateFrom,
        dateTo: dateTo || prev.dateTo,
        package: packageFilter || prev.package,
      }));

      // Auto-show filters when coming from dashboard
      setShowFilters(true);
    }
  }, [searchParams]);

  // Load patient data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/patients/get-patient");
        if (!res.ok) throw new Error("Failed to fetch patient data");

        const data = await res.json();
        setPatients(data.items || []);
        setFilteredPatients(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract unique counsellors
  const counsellorOptions = [
    ...new Set(patients.map((p) => p?.counselling?.counsellor)),
  ].filter(Boolean);

  // Apply filters
  useEffect(() => {
    let result = patients;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.personal.name.toLowerCase().includes(searchLower) ||
          p.personal.phone.includes(searchLower) ||
          p.personal.email.toLowerCase().includes(searchLower)
      );
    }
    if (filters.status) {
      result = result.filter((p) => p.ops.status === filters.status);
    }
    if (filters.location) {
      result = result.filter((p) => p.personal.location === filters.location);
    }
    if (filters.counsellor) {
      result = result.filter(
        (p) => p.counselling.counsellor === filters.counsellor
      );
    }
    if (filters.package) {
      result = result.filter((p) => p.personal.package === filters.package);
    }
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter((p) => new Date(p.personal.visitDate) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((p) => new Date(p.personal.visitDate) <= toDate);
    }

    setFilteredPatients(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, patients]);

  // ... rest of the component remains the same ...
  // Sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredPatients].sort((a, b) => {
      const getValue = (obj, key) =>
        key.split(".").reduce((o, k) => (o ? o[k] : null), obj);
      const aValue = getValue(a, key);
      const bValue = getValue(b, key);

      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setFilteredPatients(sorted);
  };

  const clearFilters = () =>
    setFilters({
      search: "",
      status: "",
      location: "",
      counsellor: "",
      package: "",
      dateFrom: "",
      dateTo: "",
    });

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPatients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loading & Error states
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
          <p className="font-medium">Error loading patient data</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Patient Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and track all patient records
              </p>
            </div>
            <Link
              href="add-patient"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Patient
            </Link>
          </div>
        </header>

        {/* Stats Summary */}
        <div className="px-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Patients
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {patients.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Cases
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {patients.filter((p) => p.ops.status !== "CLOSED").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Scheduled Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      patients.filter((p) => {
                        const today = new Date().toDateString();
                        const visitDate = new Date(
                          p.personal.visitDate
                        ).toDateString();
                        return visitDate === today;
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="rounded-full bg-orange-100 p-3 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Need Follow-up
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      patients.filter((p) => p.ops.status === "COUNSELLING")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white shadow-md rounded-lg p-4 m-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
              >
                Clear All
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Search patients by name, phone, or email..."
              className="p-3 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="">All Stages</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                  >
                    <option value="">All Locations</option>
                    {LOCATION_OPTIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Counsellor
                  </label>
                  <select
                    className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500"
                    value={filters.counsellor}
                    onChange={(e) =>
                      setFilters({ ...filters, counsellor: e.target.value })
                    }
                  >
                    <option value="">All Users</option>
                    {counsellorOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package
                  </label>
                  <select
                    className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500"
                    value={filters.package}
                    onChange={(e) =>
                      setFilters({ ...filters, package: e.target.value })
                    }
                  >
                    <option value="">All Packages</option>
                    {PACKAGE_OPTIONS.map((pkg) => (
                      <option key={pkg} value={pkg}>
                        {pkg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date From
                  </label>
                  <input
                    type="date"
                    className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters({ ...filters, dateFrom: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date To
                  </label>
                  <input
                    type="date"
                    className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500"
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters({ ...filters, dateTo: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Patients Table */}
        <main className="p-4 md:p-6 flex-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4 hidden lg:table-cell">Location</th>
                    <th
                      className="px-6 py-4 cursor-pointer hover:bg-gray-200 transition"
                      onClick={() => handleSort("personal.visitDate")}
                    >
                      <div className="flex items-center">
                        Visit Date
                        {sortConfig.key === "personal.visitDate" && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ml-1 ${
                              sortConfig.direction === "ascending"
                                ? ""
                                : "rotate-180"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 hidden xl:table-cell">Package</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((patient) => (
                      <tr
                        key={patient._id}
                        className="hover:bg-gray-50 transition group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold flex-shrink-0">
                              {patient.personal.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                                {patient.personal.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {patient.personal.gender},{" "}
                                {patient.personal.age}y
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">
                            {patient.personal.phone}
                          </div>
                        </td>

                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="text-gray-700">
                            {patient.personal.location}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-700">
                            {formatDate(patient.personal.visitDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              STATUS_COLORS[patient.ops.status] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {patient.ops.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          <div className="text-gray-700">
                            {patient.personal.package}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-3">
                            <Link
                              href={`/admin/patients/${patient._id}`}
                              className="text-indigo-600 hover:text-indigo-900 transition p-1 rounded-full hover:bg-indigo-50"
                              title="View patient details"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                  fillRule="evenodd"
                                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Link>
                            <button
                              className="text-blue-600 hover:text-blue-900 transition p-1 rounded-full hover:bg-blue-50"
                              title="Edit patient"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="mt-4 font-medium">No patients found</p>
                        <p className="mt-1 text-sm">
                          Try adjusting your search or filter to find what
                          you're looking for.
                        </p>
                        <button
                          onClick={clearFilters}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                        >
                          Clear All Filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {filteredPatients.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredPatients.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredPatients.length}</span>{" "}
                patients
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="text-sm border rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>

                <div className="flex bg-white rounded-md shadow-sm">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-l-md border text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`px-3 py-2 border-t border-b text-sm font-medium ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      paginate(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-r-md border text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
