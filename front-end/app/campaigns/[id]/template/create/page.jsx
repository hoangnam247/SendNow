"use client";

import { useToken } from '@/app/contexts/TokenContext';
import { useState, useEffect } from 'react';
import { useParams ,useRouter} from 'next/navigation';
import 'react-loading-skeleton/dist/skeleton.css'; // Import CSS
import NavigationBar from '@/app/_components/NavigationBar';
import Skeleton from 'react-loading-skeleton';
import Image from 'next/image';

export default function EmailTemplate() {

  const [query, setQuery] = useState(''); // Từ khóa tìm kiếm
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [showTemplates, setShowTemplates] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const  { token } = useToken();
  const { id } = useParams(); // Lấy campaign ID từ URL
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [campaignData, setCampaignData] = useState(null); // state mới


  // Hàm gọi API để lấy thông tin chiến dịch
  useEffect(() => {
    if (!id) return; // Tránh gọi API nếu `id` không tồn tại

    const fetchCampaignData = async () => {
      setLoading(true); // Bắt đầu loading trước khi fetch

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',

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
        setLoading(false); // Kết thúc loading
      }
    };

    fetchCampaignData(); // Gọi API

  }, [id, token]);
  // Hàm lấy danh sách mẫu email từ API
  useEffect(() => {
    if (showTemplates) {
      const fetchEmailTemplates = async (query = '', page = 1) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email-template?q=${query}&page=${page}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',

          });

          const result = await response.json();

          if (result.success && result.data && Array.isArray(result.data.data)) {
            setEmailTemplates(result.data.data); // Lấy dữ liệu mẫu email từ result.data.data
            setTotalPages(result.data.last_page); // Cập nhật tổng số trang
            setCurrentPage(result.data.current_page); // Cập nhật trang hiện tại
          } else {
            console.error("Dữ liệu không hợp lệ:", result);
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách mẫu email:', error);
          setError('Lỗi khi lấy mẫu email');
        } finally {
          setLoading(false); // Kết thúc quá trình loading
        }
      };

      setLoading(true); // Bắt đầu quá trình loading
      fetchEmailTemplates(); // Gọi hàm lấy dữ liệu mẫu email
    }
  }, [showTemplates, currentPage, token]); // Dependency array chứa showTemplates, currentPage và token

  // Gọi API khi `query` hoặc `currentPage` thay đổi
  useEffect(() => {
    if (query || currentPage) {
      setLoading(true); // Bắt đầu loading khi tìm kiếm hoặc trang thay đổi
      fetchEmailTemplates(query, currentPage); // Gọi lại API
    }
  }, [query, currentPage]);
  const toggleTemplates = () => {
    setShowTemplates(!showTemplates);
  };

  // Hàm cập nhật mẫu vào campaign ngay khi nhấp vào mẫu
  const handleSubmit = async (templateId) => {
    try {
      // Fetch dữ liệu chiến dịch hiện tại để kiểm tra email_template_id có tồn tại không
      const responseCampaign = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',

      });
  
      const campaignData = await responseCampaign.json();
  
      if (responseCampaign.ok) {
        // Kiểm tra nếu campaign đã có email_template_id
        if (campaignData.data.email_template_id) {
          // Nếu đã có email_template_id, update với templateId mới và làm trống content
          const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',

            body: JSON.stringify({
              email_template_id: templateId,
              content: '', // Đặt content là rỗng
            }),
          });
  
          const updateData = await updateResponse.json();
  
          if (updateResponse.ok) {
            alert('Mẫu email đã được gắn vào chiến dịch và content đã được làm trống.');
            setTimeout(() => {
              router.push(`/campaigns/${id}/template`);
            }, 100);
            toggleTemplates(); // Đóng modal sau khi chọn mẫu
          } else {
            console.error('Lỗi khi cập nhật campaign:', updateData.message || 'Error updating campaign');
          }
        } else {
          // Nếu campaign chưa có email_template_id, chỉ cần update email_template_id
          const createResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',

            body: JSON.stringify({
              email_template_id: templateId,
            }),
          });
  
          const createData = await createResponse.json();
  
          if (createResponse.ok) {
            alert('Mẫu email đã được gắn vào chiến dịch.');
            setTimeout(() => {
              router.push(`/campaigns/${id}/template`);
            }, 100);
            toggleTemplates(); // Đóng modal sau khi chọn mẫu
          } else {
            console.error('Lỗi khi cập nhật campaign:', createData.message || 'Error updating campaign');
          }
        }
      } else {
        console.error('Không thể lấy dữ liệu campaign:', campaignData.message || 'Error fetching campaign');
      }
    } catch (error) {
      console.error('Lỗi khi xử lý request:', error);
    } finally {
      setLoading(false);
    }
  };

 
 

  return (
    <div className="max-h-screen  ">
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


        {/* Main Content */}
        <div className="py-8">
          <h2 className="text-lg font-bold mb-4">Quản lý nội dung</h2>
          <p className="text-gray-700 mb-6">
            Xây dựng nội dung thư mà bạn mong muốn gửi đi bằng trình soạn thảo nội dung của chúng tôi.
          </p>

          <button
            className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={toggleTemplates}
          >
            <span className="text-xl">+</span>
            <span>Sử dụng mẫu có sẵn</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-4 text-gray-500 border-t">
          © 2021. Powered by Getnow
        </div>
      </div>

{/* Modal - bảng các mẫu email */}
{showTemplates && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-full sm:max-w-7xl w-full relative max-h-[100vh] overflow-hidden">
    {/* Nút đóng với dấu "X" ở góc trên phải */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={toggleTemplates}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h3 className="text-xl font-bold mb-4">Mẫu Email</h3>
         {/* Ô tìm kiếm */}
         <div className="flex-grow mx-4">
          <input
            type="text"
            placeholder="Gõ và enter để tìm kiếm"
            className="w-64 p-2 border border-gray-300 rounded-lg focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Cập nhật query khi nhập tìm kiếm
          />
        </div>
          
      {/* Sử dụng grid để hiển thị các mẫu email */}
      <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-h-[70vh] overflow-y-auto">
        {emailTemplates.map((template) => (
          <div 
            key={template.id} 
            className="bg-gray-100 p-2 rounded-lg shadow-md hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={() => handleSubmit(template.id)} // Lưu mẫu khi nhấp vào
          >
            <Image 
              src={`http://localhost:8000/images/${template.image}`}  // Đảm bảo đường dẫn đúng
              alt={template.name}
              className="w-full h-auto object-contain rounded-md"  // Cải thiện để ảnh không bị cắt
            />
            <p className="mt-2 text-center font-semibold">{template.name}</p>
            <p className="text-gray-600 text-center">{template.description}</p>
          </div>
        ))}
        
      </div>
      {/* Hiển thị phân trang */}
      <div className="flex items-center justify-end  mt-20 space-x-2">
        {/* Nút Previous (ẩn nếu ở trang đầu) */}
        <button
      className="px-4 py-2 text-blue-500 border border-transparent rounded transition-all duration-300 
      hover:bg-blue-500 hover:text-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 active:bg-blue-700"   
      disabled={currentPage <= 1} // Nếu là trang đầu tiên, nút sẽ bị vô hiệu hóa
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        {/* Danh sách các số trang */}
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-2 border rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Nút Next (ẩn nếu ở trang cuối) */}
        <button
      className="px-4 py-2 text-blue-500 border border-transparent rounded transition-all duration-300 
      hover:bg-blue-500 hover:text-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 active:bg-blue-700" 
          disabled={currentPage >= totalPages} // Nếu là trang cuối, nút sẽ bị vô hiệu hóa
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

    </div>
  </div>
)}
    </div>

  );
}
