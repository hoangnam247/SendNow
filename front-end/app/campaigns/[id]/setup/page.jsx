'use client';
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import CSS
import { useParams, useRouter } from 'next/navigation';
import { useToken } from '@/app/contexts/TokenContext';
import Form from './Form'; // Import Form component
import NavigationBar from '@/app/_components/NavigationBar';

export default function CampaignSettings() {
  const { id } = useParams();
  const router = useRouter();
  const token = useToken();

  const [name, setName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [subject, setSubject] = useState('');
  const [emailFrom, setEmailFrom] = useState('');
  const [emailReplyTo, setEmailReplyTo] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState(null); // state mới

  // Hàm gọi API để lấy thông tin chiến dịch
  const fetchCampaignData = async () => {
    try {
      const response = await fetch(`${process.env.SERVER_API}/campaigns/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setCampaignData(data); // Cập nhật campaignData
        setName(data.data.name || '');
        setSenderName(data.data.sender_name || '');
        setSubject(data.data.subject || '');
        setEmailFrom(data.data.email_from || '');
        setEmailReplyTo(data.data.email_reply_to || '');
      } else {
        setError(data.message || 'Không thể tải thông tin chiến dịch');
      }
    } catch (error) {
      setError('Có lỗi khi tải thông tin chiến dịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCampaignData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.SERVER_API}/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          sender_name: senderName,
          subject,
          email_from: emailFrom,
          email_reply_to: emailReplyTo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/campaigns/${id}/template/create`);
      } else {
        setError(data.message || 'Có lỗi khi cập nhật chiến dịch');
      }
    } catch (error) {
      setError('Có lỗi khi cập nhật chiến dịch');
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
          <Skeleton width={300} height={40} /> // Skeleton cho tiêu đề
        ) : (
          <h1 className="text-3xl font-bold text-gray-900">
            {name || 'Chiến dịch chưa được đặt tên'}
          </h1>
        )}
      </div>

    {/* Tabs điều hướng */}

    <div className="flex space-x-6 border-b border-gray-300 pb-2 mb-4">
        <NavigationBar campaign={campaignData} />
    </div>

      {/* Form */}
      {loading ? (
        <Skeleton height={400} /> // Skeleton cho toàn bộ form
      ) : (
        <Form
          name={name}
          setName={setName}
          subject={subject}
          setSubject={setSubject}
          senderName={senderName}
          setSenderName={setSenderName}
          emailFrom={emailFrom}
          setEmailFrom={setEmailFrom}
          emailReplyTo={emailReplyTo}
          setEmailReplyTo={setEmailReplyTo}
          error={error}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
