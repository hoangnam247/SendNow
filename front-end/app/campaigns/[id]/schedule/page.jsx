'use client'
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useParams, useRouter } from 'next/navigation';
import { useToken } from '@/app/contexts/TokenContext';
import NavigationBar from '@/app/_components/NavigationBar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';



dayjs.extend(utc);
dayjs.extend(timezone);

export default function CampaignDetail() {
  const { id } = useParams();
  const  { token } = useToken();
  const router = useRouter();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // Flag để tránh gọi lại API
 
  
  // Fetch dữ liệu chiến dịch
  const fetchCampaign = async () => {
    try {
      const response = await fetch(`${process.env.SERVER_API}/campaigns/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const campaignData = await response.json();

      if (response.ok) {
        setCampaign(campaignData);
      } else {
        setError(campaignData.message || 'Không thể lấy thông tin chiến dịch');
      }
    } catch (error) {
      setError('Lỗi khi lấy thông tin chiến dịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && !hasFetched) {
      setLoading(true);
      fetchCampaign();
      setHasFetched(true);
    }
  }, [id, hasFetched]);

  const [sendDate, setSendDate] = useState('');
  const [sendTime, setSendTime] = useState('');

  useEffect(() => {
    if (campaign) {
      const campaignTime = campaign?.data.scheduled_at || campaign?.data.created_at;
      if (campaignTime) {
        const campaignDateTime = dayjs(campaignTime).utc().tz('Asia/Ho_Chi_Minh');
        setSendDate(campaignDateTime.format('YYYY-MM-DD')); // Set ngày gửi
        setSendTime(campaignDateTime.format('HH:mm')); // Set thời gian gửi
      }
    }
  }, [campaign]);

  // Hàm lưu và tiếp tục
  const handleSaveAndContinue = async () => {
    try {
      const scheduledAt = dayjs(`${sendDate}T${sendTime}:00`)
      .tz('Asia/Ho_Chi_Minh')
      .format('YYYY-MM-DD HH:mm:ss');

      
      const response = await fetch(`${process.env.SERVER_API}/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduled_at: scheduledAt,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Chuyển hướng sang trang tiếp theo
        router.push(`/campaigns/${id}/setup`);
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

  // Lấy ngày và giờ hiện tại để giới hạn cho input
  const today = dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
  const currentTime = dayjs().tz('Asia/Ho_Chi_Minh').format('HH:mm');

  const handleDateChange = (e) => {
    setSendDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSendTime(e.target.value);
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
            {campaign?.data.name || 'Chiến dịch chưa được đặt tên'}
          </h1>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-6 border-b border-gray-300 pb-2 mb-4">
        <NavigationBar campaign={campaign} />
      </div>

      {/* Ngày và Thời gian gửi */}
      <div className="mb-6 text-sm text-gray-700">
        <div className="mb-4 flex flex-col space-y-2">
          <label htmlFor="sendDate" className="font-medium text-gray-800">Ngày gửi:</label>
          <input 
            id="sendDate"
            type="date" 
            value={sendDate} 
            onChange={handleDateChange} 
            min={today} // Giới hạn ngày quá khứ
            className="border p-1.5 rounded-md w-48 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="mb-4 flex flex-col space-y-2">
          <label htmlFor="sendTime" className="font-medium text-gray-800">Thời gian gửi:</label>
          <input 
            id="sendTime"
            type="time" 
            value={sendTime} 
            onChange={handleTimeChange} 
            min={currentTime} // Giới hạn giờ quá khứ
            className="border p-1.5 rounded-md w-48 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Nút Lưu và Tiếp tục */}
      <div className="mt-6 flex justify-end mt-48">
        <button
          onClick={handleSaveAndContinue}
          className="bg-[#1e293b] text-white px-6 py-3 rounded-full shadow-lg transform transition-all duration-300 hover:bg-[#020617] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Lưu và Tiếp tục
        </button>
      </div>
    </div>
  );
}
