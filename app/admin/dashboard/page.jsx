"use client";

import { useEffect, useState } from "react";
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
import { useFilterPatients } from "@/app/hooks/useFilters";





export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [timeRange, setTimeRange] = useState("Today");
  const [branch, setBranch] = useState("Delhi");

  // ✅ use hook directly
  const {patients , loading , error} = useFilterPatients("2025-09-02T00:00:00.000Z", "Delhi");


  const rowdata = patients;


  console.log(rowdata)

  const metricCards = [
    {
      title: "Appointments",
      value: rowdata?.appointments || 0,
      icon: Calendar,
      color: "from-indigo-500 to-indigo-600",
      trend: "+12% from yesterday",
    },
    {
      title: "Patients Visited",
      value: rowdata?.visited || 0,
      icon: Activity,
      color: "from-green-500 to-green-600",
      trend: "+8% from yesterday",
    },
    {
      title: "Surgery Confirmations",
      value: rowdata?.surgeryConfirmations || 0,
      icon: CheckCircle,
      color: "from-amber-500 to-amber-600",
      trend: "+5% from yesterday",
    },
    {
      title: "Surgeries",
      value: rowdata?.surgeries || 0,
      icon: Stethoscope,
      color: "from-rose-500 to-rose-600",
      trend: "+15% from yesterday",
    },
    {
      title: "Amount Received",
      value: rowdata?.amountReceived || 0,
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
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          branch={branch}
          setBranch={setBranch}
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
                />
              ))}
            </div>

            <ChartsSection data={rowdata?.allpatients} />
            <RecentActivity activities={rowdata?.recentActivities || []} />
          </>
        )}
      </main>
    </div>
  );
}
