"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

const BRANCHES = ["Delhi", "Mumbai", "Hyderabad"];
const PAYMENT_METHODS = ["CASH", "UPI", "CARD", "TRANSFER"];

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

export default function AmountDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({
    branch: "",
    dateFrom: "",
    dateTo: "",
    paymentMethod: "",
  });
  const [activeTab, setActiveTab] = useState("transactions"); // ✅ Tabs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/finance/get-data");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setTransactions(data.transactions || []);
        setExpenses(data.expenses || []);
      } catch (e) {
        setError(e.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtering
  const filteredTransactions = useMemo(() => {
    let list = [...transactions];
    if (filters.branch) list = list.filter((t) => t.branch === filters.branch);
    if (filters.paymentMethod)
      list = list.filter((t) => t.method === filters.paymentMethod);
    if (filters.dateFrom)
      list = list.filter(
        (t) => new Date(t.date) >= new Date(filters.dateFrom)
      );
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((t) => new Date(t.date) <= to);
    }
    return list;
  }, [transactions, filters]);

  const filteredExpenses = useMemo(() => {
    let list = [...expenses];
    if (filters.branch) list = list.filter((e) => e.branch === filters.branch);
    if (filters.dateFrom)
      list = list.filter((e) => new Date(e.date) >= new Date(filters.dateFrom));
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((e) => new Date(e.date) <= to);
    }
    return list;
  }, [expenses, filters]);

  // Totals
  const totalIncome = filteredTransactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );
  const totalExpense = filteredExpenses.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );
  const netBalance = totalIncome - totalExpense;

  // Pagination
  const rows = activeTab === "transactions" ? filteredTransactions : filteredExpenses;
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(page, pages);
  const startIdx = (current - 1) * perPage;
  const endIdx = Math.min(startIdx + perPage, total);
  const paginatedRows = rows.slice(startIdx, endIdx);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Amount Dashboard
          </h1>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sticky top-0 bg-gray-50 z-10 py-2">
          <SummaryCard label="Total Income" value={totalIncome} color="green" />
          <SummaryCard label="Total Expense" value={totalExpense} color="red" />
          <SummaryCard label="Net Balance" value={netBalance} color="blue" />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3">
          <Select
            label="Branch"
            value={filters.branch}
            onChange={(v) => setFilters((f) => ({ ...f, branch: v }))}
            options={[
              { label: "All", value: "" },
              ...BRANCHES.map((b) => ({ label: b, value: b })),
            ]}
          />
          <Select
            label="Payment Method"
            value={filters.paymentMethod}
            onChange={(v) => setFilters((f) => ({ ...f, paymentMethod: v }))}
            options={[
              { label: "All", value: "" },
              ...PAYMENT_METHODS.map((m) => ({ label: m, value: m })),
            ]}
          />
          <Input
            label="From"
            type="date"
            value={filters.dateFrom}
            onChange={(v) => setFilters((f) => ({ ...f, dateFrom: v }))}
          />
          <Input
            label="To"
            type="date"
            value={filters.dateTo}
            onChange={(v) => setFilters((f) => ({ ...f, dateTo: v }))}
          />
        </div>

        {/* Tabs */}
        <div className="border-b flex gap-6">
          <button
            onClick={() => {
              setActiveTab("transactions");
              setPage(1);
            }}
            className={`pb-2 ${
              activeTab === "transactions"
                ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => {
              setActiveTab("expenses");
              setPage(1);
            }}
            className={`pb-2 ${
              activeTab === "expenses"
                ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            Expenses
          </button>
        </div>

        {/* Table */}
        <Table
          title={activeTab === "transactions" ? "Transactions" : "Expenses"}
          columns={
            activeTab === "transactions"
              ? ["Patient", "Method", "Amount", "Date", "Branch"]
              : ["Title", "Category", "Amount", "Date", "Branch"]
          }
          rows={
            activeTab === "transactions"
              ? paginatedRows.map((t) => [
                  t.patientName,
                  t.method,
                  `₹${t.amount}`,
                  formatDate(t.date),
                  t.branch,
                ])
              : paginatedRows.map((e) => [
                  e.title,
                  e.category,
                  `₹${e.amount}`,
                  formatDate(e.date),
                  e.branch,
                ])
          }
          pagination={{
            page: current,
            pages,
            total,
            startIdx,
            endIdx,
            perPage,
            setPage,
            setPerPage,
          }}
        />
      </main>
    </div>
  );
}

/* -------------------- Small UI Components -------------------- */
function SummaryCard({ label, value, color }) {
  const colors = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
  };
  return (
    <div className="p-5 bg-white rounded-lg shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${colors[color]}`}>
        ₹{value.toLocaleString()}
      </p>
    </div>
  );
}


function Table({ title, columns, rows, pagination }) {
  const [tableSearch, setTableSearch] = useState("");

  // Filter rows by table search
  const filteredRows = rows.filter((r) =>
    r.some((val) => val.toString().toLowerCase().includes(tableSearch.toLowerCase()))
  );

  const paginatedRows = filteredRows.slice(
    pagination.startIdx,
    pagination.endIdx
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-3 border-b">
        <div className="font-semibold text-gray-800">{title}</div>
        <input
          type="text"
          placeholder="🔍 Search..."
          value={tableSearch}
          onChange={(e) => setTableSearch(e.target.value)}
          className="w-full md:w-64 rounded-md border px-3 py-1.5 text-sm shadow-sm focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              {columns.map((c, idx) => (
                <th
                  key={c}
                  className={`px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide ${
                    idx === 0 ? "rounded-l-lg" : ""
                  } ${idx === columns.length - 1 ? "rounded-r-lg" : ""}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              paginatedRows.map((r, i) => (
                <tr
                  key={i}
                  className={`transition-colors duration-150 ${
                    i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                  } hover:bg-indigo-50`}
                >
                  {r.map((val, j) => (
                    <td
                      key={j}
                      className={`px-5 py-3 ${
                        j === 2
                          ? "text-right font-semibold text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {/* Special badge styling */}
                      {columns[j] === "Method" && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          {val}
                        </span>
                      )}
                      {columns[j] === "Category" && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          {val}
                        </span>
                      )}
                      {columns[j] === "Branch" && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          {val}
                        </span>
                      )}
                      {["Method", "Category", "Branch"].includes(columns[j])
                        ? null
                        : val}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-5 py-3 border-t bg-gray-50">
        <p className="text-xs text-gray-600">
          Showing <b>{pagination.startIdx + 1}</b>–<b>{pagination.endIdx}</b> of{" "}
          <b>{filteredRows.length}</b>
        </p>
        <div className="flex items-center gap-3">
          <select
            className="text-sm border rounded-md px-2 py-1"
            value={pagination.perPage}
            onChange={(e) => pagination.setPerPage(Number(e.target.value))}
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="p-2 rounded-md border bg-white disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-600 w-16 text-center">
              {pagination.page} / {pagination.pages}
            </span>
            <button
              onClick={() =>
                pagination.setPage((p) =>
                  Math.min(pagination.pages, p + 1)
                )
              }
              disabled={pagination.page >= pagination.pages}
              className="p-2 rounded-md border bg-white disabled:opacity-40 hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




function Input({ label, type = "text", value, onChange }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-200"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-200 bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
