"use client";
import React, { useState } from "react";
import { handleLogin } from "../action";

export default function Form() {
  const [message, setMessage] = useState(""); // Trạng thái lưu thông báo
  const [error, setError] = useState(""); // Trạng thái lưu thông báo lỗi

  return (
    <form
      className="space-y-4"
      action={async (formData) => {
        const response = await handleLogin(formData);

        // // Kiểm tra phản hồi và cập nhật thông báo
        // if (response.success) {
        //   setMessage(response.message); // Hiển thị thông báo thành công
        //   setError(""); // Xóa thông báo lỗi
        // } else {
        //   setError(response.message); // Hiển thị thông báo lỗi
        //   setMessage(""); // Xóa thông báo thành công
        // }
      }}
    >
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Email..."
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Mật khẩu
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Mật khẩu..."
          required
        />
      </div>

      {/* Hiển thị thông báo lỗi hoặc thành công */}
      {error && <div className="text-red-500 bg-red-100 p-2 rounded">{error}</div>}
      {message && !error && <div className="text-green-500 bg-green-100 p-2 rounded">{message}</div>}

      <button type="submit" className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors">
      Đăng Nhập
      </button>
    </form>
  );
}
