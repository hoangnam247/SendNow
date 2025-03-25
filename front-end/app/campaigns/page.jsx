'use client';
import React, { useState, useEffect } from 'react';
import { useToken } from '../contexts/TokenContext';
import Link from 'next/link';
import dayjs from 'dayjs'; // Import dayjs
import { useRouter } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import style

export default function CampaignPage() {
  const  { token } = useToken();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [lists, setLists] = useState([]); // Danh sách các chiến dịch
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [query, setQuery] = useState(''); // Từ khóa tìm kiếm
  const router = useRouter();

  
  // Hàm để tạo chiến dịch với giá trị mặc định
  const createCampaign = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Token cần thiết để xác thực
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: 'Chiến dịch chưa được đặt tên', // Giá trị mặc định cho name
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Chiến dịch đã được tạo thành công!');
        setError(null);

        const campaignId = data.id; // Lấy ID của chiến dịch vừa tạo        
        // Điều hướng đến trang recipients của campaign mới
        router.push(`/campaigns/${campaignId}/recipients`);
      } else {
        setError(data.message || 'Có lỗi xảy ra khi tạo chiến dịch');
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError('Có lỗi xảy ra khi tạo chiến dịch');
    }
  };

  // Hàm lấy danh sách chiến dịch từ API với phân trang và tìm kiếm
  useEffect(() => {
    const getLists = async (query = '', page = 1) => {
      setLoading(true); // Bật trạng thái đang tải
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns?q=${query}&page=${page}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          }
        );
        const data = await response.json();

        // Cập nhật danh sách chiến dịch và thông tin phân trang
        setLists(data.data.data); // Cập nhật danh sách
        setTotalPages(data.data.last_page); // Cập nhật tổng số trang
        setCurrentPage(data.data.current_page); // Cập nhật trang hiện tại
      } catch (error) {
        setError('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false); // Tắt trạng thái đang tải sau khi gọi API xong
      }
    };

    getLists(query, currentPage); // Gọi API khi trang load hoặc tìm kiếm thay đổi

  }, [query, currentPage, token]);

  const formatDate = (dateString) => {
    return dayjs(dateString).locale('vi').format('DD-MM-YYYY, HH:mm:ss'); // Định dạng ngày tháng cho Việt Nam
  };

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
            <nav className="text-sm text-gray-500 mb-4">
        <ol className="flex space-x-2 items-center">
          <li>
            <a href="/" className="hover:text-gray-900">
              Trang chủ
            </a>
          </li>
        </ol>
      </nav>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
  {/* Title Section */}
  <h1 className="text-3xl font-semibold flex items-center space-x-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6 text-gray-700"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
        <span>Chiến dịch</span>
      </h1>

      {/* Button Section */}
      <button
        className="bg-teal-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-teal-600 transition duration-200 ease-in-out flex items-center space-x-2"
        onClick={createCampaign}
        title="Tạo chiến dịch mới" // Tooltip for accessibility
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        <span>Tạo chiến dịch</span>
      </button>
    </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <select className="border border-gray-300 rounded-lg p-2">
            <option>Sắp xếp</option>
          </select>
          <select className="border border-gray-300 rounded-lg p-2">
            <option>Ngày tạo</option>
          </select>
        </div>

        <div className="flex-grow mx-4">
          <input
            type="text"
            placeholder="Gõ và enter để tìm kiếm"
            className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Cập nhật query khi nhập tìm kiếm
          />
        </div>
      </div>

     {/* Campaign List */}
{loading ? (
  // Hiển thị Skeleton khi đang tải dữ liệu
  <div className="space-y-4">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton circle width={20} height={20} />
            <div>
              <Skeleton width={200} height={20} />
              <Skeleton width={150} height={15} className="mt-2" />
            </div>
          </div>
          <Skeleton width={60} height={30} className="rounded-full" />
          <Skeleton width={100} height={40} className="ml-4" />
        </div>
      </div>
    ))}
  </div>
) : (
  lists.length > 0 && lists.map((campaign) => (
    <div key={campaign.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
          <div>
            <Link href={`/campaigns/${campaign.id}/recipients`}>
              <h3 className="text-teal-600 font-semibold cursor-pointer hover:underline">
                {campaign.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500">
              Cập nhật: {formatDate(campaign.updated_at)}
            </p>
          </div>
        </div>
        <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-sm">MỚI</span>
        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-600 transition duration-200 ease-in-out">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
          <span>Chỉnh sửa</span>
        </button>
      </div>
    </div>
  ))
)}

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
        <select className="border border-gray-300 rounded-lg p-2" onChange={(e) => getLists(query, e.target.value)}>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
        <p className="text-sm">Trang {currentPage} của {totalPages}</p>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Trang trước</button>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>Trang sau</button>
      </div>
    </div>
  );
}
