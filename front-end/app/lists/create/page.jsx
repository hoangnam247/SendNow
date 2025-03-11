"use client"
import Form from "./Form"; // Đảm bảo đường dẫn đến file Form.jsx là chính xác
import { useRouter } from "next/navigation"; // Import useRouter để reload dữ liệu

export default function TaoDanhSach() {
  const router = useRouter(); // Dùng để cập nhật dữ liệu trang sau khi thêm danh sách
  const handleListCreated = () => {
    router.refresh(); // Cập nhật lại dữ liệu trang sau khi tạo danh sách
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex space-x-2 items-center">
            <li>
              <a href="/" className="hover:text-gray-900">
                Trang chủ
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/lists" className="hover:text-gray-900">
                Danh sách
              </a>
            </li>
          </ol>
        </nav>


        {/* Information Section */}
        <div className="mb-6 text-lg text-gray-700">
          <p className="mb-2 font-medium">Thông tin gửi:</p>
          <p className="text-gray-500">Vui lòng điền đầy đủ thông tin vào form dưới đây để tạo danh sách mới. Các trường có dấu * là bắt buộc.</p>
        </div>

        {/* Form Component */}
        <Form onListCreated={handleListCreated} />
      </main>
    </div>
  );
}
