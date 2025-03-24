'use client';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import CSS
import { useParams, useRouter } from 'next/navigation';
import { useToken } from '@/app/contexts/TokenContext';
import NavigationBar from '@/app/_components/NavigationBar';

export default function CampaignDetail() {
  const { id } = useParams();
  const  { token } = useToken();
  const router = useRouter();

  const [campaign, setCampaign] = useState(null);
  const [contactGroups, setContactGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // Cờ kiểm soát để tránh gọi lại API

  // Hàm fetch dữ liệu (kết hợp Campaign và Groups)
  const fetchCampaignAndGroups = async () => {
    try {
      const [campaignResponse, groupsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lists`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      ]);

      const campaignData = await campaignResponse.json();
      const groupsData = await groupsResponse.json();
      
      if (campaignResponse.ok) {
        setCampaign(campaignData);
        setSelectedGroupId(campaignData.data.contact_list_id || ''); // Gán giá trị liên kết
      } else {
        setError(campaignData.message || 'Không thể lấy thông tin chiến dịch');
      }

      if (groupsResponse.ok) {
        setContactGroups(groupsData.data.data);
      } else {
        setError(groupsData.message || 'Không thể lấy danh sách liên hệ');
      }
    } catch (error) {
      setError('Lỗi khi lấy thông tin');
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    if (id && !hasFetched) {
      setLoading(true);
      fetchCampaignAndGroups();
      setHasFetched(true); // Đảm bảo chỉ fetch 1 lần
    }
  }, [id, hasFetched]);

  // Hàm xử lý lưu và tiếp tục
  const handleSaveAndContinue = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact_list_id: selectedGroupId, // Lưu group đã chọn
        }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(`/campaigns/${id}/setup`); // Chuyển đến trang tiếp theo
      } else {
        setError(data.message || 'Có lỗi xảy ra khi cập nhật chiến dịch');
      }
    } catch (error) {
      setError('Lỗi khi lưu chiến dịch');
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
 
  return (
    <div className="p-6 max-w-screen-lg mx-auto ">
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
            {campaign?.data.name || 'Chiến dịch chưa được đặt tên'}
          </h1>
        )}
      </div>
  {/* Tabs điều hướng */}

      <div className="flex space-x-6 border-b border-gray-300 pb-2 mb-4">
          <NavigationBar campaign={campaign} />
      </div>

      {/* Nội dung */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {loading ? <Skeleton width={200} /> : 'Chọn một hoặc nhiều danh sách/nhóm để gửi email'}
        </h2>
        <div className="mt-4">
          <label className="text-gray-600 text-sm">
            {loading ? <Skeleton width={150} /> : 'Chọn danh sách/nhóm gửi đến'}
          </label>
          {loading ? (
            <Skeleton width={320} height={40} />
          ) : (
            <select
              className="w-80 mt-2 p-2 border border-gray-300 rounded-lg"
              value={selectedGroupId || ''}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              <option value="">Chọn</option>
              {Array.isArray(contactGroups) && contactGroups.length > 0 ? (
                contactGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.list_name} {group.id === selectedGroupId }
                  </option>
                ))
              ) : (
                <option>Không có danh sách nào</option>
              )}
            </select>
          )}
        </div>
      </div>

      {/* Nút lưu */}
      <div className="flex justify-end">
        <button
          className={`px-6 py-2 rounded-lg transition-all ${
            loading ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
          disabled={loading}
          onClick={handleSaveAndContinue}
        >
          {loading ? <Skeleton width={150} /> : 'Lưu và Tiếp tục →'}
        </button>
      </div>
    </div>
  );
}
