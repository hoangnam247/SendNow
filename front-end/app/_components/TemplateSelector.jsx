'use client'; // Đảm bảo đây là client-side component

import React, { useState, useEffect } from 'react';

// Hàm lấy dữ liệu email từ API
const getEmail = async (id) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email-template/${id}`);
  if (!response.ok) {
    throw new Error(`Lỗi khi gọi API: ${response.statusText}`);
  }
  const { data: email } = await response.json();
  return email;
};

const TemplateSelector = ({ campaignId, onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  // Gọi API để lấy dữ liệu khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const emailData = await getEmail(campaignId); // Lấy dữ liệu từ API
        console.log(emailData); // In dữ liệu ra console để kiểm tra
        setTemplates(emailData.templates || []); // Đảm bảo templates là mảng
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setTemplates([]); // Nếu lỗi, set templates thành mảng trống
      } finally {
        setLoading(false); // Dừng trạng thái loading sau khi lấy xong dữ liệu
      }
    };

    fetchData();
  }, [campaignId]); // Gọi lại khi campaignId thay đổi

  if (loading) {
    return <p>Đang tải...</p>; // Hiển thị trạng thái đang tải
  }

  return (
    <div>
      <h2>Chọn mẫu email</h2>
      {/* Kiểm tra nếu templates có dữ liệu */}
      {templates.length > 0 ? (
        <ul>
          {templates.map((template) => (
            <li key={template.id}>
              <button onClick={() => onSelectTemplate(template.template)}>
                {template.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có mẫu email nào.</p> // Hiển thị thông báo nếu không có mẫu nào
      )}
    </div>
  );
};

export default TemplateSelector;
