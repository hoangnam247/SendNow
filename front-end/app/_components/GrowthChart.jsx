"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
    ArrowTrendingUpIcon 
  } from '@heroicons/react/24/outline'; 

const data = [
  { date: "23 Nov", total: 0, unsubscribed: 0 },
  { date: "23 Dec", total: 0, unsubscribed: 0 },
  { date: "24 Jan", total: 0, unsubscribed: 0 },
  { date: "24 Feb", total: 0, unsubscribed: 0 },
  { date: "24 Mar", total: 0, unsubscribed: 0 },
  { date: "24 Apr", total: 0, unsubscribed: 0 },
  { date: "24 May", total: 0, unsubscribed: 0 },
  { date: "24 Jun", total: 0, unsubscribed: 0 },
  { date: "24 Jul", total: 0, unsubscribed: 0 },
  { date: "24 Aug", total: 0, unsubscribed: 0 },
  { date: "24 Sep", total: 0, unsubscribed: 0 },
  { date: "24 Oct", total: 0, unsubscribed: 0 },
  { date: "24 Nov", total: 0, unsubscribed: 0 },
  { date: "24 Dec", total: 3, unsubscribed: 3 },
  { date: "25 Jan", total: 4, unsubscribed: 4 },
];

const GrowthChart = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-x-2 mb-2">
    <ArrowTrendingUpIcon className="h-8 w-8 text-gray-500" />
          Tăng trưởng khách hàng
    </h2>
      <p className="text-gray-600 mb-6">
        Biểu đồ tăng trưởng khách hàng qua mốc thời gian
      </p>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="unsubscribed" stroke="#B45309" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;
