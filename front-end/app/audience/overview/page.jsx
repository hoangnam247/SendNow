import React from 'react'
import GrowthChart from "@/app/_components/GrowthChart";
export default function Overview() {
  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Quản lý khách hàng</h1>
        <p className="text-gray-600">Quản lý dữ liệu tăng trưởng khách hàng.</p>
        <p className="text-gray-600">Khi bạn thêm 1 liên hệ hoặc bằng cách thêm 1 chiến dịch gửi. Hệ thống sẽ tiến hành xử lý và cung cấp dữ lệu mới.</p>
      </div>
      <GrowthChart />
    </div>
  );
}