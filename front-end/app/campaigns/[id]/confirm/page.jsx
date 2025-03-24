"use client"
import NavigationBar from '@/app/_components/NavigationBar';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToken } from '@/app/contexts/TokenContext';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import CSS
export default function Home() {
    const { id } = useParams();
    const  { token } = useToken();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
      
    useEffect(() => {
      if (!id) return; // Tránh gọi API nếu `id` không tồn tại
  
      const fetchCampaign = async () => {
        try {
          const campaignResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          const campaignData = await campaignResponse.json();
  
          if (campaignResponse.ok) {
            setCampaign(campaignData);
            setSelectedGroupId(campaignData.data.contact_list_id || ''); // Gán giá trị liên kết
          } else {
            setError(campaignData.message || 'Không thể lấy thông tin chiến dịch');
          }
        } catch (error) {
          setError('Lỗi khi lấy thông tin');
        } finally {
          setLoading(false);
        }
      };
  
      setLoading(true); // Set loading trước khi bắt đầu fetch
      fetchCampaign(); // Gọi API khi `id` có giá trị
  
    }, [id, token]); // Dependency array chỉ chứa `id` và `token`
      
      const currentDate = new Date();
      const scheduledDate = campaign?.data.scheduled_at ? new Date(campaign?.data.scheduled_at) : null;

      let diffDays = 0;
      let diffHours = 0;
      let diffMinutes = 0;
      let diffSeconds = 0;
      
      if (scheduledDate) {
          const diffTime = scheduledDate - currentDate; // Chênh lệch thời gian tính theo mili giây
          diffDays = diffTime / (1000 * 60 * 60 * 24); // Chuyển đổi mili giây thành ngày
      
          if (diffDays < 1) {
              // Nếu dưới 1 ngày, tính giờ
              diffHours = diffTime / (1000 * 60 * 60); // Chuyển đổi mili giây thành giờ
      
              if (diffHours < 1) {
                  // Nếu dưới 1 giờ, tính phút
                  diffMinutes = diffTime / (1000 * 60); // Chuyển đổi mili giây thành phút
      
                  if (diffMinutes < 1) {
                      // Nếu dưới 1 phút, tính giây
                      diffSeconds = diffTime / 1000; // Chuyển đổi mili giây thành giây
                  }
              }
          }
      }

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
    <div className="flex space-x-6 border-b border-gray-300 pb-2 mb-4">
          <NavigationBar campaign={campaign} />
      </div>
      <h1 className="text-2xl font-bold text-center mb-4">
        {loading ? <Skeleton width={200} height={30} /> : 'Chiến dịch đã sẵn sàng để gửi!'}
      </h1>      
      <p className="text-center text-gray-600 mb-6">
        {loading ? <Skeleton width={300} height={20} /> : 'Xem lại phần hồi bên dưới trước khi gửi chiến dịch của bạn.'}
      </p>
      <div className="bg-white shadow-xl rounded-lg p-6">
        
        {/* Cài đặt */}
        <div className="p-4 border-b flex justify-between items-center ">
          <div className="flex-1">
            <p className="font-semibold text-xl">
              {loading ? <Skeleton width={100} height={20} /> : 'Cài đặt'}
            </p>
            <p className="text-gray-500 text-sm">
              {loading ? <Skeleton width={200} height={15} /> : campaign?.data.subject}
            </p>          </div>

            <button className=" button-primary bg-gray-500 text-white px-4 py-2 rounded-md text-xl hover:bg-gray-700">
            {loading ? <Skeleton width={100} height={20} /> : 'Chỉnh sửa'}
          </button>        
        </div>
        
        {/* Mẫu Email */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex-1">
          <p className="font-semibold text-xl">
              {loading ? <Skeleton width={100} height={20} /> : 'Mẫu Email'}
            </p>
            <p className="text-gray-500 text-sm">
              {loading ? <Skeleton width={200} height={15} /> : campaign?.data.name}
            </p>
          </div>

          <button className="bg-gray-500 text-white px-4 py-2 rounded-md text-xl hover:bg-gray-700">
            {loading ? <Skeleton width={100} height={20} /> : 'Chỉnh sửa'}
          </button>        
        </div>

        {/* Đặt lịch gửi */}
        <div className="p-4 flex justify-between items-center">
          <div className="flex-1">
          <p className="font-semibold text-xl">
            {loading ? (
                <Skeleton width={150} height={20} />
            ) : (
                scheduledDate ? (
                    
                // Kiểm tra và hiển thị kết quả so với thời gian hiện tại
                diffDays > 1 ? (
                     `Đặt lịch gửi vào (${Math.round(diffDays)} ngày sau)` 
                ) : diffDays < -1 ? (
                    // Trường hợp nếu đã qua
                    `Đặt lịch gửi vào (${Math.abs(Math.round(diffDays))} ngày trước)`
                ) : diffDays < 1 && diffDays > 0 ? (
                    // Trường hợp nếu dưới 1 ngày, tính theo giờ
                    `Đặt lịch gửi vào (${Math.round(diffHours)} giờ sau)`
                ) : diffDays > -1 && diffDays < 0 ? (
                    // Trường hợp nếu dưới 1 ngày và đã qua, tính theo giờ
                    `Đặt lịch gửi vào (${Math.abs(Math.round(diffHours))} giờ trước)`
                ) : (
                    // Trường hợp nếu là ngày hôm nay
                    "Đặt lịch vào ngày hôm nay"
                )
                ) : (
                'Không có lịch gửi'
                )
            )}
            </p>
            <p className="text-gray-500 text-sm">
              {loading ? <Skeleton width={200} height={15} /> : campaign?.data.scheduled_at}
            </p>
          </div>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md text-xl hover:bg-gray-700">
            {loading ? <Skeleton width={100} height={20} /> : 'Chỉnh sửa'}
          </button>        
        </div>
        {/* Nút gửi */}
        <div className="p-4 flex justify-end">
        <button className="bg-black text-white px-6 py-3 rounded-md text-sm hover:bg-gray-700">
            {loading ? <Skeleton width={100} height={20} /> : 'Gửi'}
          </button>
        </div>
      </div>
    </div>
  );
}
