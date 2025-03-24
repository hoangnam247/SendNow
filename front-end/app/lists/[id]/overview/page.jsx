'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/app/_components/NavigationBar_Lists';
import {
  UserGroupIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useToken } from '@/app/contexts/TokenContext';
import { fetchContacts, fetchLists } from '../../action';

import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
export default function ContactPage({ params }) {
  const { id } = params; // Lấy id từ params
  const [contacts, setContacts] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState({ lists: true, contacts: true });
  const [error, setError] = useState(null);
  const  { token } = useToken();
  const [monthlyData, setMonthlyData] = useState([]);
  const router = useRouter();

  // Gọi API để lấy danh sách
  useEffect(() => {
    async function loadLists() {
      try {
        setLoading((prev) => ({ ...prev, lists: true }));
        if (!token) {
          throw new Error('Token không hợp lệ hoặc bị thiếu.');
        }

        const listsData = await fetchLists(token);

        if (!Array.isArray(listsData) || listsData.length === 0) {
          throw new Error('Không có danh sách nào để hiển thị.');
        }

        setLists(listsData);

        // Kiểm tra nếu params.id không hợp lệ, điều hướng đến danh sách đầu tiên
        if (!id || !listsData.some((list) => list.id === parseInt(id, 10))) {
          const firstList = listsData[0];
          router.push(`/lists/${firstList.id}/subscribers`);
        }
      } catch (err) {
        console.error('Error in loadLists:', err.message);
        setError(err.message || 'Lỗi khi tải danh sách.');
      } finally {
        setLoading((prev) => ({ ...prev, lists: false }));
      }
    }

    if (token) loadLists();
  }, [token, id, router]);

  // Gọi API để lấy liên hệ dựa trên danh sách đã chọn
  useEffect(() => {
    async function loadContacts() {
      try {
        setLoading((prev) => ({ ...prev, contacts: true }));
        const contactsResponse = await fetchContacts(id, token);
  
        // Đặt toàn bộ response vào state hoặc chỉ `data`
        setContacts(contactsResponse); // Nếu muốn xử lý toàn bộ response
        // Hoặc
        // setContacts(contactsResponse.data); // Nếu chỉ cần `data`
      } catch (err) {
        console.error("Error in loadContacts:", err.message);
        setError(err.message || "Lỗi khi tải liên hệ.");
      } finally {
        setLoading((prev) => ({ ...prev, contacts: false }));
      }
    }
  
    if (id && token) loadContacts();
  }, [id, token]);
  
  // Gọi API để thống kê số liên hệ trong 4 tháng gần nhất
  useEffect(() => {
    async function fetchStatistics() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}/statistics`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
  
        const result = await response.json();
        setMonthlyData(result.data || []);
      } catch (err) {
        console.error("Error fetching statistics:", err);
      }
    }
  
    fetchStatistics();
  }, [id, token]);

  const calculateStatistics = () => {
    const approved = Array.isArray(contacts?.data)
      ? contacts.data.filter((contact) => contact.status === "approved").length
      : 0;
    const rejected = Array.isArray(contacts?.data)
      ? contacts.data.filter((contact) => contact.status === "rejected").length
      : 0;
  
    return { approved, rejected };
  };
  
 
// Lấy dữ liệu thống kê
const stats = calculateStatistics();
   // Dữ liệu cho Bar Chart
// Hàm lấy 4 tháng gần nhất
const getLastFourMonths = () => {
  const now = new Date();
  const months = [];

  for (let i = 3; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.toLocaleString("default", { month: "2-digit" }); // MM
    const year = date.getFullYear(); // YYYY
    months.push(`${month}/${year}`); // Định dạng MM/YYYY
  }

  return months;
};
// Lấy 4 tháng gần nhất
const lastFourMonths = getLastFourMonths();


// Gắn dữ liệu từ API vào các tháng
const formattedData = lastFourMonths.map((month) => {
  const dataForMonth = monthlyData.find((item) => item.month === month); // Tìm dữ liệu cho tháng
  return {
    month,
    count: dataForMonth ? dataForMonth.count : 0, // Mặc định là 0 nếu không có dữ liệu
  };
});
const barChartData = {
  labels: formattedData.map((item) => item.month), // Nhãn tháng
  datasets: [
    {
      label: "Số lượng tài khoản",
      data: formattedData.map((item) => item.count), // Dữ liệu số lượng tài khoản
      backgroundColor: "#4fd1c5", // Màu xanh cho tất cả các cột
      borderWidth: 1,
    },
  ],
};


  // Cấu hình cho Bar Chart
  const barChartOptions = {
    responsive: true, // Biểu đồ tự động điều chỉnh kích thước
    maintainAspectRatio: false, // Không giữ tỷ lệ khung hình mặc định
    plugins: {
      legend: {
        display: true, // Hiển thị chú thích
        position: "top", // Vị trí chú thích: top, bottom, left, right
        labels: {
          font: {
            size: 14, // Kích thước font chữ của chú thích
          },
          color: "#4A5568", // Màu chữ của chú thích
        },
      },
      tooltip: {
        enabled: true, // Hiển thị tooltip khi hover
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            return `Số lượng: ${value}`; // Tùy chỉnh nội dung tooltip
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Ẩn đường lưới trục X
        },
        title: {
          display: true, // Hiển thị tiêu đề trục X
          text: "Tháng", // Nội dung tiêu đề
          font: {
            size: 14, // Kích thước chữ
          },
          color: "#4A5568", // Màu chữ
        },
        ticks: {
          font: {
            size: 12, // Kích thước chữ của nhãn
          },
          color: "#2D3748", // Màu chữ của nhãn
        },
      },
      y: {
        beginAtZero: true, // Bắt đầu từ giá trị 0
        grid: {
          color: "#E2E8F0", // Màu của đường lưới
          borderDash: [5, 5], // Đường kẻ dạng nét đứt
        },
        title: {
          display: true, // Hiển thị tiêu đề trục Y
          text: "Số lượng tài khoản", // Nội dung tiêu đề
          font: {
            size: 14, // Kích thước chữ
          },
          color: "#4A5568", // Màu chữ
        },
        ticks: {
          font: {
            size: 12, // Kích thước chữ của nhãn
          },
          color: "#2D3748", // Màu chữ của nhãn
        },
      },
    },
  };

 // Dữ liệu cho Pie Chart
 const pieChartData = {
    labels: ['Đã đăng ký', 'Đã hủy đăng ký'], // Nhãn
    datasets: [
      {
        data: [stats.approved, stats.rejected],
        backgroundColor: ['#4fd1c5', '#c53030'], // Màu sắc cho từng phần
        hoverBackgroundColor: ['#319795', '#9b2c2c'], // Màu khi hover
      },
    ],
  };

 
  // Tùy chỉnh Pie Chart
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Đặt chú thích ở trên
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const dataIndex = tooltipItem.dataIndex;
            const value = tooltipItem.raw;
            const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const calculateRates = () => {
    const total = stats.approved + stats.rejected;
    const approvalRate = total > 0 ? ((stats.approved / total) * 100).toFixed(2) : 0; // Tỷ lệ đăng ký
    const rejectionRate = total > 0 ? ((stats.rejected / total) * 100).toFixed(2) : 0; // Tỷ lệ hủy đăng ký
    const totalRejections = stats.rejected; // Tổng số lượt hủy đăng ký
    return { approvalRate, rejectionRate, totalRejections };
  };

  const rates = calculateRates();
  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <nav className="text-sm text-gray-500 mb-4">
  <ol className="flex space-x-2 items-center">
    <li>
      <a href="/" className="hover:text-gray-900">Trang chủ</a>
    </li>
    <li>/</li>
    <li>
      <a href="/lists" className="hover:text-gray-900">Danh sách</a>
    </li>
    <li>/</li>
    <li className="text-gray-900">
      {loading.lists ? (
        // Skeleton khi danh sách đang tải
        <div className="animate-pulse w-48 h-8 bg-gray-300 rounded"></div>
      ) : (
        <select
          className="bg-transparent border-none text-gray-700 font-semibold py-2 px-4 inline-flex items-center"
          onChange={(e) => {
            const selectedId = e.target.value;
            router.push(`/lists/${selectedId}/subscribers`);
          }}
          value={id || ''}
          disabled={loading.lists}
        >
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.list_name} - {list.contacts_count} Liên hệ
            </option>
          ))}
        </select>
      )}
    </li>
  </ol>
</nav>
{/* Hiển thị tên danh sách và số lượng liên hệ */}
    <div className="mb-6">
      {loading.lists ? (
        // Skeleton Loading
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      ) : lists.length > 0 && id ? (
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {lists.find((list) => list.id === parseInt(id, 10))?.list_name || 'Danh sách không tồn tại'}
          </h1>
          <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white text-lg font-bold">
        {lists.find((list) => list.id === parseInt(id, 10))?.contacts_count || 0}
      </div>
      <p className="text-gray-700 text-lg font-medium">
        <span className="text-gray-500">Liên hệ</span>
      </p>
    </div>

        </div>
      ) : (
        <p className="text-gray-500">Không có thông tin về danh sách liên hệ.</p>
      )}
    </div>

      <NavigationBar />

    <div className="mt-6 flex items-center justify-between bg-gray-100 rounded-lg p-4 mb-4 shadow">
      <div className="flex items-center space-x-3">
        <ChartBarIcon   className="h-8 w-8 text-teal-500" />
        <h1 className="text-2xl font-bold text-gray-800">Thống kê hiệu suất</h1>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3">
        {/* Tỷ lệ đăng ký */}
        <div className="bg-gray-500 text-white p-4 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold">{rates.approvalRate}%</h2>
          <p className="text-sm">Tỷ lệ đăng ký</p>
        </div>

        {/* Tỷ lệ hủy đăng ký */}
        <div className="bg-gray-500 text-white p-4 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold">{rates.rejectionRate}%</h2>
        <p className="text-sm">Tỷ lệ hủy đăng ký</p>
        </div>

        {/* Tổng lượt hủy đăng ký */}
        <div className="bg-gray-500 text-white p-4 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold">{rates.totalRejections}</h2>
        <p className="text-sm">Tổng lượt hủy đăng ký</p>
        </div>
      </div>
        <div className="grid grid-cols-2 gap-6">
        {/* Biểu đồ tăng trưởng */}
        <div
            className="p-4 bg-white shadow rounded flex items-center "
            style={{ height: '400px', width: '400px' }} // Giảm kích thước Bar Chart
        >
            <h2 className="text-lg font-semibold mb-4">Liên hệ</h2>
            <Bar
            data={barChartData}
            options={{
                ...barChartOptions,
                maintainAspectRatio: false,
            }}
            />
        </div>

        {/* Biểu đồ tỷ lệ */}
        <div
        className="p-4 bg-white shadow rounded flex items-center "
        style={{ height: '400px', width: '400px' }} // Giảm kích thước của biểu đồ
        >
            <h2 className="text-lg font-semibold mb-4">Liên hệ</h2>
        <Pie
            data={pieChartData}
            options={{
            ...pieChartOptions,
            maintainAspectRatio: false, // Tắt tỷ lệ khung hình mặc định để hỗ trợ tùy chỉnh
            }}
        />
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}
