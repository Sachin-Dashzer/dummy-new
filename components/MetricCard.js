"use client";

import { TrendingUp } from "lucide-react";

export default function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  onClick,
}) {
  return (
    <div
      className={`cursor-pointer transition-all hover:scale-105  ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`relative flex flex-col justify-between p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${color} overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-bold text-white/80">{title}</h3>
            <p className="text-4xl font-bold text-white mt-3">{value}</p>
          </div>
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 text-white/90 mr-1" />
            <span className="text-xs text-white/90">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
