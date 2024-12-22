"use client"; // Đánh dấu đây là Client Component
import { handleCreateContactLists } from "../action";
import { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import Toast từ react-toastify
import { useRouter } from "next/navigation"; // Import useRouter từ Next.js
import "react-toastify/dist/ReactToastify.css"; // Import CSS của Toastify

export default function Form() {
  const [msg, setMsg] = useState("");
  const formRef = useRef();
  const router = useRouter(); // Khởi tạo useRouter để điều hướng

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-8 shadow-lg rounded-lg mt-1">
      <h1 className="text-3xl font-bold mb-8">+ Tạo danh sách</h1>

      <form
        ref={formRef}
        action={async (formData) => {
          const response = await handleCreateContactLists(formData);
          if (!response) {
            toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.", {
              position: "top-right",
              autoClose: 3000, // Đóng tự động sau 3 giây
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            return;
          }

          toast.success("Thêm danh sách thành công!", {
            position: "top-right",
            autoClose: 2000, // Đóng tự động sau 3 giây
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          formRef.current.reset();

          setMsg('Thêm danh sách người dùng thành công ');
          // Điều hướng về trang Home sau khi thông báo hiển thị xong
          setTimeout(() => {
            router.push("/lists");
          }, 3000); // Đợi 3 giây để toast hiển thị
        }}
      >
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Tên */}
          <div className="flex flex-col">
            <label htmlFor="name" className="font-semibold">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="list_name"
              placeholder="Tên..."
              className="mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        {/* Nút Lưu */}
        <div className="flex justify-center">
          <button
            className="px-6 py-3 bg-[#1e293b] text-white rounded-lg shadow-md hover:bg-[#020617] focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 ease-in-out"
          >
            Lưu
          </button>
        </div>

        {/* Thông báo lỗi hoặc thành công */}
        {msg && (
          <div
            className={`mt-4 text-center py-2 px-4 rounded-lg ${
              msg.includes("lỗi")
                ? "bg-red-100 text-red-500"
                : "bg-green-100 text-green-500"
            }`}
          >
            {msg}
          </div>
        )}
      </form>
      <ToastContainer />
    </div>
  );
}
