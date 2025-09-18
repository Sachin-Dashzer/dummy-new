"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";

export default function ChartsSection({ data }) {
  const [chartComponents, setChartComponents] = useState({ Bar: null, Line: null, Doughnut: null });
  const [chartJS, setChartJS] = useState(null);
  const [activeChart, setActiveChart] = useState("weekly"); // "weekly" or "methods"

  useEffect(() => {
    // Dynamically import Chart.js components only on client side
    const loadCharts = async () => {
      try {
        // Import Chart.js
        const ChartJS = await import('chart.js');
        const { Bar, Line, Doughnut } = await import('react-chartjs-2');
        
        // Register Chart.js components
        ChartJS.Chart.register(
          ChartJS.CategoryScale,
          ChartJS.LinearScale,
          ChartJS.BarElement,
          ChartJS.LineElement,
          ChartJS.PointElement,
          ChartJS.Title,
          ChartJS.Tooltip,
          ChartJS.Legend,
          ChartJS.ArcElement
        );

        setChartComponents({ Bar, Line, Doughnut });
        setChartJS(ChartJS);
      } catch (error) {
        console.error('Error loading charts:', error);
      }
    };

    loadCharts();
  }, []);

  const { Bar, Line, Doughnut } = chartComponents;

  // Check if data is available and extract the items array
  const items = data || [];
  
  if (!items.length || !items[0]?.payments?.transactions) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
          <div className="text-gray-500">Loading data...</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="text-gray-500">Loading data...</div>
        </div>
      </div>
    );
  }

  // Get all transactions across all items
  const allTransactions = items.flatMap(item => 
    item.payments?.transactions.map(transaction => ({
      ...transaction,
      date: new Date(transaction.date)
    })) || []
  );

  // Calculate last 7 days
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }).reverse();

  // Calculate daily revenue for the last 7 days
  const dailyRevenue = last7Days.map(date => {
    const revenue = allTransactions
      .filter(transaction => transaction.date.toISOString().split('T')[0] === date)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return revenue;
  });

  // Format date labels for display (e.g., "Sep 12")
  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Weekly revenue chart data
  const weeklyChartData = {
    labels: last7Days.map(formatDateLabel),
    datasets: [
      {
        label: "Daily Revenue (₹)",
        data: dailyRevenue,
        backgroundColor: "rgba(99,102,241,0.2)",
        borderColor: "rgba(99,102,241,1)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "rgba(99,102,241,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(99,102,241,1)",
      },
    ],
  };

  const weeklyChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#4B5563" },
        grid: { color: "#F3F4F6" }
      },
      x: {
        ticks: { color: "#4B5563" },
        grid: { display: false }
      },
    },
  };

  // Get all payment methods and their total amounts
  const paymentMethodTotals = {};
  
  items.forEach(item => {
    if (item.payments?.transactions) {
      item.payments.transactions.forEach(transaction => {
        if (paymentMethodTotals[transaction.method]) {
          paymentMethodTotals[transaction.method] += transaction.amount;
        } else {
          paymentMethodTotals[transaction.method] = transaction.amount;
        }
      });
    }
  });

  const barChartData = {
    labels: Object.keys(paymentMethodTotals),
    datasets: [
      {
        label: "Revenue (₹)",
        data: Object.values(paymentMethodTotals),
        backgroundColor: [
          "rgba(99,102,241,0.8)",
          "rgba(139,92,246,0.8)",
          "rgba(168,85,247,0.8)",
          "rgba(217,70,239,0.8)",
          "rgba(236,72,153,0.8)",
          "rgba(239,68,68,0.8)",
        ],
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: { color: "#4B5563" },
        grid: { color: "#F3F4F6" }
      },
      x: {
        ticks: { color: "#4B5563" },
        grid: { display: false }
      },
    },
  };

  const doughnutData = {
    labels: Object.keys(paymentMethodTotals),
    datasets: [
      {
        data: Object.values(paymentMethodTotals),
        backgroundColor: [
          "rgba(99,102,241,0.8)",
          "rgba(139,92,246,0.8)",
          "rgba(168,85,247,0.8)",
          "rgba(217,70,239,0.8)",
          "rgba(236,72,153,0.8)",
          "rgba(239,68,68,0.8)",
        ],
        borderWidth: 0,
        hoverOffset: 12,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Weekly Revenue Chart */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Weekly Revenue
          </h2>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-md text-sm ${activeChart === "weekly" ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:bg-gray-100"}`}
              onClick={() => setActiveChart("weekly")}
            >
              Weekly
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${activeChart === "methods" ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:bg-gray-100"}`}
              onClick={() => setActiveChart("methods")}
            >
              By Method
            </button>
            
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          {Line && activeChart === "weekly" ? (
            <Line data={weeklyChartData} options={weeklyChartOptions} />
          ) : Bar && activeChart === "methods" ? (
            <Bar data={barChartData} options={barChartOptions} />
          ) : (
            <div className="text-gray-500">Loading Chart...</div>
          )}
        </div>
      </div>

      {/* Revenue Distribution Chart */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Revenue Distribution
          </h2>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <div className="h-64 flex items-center justify-center">
          {Doughnut ? (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          ) : (
            <div className="text-gray-500">Loading Chart...</div>
          )}
        </div>
      </div>
    </div>
  );
}