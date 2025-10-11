"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  ChevronDown,
  ChevronUp,
  Search,
  Users,
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function AgentDashboard() {
  const [activePage, setActivePage] = useState("Agents");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("week"); // day | week | month
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [agentsData, setAgentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch agents data
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/agents?filter=${timeFilter}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        if (data.success) {
          setAgentsData(data.data || []);
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching agents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [timeFilter]);

  // Filter + sort agents
  const filteredAgents = agentsData
    .filter((agent) =>
      agent.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.totalRevenue - b.totalRevenue
        : b.totalRevenue - a.totalRevenue
    );

  // Format INR currency
  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const toggleAgentDetails = (idx) => {
    setExpandedAgent(expandedAgent === idx ? null : idx);
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
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Agent Performance
            </h1>
            <p className="text-gray-600 mt-1">
              Track top performing agents and their sales
            </p>
          </div>
          <div className="flex gap-2">
            {["day", "week", "month"].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-lg ${
                  timeFilter === filter
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setTimeFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 my-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search agents..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {/* Loader / Error / No Data */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-xl text-red-700 text-center">
            Error loading data: {error}
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No agents found</h3>
            <p className="text-gray-500">Try changing filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent, idx) => (
              <div
                key={agent.name + idx}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                {/* Card header */}
                <div className="p-6 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
                      {agent.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-500">
                        Rank #{idx + 1} • {timeFilter}
                      </p>
                    </div>
                  </div>
                  <Trophy className="h-6 w-6 text-yellow-500" />
                </div>

                {/* Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {agent.totalPatients || 0}
                      </div>
                      <div className="text-xs text-gray-500">Patients</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-indigo-700">
                        {formatCurrency(agent.totalRevenue)}
                      </div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>

                  {/* Techniques sold */}
                  {agent.techniques && Object.keys(agent.techniques).length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Techniques Sold
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(agent.techniques).map(([tech, count]) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
                          >
                            {tech}: {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Expand button */}
                <div className="p-4 border-t bg-gray-50">
                  <button
                    className="text-sm text-indigo-600 hover:underline"
                    onClick={() => toggleAgentDetails(idx)}
                  >
                    {expandedAgent === idx ? "Hide Details" : "View Details"}
                  </button>

                  <AnimatePresence>
                    {expandedAgent === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 text-sm text-gray-600 overflow-hidden"
                      >
                        <p>Total Patients: {agent.totalPatients || 0}</p>
                        <p>Revenue: {formatCurrency(agent.totalRevenue)}</p>
                        <p>
                          Avg Revenue/Patient:{" "}
                          {formatCurrency(agent.avgRevenue || 0)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
