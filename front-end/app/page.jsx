import React from 'react'

export default function HomePage() {
  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      {/* Chào mừng người dùng */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Xin chào, Hoàng Nam!</h1>
        <p className="text-gray-600">Chào mừng bạn đã quay trở lại.</p>
      </div>
          <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2m16-8V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v1" />
        </svg>
        Tài nguyên sử dụng
      </h2>
      <p className="text-gray-600 mb-4">Dưới đây là tóm tắt về sử dụng dịch vụ của bạn</p>

      {/* Hạn mức và Chiến dịch nằm cùng một hàng (2 cột) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Hạn mức */}
        <div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Hạn mức</span>
            <span>2/150</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-lg mt-2">
            <div className="w-0 bg-blue-500 h-2 rounded-lg"></div>
          </div>
          <div className="text-sm text-gray-500 mt-1">0.00%</div>
        </div>

        {/* Chiến dịch */}
        <div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Chiến dịch</span>
            <span>1/10</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-lg mt-2">
            <div className="w-1/10 bg-blue-500 h-2 rounded-lg"></div>
          </div>
          <div className="text-sm text-gray-500 mt-1">10%</div>
        </div>
      </div>

      {/* Danh sách và Liên hệ nằm cùng một hàng (2 cột) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Danh sách */}
        <div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Danh sách</span>
            <span>2/5</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-lg mt-2">
            <div className="w-2/5 bg-blue-500 h-2 rounded-lg"></div>
          </div>
          <div className="text-sm text-gray-500 mt-1">40%</div>
        </div>

        {/* Liên hệ */}
        <div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Liên hệ</span>
            <span>4/1,000</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-lg mt-2">
            <div className="w-1/250 bg-blue-500 h-2 rounded-lg"></div>
          </div>
          <div className="text-sm text-gray-500 mt-1">0.4%</div>
        </div>
      </div>
    </div>


      {/* Thống kê tổng các chiến dịch */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v4a2 2 0 002 2h3l3 3v-6H5a2 2 0 00-2 2V7m13-2v4m0-4H7m6 0v10m2-10h2m2 0h2m2 0h-2" />
          </svg>
          Thống kê tổng các chiến dịch
        </h2>
        <p className="text-gray-600 mb-4">Dưới đây là thống kê tổng các chiến dịch của bạn (Không bao gồm chiến dịch tự động)</p>

        {/* Các ô thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-100 rounded-lg shadow text-center">
            <p className="text-3xl font-semibold">0</p>
            <p className="text-gray-600">Đã gửi</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow text-center">
            <p className="text-3xl font-semibold">0</p>
            <p className="text-gray-600">Đã mở</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow text-center">
            <p className="text-3xl font-semibold">0</p>
            <p className="text-gray-600">Đã nhấp chuột</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow text-center">
            <p className="text-3xl font-semibold">0</p>
            <p className="text-gray-600">Bị trả lại</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow text-center">
            <p className="text-3xl font-semibold">0</p>
            <p className="text-gray-600">Hủy đăng ký</p>
          </div>
        </div>
      </div>
    </div>
  );
}