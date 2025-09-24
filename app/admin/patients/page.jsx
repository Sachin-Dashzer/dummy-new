"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { Filter, X, ChevronRight, ChevronLeft } from "lucide-react";

/* -------------------- Constants -------------------- */
const STATUS_OPTIONS = [
  "NEW",
  "COUNSELLING",
  "READY",
  "SURGERY_SCHEDULED",
  "POST_OP",
  "CLOSED",
];
const STATUS_COLORS = {
  NEW: "bg-blue-100 text-blue-800",
  COUNSELLING: "bg-purple-100 text-purple-800",
  READY: "bg-amber-100 text-amber-800",
  SURGERY_SCHEDULED: "bg-orange-100 text-orange-800",
  POST_OP: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-gray-100 text-gray-800",
};
const LOCATION_OPTIONS = ["Delhi", "Mumbai", "Hyderabad"];
const PACKAGE_OPTIONS = [
  "Sapphire FUE",
  "PRP",
  "FUE",
  "Hybrid Package",
  "Indian DHI",
  "Standard FUE",
  "DHI",
];
const PAYMENT_METHODS = ["CASH", "UPI", "CARD", "TRANSFER"];

/* -------------------- Helpers -------------------- */
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

const getInitialFiltersFromURL = (sp) => ({
  search: "",
  status: sp.get("status") || "",
  location: sp.get("branch") === "All" ? "" : sp.get("branch") || "",
  counsellor: sp.get("counsellor") || "",
  package: sp.get("package") || "",
  dateFrom: sp.get("dateFrom") || "",
  dateTo: sp.get("dateTo") || "",
  agent: "",
  doctor: "",
  seniorTech: "",
  implanter: "",
  technique: "",
  paymentMethod: "",
  surgeryDate: sp.get("surgeryDate") || "",
  visited: sp.get("visited") === "true",
  readyForSurgery: sp.get("readyForSurgery") === "true",
});

/* ===================================================
   Patient Dashboard
=================================================== */
export default function PatientDashboard() {
  const searchParams = useSearchParams();

  /* ------------ State ------------ */
  const [patients, setPatients] = useState([]);
  const [filters, setFilters] = useState(() =>
    getInitialFiltersFromURL(searchParams)
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sort, setSort] = useState({ key: "personal.visitDate", dir: "desc" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  /* ------------ Data Fetch ------------ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/patients/get-patient");
        if (!res.ok) throw new Error("Failed to fetch patient data");
        const data = await res.json();
        setPatients(data.items || []);
      } catch (e) {
        setError(e.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ------------ Dynamic options ------------ */
  const counsellorOptions = useMemo(
    () =>
      [...new Set(patients.map((p) => p?.counselling?.counsellor))].filter(
        Boolean
      ),
    [patients]
  );
  const doctorOptions = useMemo(
    () => [...new Set(patients.map((p) => p?.surgery?.doctor))].filter(Boolean),
    [patients]
  );
  const seniorTechOptions = useMemo(
    () =>
      [...new Set(patients.map((p) => p?.surgery?.seniorTech))].filter(Boolean),
    [patients]
  );
  const implanterOptions = useMemo(
    () =>
      [
        ...new Set([
          ...patients.map((p) => p?.surgery?.implanterRight),
          ...patients.map((p) => p?.surgery?.implanterLeft),
        ]),
      ].filter(Boolean),
    [patients]
  );
  const techniqueOptions = useMemo(
    () =>
      [
        ...new Set([
          ...patients.map((p) => p?.counselling?.techniqueSuggested),
          ...patients.map((p) => p?.surgery?.technique),
        ]),
      ].filter(Boolean),
    [patients]
  );

  /* ------------ Filtering + Sorting ------------ */
  const filtered = useMemo(() => {
    let list = [...patients];

    const includesCI = (a = "", b = "") =>
      a.toString().toLowerCase().includes(b.toString().toLowerCase());

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          includesCI(p?.personal?.name, q) ||
          includesCI(p?.personal?.phone, q) ||
          includesCI(p?.personal?.email, q)
      );
    }
    if (filters.status)
      list = list.filter((p) => p?.ops?.status === filters.status);
    if (filters.location)
      list = list.filter((p) => p?.personal?.location === filters.location);
    if (filters.counsellor)
      list = list.filter(
        (p) => p?.counselling?.counsellor === filters.counsellor
      );
    if (filters.visited) {
      list = list.filter((p) => Boolean(p?.counselling?.counsellor));
    }

    if (filters.readyForSurgery) {
      list = list.filter((p) => p?.counselling?.readyForSurgery === true);
    }

    if (filters.package)
      list = list.filter((p) => p?.personal?.package === filters.package);
    if (filters.agent)
      list = list.filter((p) => includesCI(p?.ops?.createdBy, filters.agent));
    if (filters.doctor)
      list = list.filter((p) => p?.surgery?.doctor === filters.doctor);
    if (filters.seniorTech)
      list = list.filter((p) => p?.surgery?.seniorTech === filters.seniorTech);
    if (filters.implanter) {
      list = list.filter(
        (p) =>
          p?.surgery?.implanterRight === filters.implanter ||
          p?.surgery?.implanterLeft === filters.implanter
      );
    }
    if (filters.technique) {
      list = list.filter(
        (p) =>
          p?.counselling?.techniqueSuggested === filters.technique ||
          p?.surgery?.technique === filters.technique
      );
    }
    if (filters.paymentMethod) {
      list = list.filter((p) =>
        (p?.payments?.transactions || []).some(
          (t) => t?.method === filters.paymentMethod
        )
      );
    }
    if (filters.surgeryDate) {
      const sd = new Date(filters.surgeryDate);
      const start = new Date(sd);
      start.setHours(0, 0, 0, 0);
      const end = new Date(sd);
      end.setHours(23, 59, 59, 999);
      list = list.filter((p) => {
        const d = p?.surgery?.surgeryDate
          ? new Date(p.surgery.surgeryDate)
          : null;
        return d && d >= start && d <= end;
      });
    }
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      list = list.filter((p) => new Date(p?.personal?.visitDate) >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((p) => new Date(p?.personal?.visitDate) <= to);
    }

    // sort
    const getVal = (obj, key) =>
      key.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
    list.sort((a, b) => {
      const av = getVal(a, sort.key);
      const bv = getVal(b, sort.key);
      if (av == null && bv == null) return 0;
      if (av == null) return sort.dir === "asc" ? -1 : 1;
      if (bv == null) return sort.dir === "asc" ? 1 : -1;
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [patients, filters, sort]);

  /* ------------ Pagination ------------ */
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(page, pages);
  const startIdx = (current - 1) * perPage;
  const endIdx = Math.min(startIdx + perPage, total);
  const rows = filtered.slice(startIdx, endIdx);

  useEffect(() => setPage(1), [filters, perPage]);

  /* ------------ UI Actions ------------ */
  const clearFilters = () =>
    setFilters(getInitialFiltersFromURL(new URLSearchParams()));
  const toggleSort = (key) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.status)
      chips.push({ k: "status", label: `Status: ${filters.status}` });
    if (filters.location)
      chips.push({ k: "location", label: `Branch: ${filters.location}` });
    if (filters.package)
      chips.push({ k: "package", label: `Package: ${filters.package}` });
    if (filters.counsellor)
      chips.push({
        k: "counsellor",
        label: `Counsellor: ${filters.counsellor}`,
      });
    if (filters.agent)
      chips.push({ k: "agent", label: `Agent: ${filters.agent}` });
    if (filters.paymentMethod)
      chips.push({
        k: "paymentMethod",
        label: `Pay: ${filters.paymentMethod}`,
      });
    if (filters.technique)
      chips.push({ k: "technique", label: `Technique: ${filters.technique}` });
    if (filters.doctor)
      chips.push({ k: "doctor", label: `Doctor: ${filters.doctor}` });
    if (filters.seniorTech)
      chips.push({
        k: "seniorTech",
        label: `Senior Tech: ${filters.seniorTech}`,
      });
    if (filters.implanter)
      chips.push({ k: "implanter", label: `Implanter: ${filters.implanter}` });
    if (filters.surgeryDate)
      chips.push({
        k: "surgeryDate",
        label: `Surgery: ${formatDate(filters.surgeryDate)}`,
      });
    if (filters.visited)
      chips.push({ k: "visited", label: "Visited Patients" });
    if (filters.readyForSurgery)
      chips.push({ k: "readyForSurgery", label: "Ready for Surgery" });

    if (filters.dateFrom)
      chips.push({ k: "dateFrom", label: `From: ${filters.dateFrom}` });
    if (filters.dateTo)
      chips.push({ k: "dateTo", label: `To: ${filters.dateTo}` });
    return chips;
  }, [filters]);

  const removeChip = (k) => setFilters((f) => ({ ...f, [k]: "" }));

  /* ------------ Render ------------ */
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
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
              <p className="text-sm text-gray-500">
                Manage and track patient records
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white shadow-sm hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterChips.length > 0 && (
                  <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {activeFilterChips.length}
                  </span>
                )}
              </button>
              <Link
                href="add-patient"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                + New Patient
              </Link>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterChips.length > 0 && (
            <div className="px-6 pb-3 flex flex-wrap gap-2">
              {activeFilterChips.map((c) => (
                <span
                  key={c.k}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
                >
                  {c.label}
                  <button
                    onClick={() => removeChip(c.k)}
                    className="hover:text-gray-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-600 hover:text-gray-900 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </header>

        {/* Search bar */}
        <div className="px-6 pt-4">
          <input
            type="text"
            placeholder="Search by name, phone, or email…"
            className="w-full md:w-96 px-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-200"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Table */}
        <section className="p-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                  <tr>
                    <Th label="Patient" />
                    <Th label="Contact" />
                    <Th label="Location" />
                    <Th
                      label="Visit Date"
                      sortKey="personal.visitDate"
                      sort={sort}
                      onSort={toggleSort}
                    />
                    <Th label="Status" />
                    <Th label="Package" />
                    <Th label="Others" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-gray-500"
                      >
                        No patients found
                      </td>
                    </tr>
                  ) : (
                    rows.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {p.personal?.name}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {p.personal?.phone}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {p.personal?.location}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {formatDate(p.personal?.visitDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              STATUS_COLORS[p?.ops?.status] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {p?.ops?.status?.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {p.personal?.package}
                        </td>

                        {/* ✅ Actions column */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/patients/${p._id}`}
                              className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600"
                              title="View details"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </Link>
                            <Link
                              href={`/admin/patients/${p._id}/edit`}
                              className="p-2 rounded-full hover:bg-blue-50 text-blue-600"
                              title="Edit patient"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828H9v-2.828z"
                                />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-gray-50">
              <p className="text-xs text-gray-600">
                Showing <b>{startIdx + 1}</b>–<b>{endIdx}</b> of <b>{total}</b>
              </p>
              <div className="flex items-center gap-3">
                <select
                  className="text-sm border rounded-md px-2 py-1"
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                >
                  {[10, 25, 50].map((n) => (
                    <option key={n} value={n}>
                      {n} / page
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={current <= 1}
                    className="p-2 rounded-md border bg-white disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-600 w-16 text-center">
                    {current} / {pages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={current >= pages}
                    className="p-2 rounded-md border bg-white disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Search & Filter</h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Quick filters */}
                <Section title="Quick Filters">
                  <Field label="Status">
                    <Select
                      value={filters.status}
                      onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
                      options={[
                        { label: "All", value: "" },
                        ...STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
                      ]}
                    />
                  </Field>
                  <Field label="Branch">
                    <Select
                      value={filters.location}
                      onChange={(v) =>
                        setFilters((f) => ({ ...f, location: v }))
                      }
                      options={[
                        { label: "All", value: "" },
                        ...LOCATION_OPTIONS.map((l) => ({
                          label: l,
                          value: l,
                        })),
                      ]}
                    />
                  </Field>
                  <Field label="Package">
                    <Select
                      value={filters.package}
                      onChange={(v) =>
                        setFilters((f) => ({ ...f, package: v }))
                      }
                      options={[
                        { label: "All", value: "" },
                        ...PACKAGE_OPTIONS.map((l) => ({ label: l, value: l })),
                      ]}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date From">
                      <Input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(v) =>
                          setFilters((f) => ({ ...f, dateFrom: v }))
                        }
                      />
                    </Field>
                    <Field label="Date To">
                      <Input
                        type="date"
                        value={filters.dateTo}
                        onChange={(v) =>
                          setFilters((f) => ({ ...f, dateTo: v }))
                        }
                      />
                    </Field>
                  </div>
                </Section>

                {/* Advanced */}
                <Section title="Advanced">
                  <Field label="Counsellor">
                    <Select
                      value={filters.counsellor}
                      onChange={(v) =>
                        setFilters((f) => ({ ...f, counsellor: v }))
                      }
                      options={[
                        { label: "All", value: "" },
                        ...counsellorOptions.map((c) => ({
                          label: c,
                          value: c,
                        })),
                      ]}
                    />
                  </Field>
                  <Field label="Agent (createdBy)">
                    <Input
                      placeholder="ID or name"
                      value={filters.agent}
                      onChange={(v) => setFilters((f) => ({ ...f, agent: v }))}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Payment Method">
                      <Select
                        value={filters.paymentMethod}
                        onChange={(v) =>
                          setFilters((f) => ({ ...f, paymentMethod: v }))
                        }
                        options={[
                          { label: "All", value: "" },
                          ...PAYMENT_METHODS.map((m) => ({
                            label: m,
                            value: m,
                          })),
                        ]}
                      />
                    </Field>
                    <Field label="Technique">
                      <Select
                        value={filters.technique}
                        onChange={(v) =>
                          setFilters((f) => ({ ...f, technique: v }))
                        }
                        options={[
                          { label: "All", value: "" },
                          ...techniqueOptions.map((t) => ({
                            label: t,
                            value: t,
                          })),
                        ]}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Doctor">
                      <Select
                        value={filters.doctor}
                        onChange={(v) =>
                          setFilters((f) => ({ ...f, doctor: v }))
                        }
                        options={[
                          { label: "All", value: "" },
                          ...doctorOptions.map((t) => ({ label: t, value: t })),
                        ]}
                      />
                    </Field>
                    <Field label="Senior Tech">
                      <Select
                        value={filters.seniorTech}
                        onChange={(v) =>
                          setFilters((f) => ({ ...f, seniorTech: v }))
                        }
                        options={[
                          { label: "All", value: "" },
                          ...seniorTechOptions.map((t) => ({
                            label: t,
                            value: t,
                          })),
                        ]}
                      />
                    </Field>
                  </div>

                  <Field label="Implanter">
                    <Select
                      value={filters.implanter}
                      onChange={(v) =>
                        setFilters((f) => ({ ...f, implanter: v }))
                      }
                      options={[
                        { label: "All", value: "" },
                        ...implanterOptions.map((t) => ({
                          label: t,
                          value: t,
                        })),
                      ]}
                    />
                  </Field>

                  <Field label="Surgery Date">
                    <Input
                      type="date"
                      value={filters.surgeryDate}
                      onChange={(v) =>
                        setFilters((f) => ({ ...f, surgeryDate: v }))
                      }
                    />
                  </Field>
                </Section>
              </div>

              <div className="px-5 py-3 border-t bg-gray-50 flex items-center justify-between">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                >
                  Reset
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* -------------------- Small UI atoms -------------------- */
function Th({ label, sortKey, sort, onSort }) {
  const isSortable = !!sortKey;
  const active = isSortable && sort?.key === sortKey;
  return (
    <th
      className={`px-6 py-3 text-left ${
        isSortable ? "cursor-pointer select-none" : ""
      }`}
      onClick={isSortable ? () => onSort(sortKey) : undefined}
    >
      <div className="inline-flex items-center gap-1">
        {label}
        {active && (
          <span className="text-[10px] text-gray-500">
            {sort.dir === "asc" ? "▲" : "▼"}
          </span>
        )}
      </div>
    </th>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="px-4 py-2 border-b text-sm font-semibold text-gray-800">
        {title}
      </div>
      <div className="p-4 grid grid-cols-1 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({ type = "text", value, onChange, placeholder }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
    >
      {options.map((o) => (
        <option key={`${o.label}-${o.value}`} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
