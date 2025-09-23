"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Activity,
  CheckCircle,
  Stethoscope,
  Wallet,
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import MetricCard from "../../../components/MetricCard";
import ChartsSection from "../../../components/ChartsSection";
import RecentActivity from "../../../components/RecentActivity";

export default function AdminDashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Branch + Date states
  const [branch, setBranch] = useState("All");
  const [dateRange, setDateRange] = useState("Today");
  const [customDates, setCustomDates] = useState({ from: "", to: "" });

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // --- Date helpers ---
  const getToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0, 0);
    return d;
  };

 const getWeekRange = () => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // end of today

  const last7 = new Date();
  last7.setDate(today.getDate() - 6); // go back 6 days
  last7.setHours(0, 0, 0, 0); // start of that day

  return { from: last7, to: today };
};

  // --- Build payload for API ---
  const buildPayload = () => {
    let fromDate = getToday();
    let toDate = getToday();

    if (dateRange === "Yesterday") {
      fromDate = getYesterday();
      toDate = getYesterday();
    } else if (dateRange === "Last 7 Days") {
      const { from, to } = getWeekRange();
      fromDate = from;
      toDate = to;
    } else if (dateRange === "Custom" && customDates.from) {
      fromDate = new Date(customDates.from);
      toDate = customDates.to
        ? new Date(customDates.to)
        : new Date(customDates.from);
    }

    return {
      branch,
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    };
  };

  // --- Fetch dashboard data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const payload = buildPayload();
      const res = await fetch("/api/patients/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Call API on mount + whenever filters change ---
  useEffect(() => {
    fetchData();
  }, [branch, dateRange, customDates]);

  // --- Metric click navigation ---
  const handleMetricClick = (metricTitle) => {
    if (!dashboardData) return;

    const from = dashboardData.dateRange.from + 1;
    const to = dashboardData.dateRange.to;

    let filterParams = `dateFrom=${from}&dateTo=${to}&branch=${dashboardData.branch}`;

    switch (metricTitle) {
      case "Surgery Ready":
        filterParams += "&status=READY";
        break;
      case "Today's Surgeries":
        filterParams += "&status=POST_OP";
        break;
      default:
        break;
    }
    router.push(`/admin/patients?${filterParams}`);
  };

  // --- Metrics ---
  const metricCards = [
    {
      title: "Appointments",
      value: dashboardData?.appointments?.[0] || 0,
      icon: Calendar,
      color: "from-indigo-500 to-indigo-600",
      trend: "+12% from yesterday",
    },
    {
      title: "Patients Visited",
      value: dashboardData?.visited?.[0] || 0,
      icon: Activity,
      color: "from-green-500 to-green-600",
      trend: "+8% from yesterday",
    },
    {
      title: "Surgery Ready",
      value: dashboardData?.surgeryConfirmations?.[0] || 0,
      icon: CheckCircle,
      color: "from-amber-500 to-amber-600",
      trend: "+5% from yesterday",
    },
    {
      title: "Today's Surgeries",
      value: dashboardData?.surgeries?.[0] || 0,
      icon: Stethoscope,
      color: "from-rose-500 to-rose-600",
      trend: "+15% from yesterday",
    },
    {
      title: "Amount Received",
      value: dashboardData?.amountReceived || 0,
      icon: Wallet,
      color: "from-purple-500 to-purple-600",
      trend: "+22% from yesterday",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="flex-1 p-4 lg:p-8">
        <Topbar
          setSidebarOpen={setSidebarOpen}
          timeRange={dateRange}
          setTimeRange={setDateRange}
          branch={branch}
          setBranch={setBranch}
          customDates={customDates}
          setCustomDates={setCustomDates}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {metricCards.map((card, index) => (
                <MetricCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  color={card.color}
                  trend={card.trend}
                  onClick={() => handleMetricClick(card.title)}
                />
              ))}
            </div>

            <ChartsSection data={dashboardData?.appointments?.[1] || []} />
            <RecentActivity activities={dashboardData?.visited?.[1] || []} />
          </>
        )}
      </main>
    </div>
  );
}
