"use client"; // Đánh dấu đây là Client Component
import { handleCreateContactLists } from "../action";
import { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function Form({ onListCreated }) { // Nhận callback từ props
  const [msg, setMsg] = useState("");
  const formRef = useRef();
  const router = useRouter();

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-8 shadow-lg rounded-lg mt-1">
      <h1 className="text-3xl font-bold mb-8">+ Tạo danh sách</h1>

      <form
        ref={formRef}
        action={async (formData) => {
          const response = await handleCreateContactLists(formData);
          if (!response) {
            toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.", { position: "top-right", autoClose: 3000 });
            return;
          }

          toast.success("Thêm danh sách thành công!", { position: "top-right", autoClose: 1500 });

          formRef.current.reset();
          setMsg("Thêm danh sách người dùng thành công ");

          // Gọi callback để cập nhật danh sách trong `TaoDanhSach.jsx`
          onListCreated();

          // Điều hướng về trang danh sách
          setTimeout(() => {
            router.push("/lists");
          }, 1500); // Đợi 2 giây để Toast hiển thị
        }}
      >
        <div className="grid grid-cols-2 gap-6 mb-6">
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

        <div className="flex justify-center">
          <button className="px-6 py-3 bg-[#1e293b] text-white rounded-lg shadow-md hover:bg-[#020617] focus:outline-none">
            Lưu
          </button>
        </div>

        {msg && (
          <div className={`mt-4 text-center py-2 px-4 rounded-lg ${msg.includes("lỗi") ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"}`}>
            {msg}
          </div>
        )}
      </form>
      <ToastContainer />
    </div>
  );
}
