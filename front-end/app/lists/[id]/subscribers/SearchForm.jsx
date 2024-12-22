// components/SearchForm.jsx
import React from 'react';

export default function SearchForm() {
  return (
    <div className="flex flex-wrap items-center justify-between mb-4">
      <div className="flex space-x-2">
        <select className="border border-gray-300 rounded-lg p-2 focus:outline-none">
          <option>Email</option>
        </select>
        <select className="border border-gray-300 rounded-lg p-2 focus:outline-none">
          <option>Tất cả liên hệ</option>
        </select>
      </div>
      <div className="flex-grow mx-4 max-w-sm">
        <input
          type="text"
          placeholder="Gõ và enter để tìm kiếm"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
        />
      </div>
    </div>
  );
}

