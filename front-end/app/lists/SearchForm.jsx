"use client"
import Link from 'next/link';

export default function SearchForm({onSearch }) {
  // Hàm xử lý tìm kiếm


  return (
    <div className="flex flex-wrap items-center justify-between p-4 border border-gray-300 rounded-lg mb-4">

      <div className="flex items-center space-x-2 mb-2 md:mb-0">
        <select className="border border-gray-300 rounded-lg p-2 focus:outline-none">
          <option>Ngày tạo</option>
          <option>Tên</option>
          <option>Trạng thái</option>
        </select>
      </div>

      <div className="flex-grow mx-4 mb-2 md:mb-0 md:max-w-sm w-full">
        <input
            type="search" 
            placeholder="Gõ và enter để tìm kiếm"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
          onChange={onSearch }
        />
      </div>
      <Link href="/lists/create" passHref>
  <button className="px-4 py-2 bg-gray-500 text-white rounded-lg w-full md:w-auto">
    + Tạo danh sách
  </button>
      </Link>

    </div>
  );
}
