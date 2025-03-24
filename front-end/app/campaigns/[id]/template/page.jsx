"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import NavigationBar from '@/app/_components/NavigationBar';
import { useToken } from '@/app/contexts/TokenContext';
import Skeleton from 'react-loading-skeleton';

export default function CampaignEmailTemplate() {
  const { id } = useParams();
  const [campaignData, setCampaignData] = useState(null); // state mới
  const [loading, setLoading] = useState(true);
  const  { token } = useToken();

  const [selectedTemplate, setSelectedTemplate] = useState({
    id: 1,
    name: "Email Newsletter 05",
    lastModified: "2024-10-18",
    image: "http://localhost:8000/images/email_template.png",
  });
  
 useEffect(() => {
    if (id) {
      fetchCampaignData();
    }
  }, [id]);
// Hàm gọi API để lấy thông tin chiến dịch
const fetchCampaignData = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      setCampaignData(data); // Cập nhật campaignData
    
    } else {
      setError(data.message || 'Không thể tải thông tin chiến dịch');
    }
  } catch (error) {
    setError('Có lỗi khi tải thông tin chiến dịch');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="p-6 max-w-screen-lg mx-auto">
       {/* Breadcrumb */}
       <nav className="text-sm text-gray-500 mb-4">
        <ol className="flex space-x-2">
          <li><a href="/" className="hover:text-gray-900">Trang chủ</a></li>
          <li>/</li>
          <li><a href="/campaigns" className="hover:text-gray-900">Chiến dịch</a></li>
        </ol>
      </nav>
{/* Tiêu đề */}
<div className="mb-6">
        {loading ? (
          <Skeleton width={300} height={40} />
        ) : (
          <h1 className="text-3xl font-bold text-gray-900">
            {campaignData?.data.name || 'Chiến dịch chưa được đặt tên'}
          </h1>
        )}
      </div>

    {/* Tabs điều hướng */}

    <div className="flex space-x-6 border-b border-gray-300 pb-2 mb-4">
      <NavigationBar campaign={campaignData} />
    </div>


      {/* Main content */}
      <div className="container mx-auto py-8 px-6">
        <h2 className="text-xl font-bold mb-6">Quản lý nội dung</h2>
        <p className="text-gray-600 mb-4">
          Xây dựng nội dung thư mà bạn mong muốn gửi đi bằng trình soạn thảo nội dung của chúng tôi. Để tăng khả năng thư vào mục INBOX cần giữ cho thư gọn nhẹ và thông tin đầy đủ.
        </p>

        {/* Template Information */}
        <div className="flex items-start">
          <div className="w-2/3">
            <h3 className="text-lg font-semibold mb-2">HTML Email</h3>
            <p className="text-gray-500 mb-4">Chỉnh sửa lần cuối vào {selectedTemplate.lastModified}</p>

            {/* Buttons */}
            <div className="flex space-x-4">
            <Link href={`/campaigns/${id}/template/edit`}>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                Email Builder
              </button>
            </Link>
              <button className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400">
                Thay đổi mẫu
              </button>
            </div>
          </div>

          {/* Template Image */}
          <div className="w-1/3 ml-8">
            <img
              src={selectedTemplate.image}
              alt={selectedTemplate.name}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-10">
          <button className="bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900">
            Tiếp tục
          </button>
        </div>
      </div>

    
    </div>
  );
}
