"use client";
import React, { useState } from 'react';
import "react-toastify/dist/ReactToastify.css"; // Import CSS của Toastify
import { Tooltip } from "@nextui-org/tooltip";
import Link from 'next/link';
import { PencilIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useToken } from '@/app/contexts/TokenContext';
import { toast, ToastContainer } from "react-toastify"; // Import Toast từ react-toastify

export default function SubscribersList({ contacts, loading ,setContacts }) {
  const [dropdownOpen, setDropdownOpen] = useState(null); // Trạng thái kiểm soát menu dropdown
  const [deleting, setDeleting] = useState(false); // Trạng thái xóa
  const token = useToken();

  const toggleDropdown = (index) => {
    setDropdownOpen((prev) => (prev === index ? null : index)); // Đóng/mở dropdown theo từng dòng
  };

  // Hàm xóa liên hệ
  const removeContact = async (id) => {
    try {
      const response = await fetch(`${process.env.SERVER_API}/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      return response.ok;
    } catch (err) {
      toast.error(`Xóa thất bại: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      return false;
    }
  };

  // Xử lý xóa liên hệ và cập nhật danh sách sau khi xóa thành công
const handleRemoveContact = async (id) => {
    const confirmation = window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?");

    if (confirmation) {
      setDeleting(true); // Bắt đầu xóa
      const status = await removeContact(id); // Thực hiện xóa

      if (status) {
        // Cập nhật lại danh sách sau khi xóa thành công
        setContacts((prevContacts) => ({
          ...prevContacts,
          data: prevContacts.data.filter((contact) => contact.id !== id),
        }));

        toast.success("Xóa liên hệ thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          icon: "✅", // Thêm biểu tượng thành công
          style: {
            backgroundColor: "#28a745", // Màu nền thông báo thành công
            color: "#fff", // Màu chữ
          },
        });
      }

      setDeleting(false); // Kết thúc xóa
    }
  };
  const SkeletonRow = () => (
    <tr className="border-b">
      <td className="px-4 py-2">
        <div className="bg-gray-300 h-4 w-24 rounded"></div>
        <p className="text-gray-300 mt-2 h-3 w-16 bg-gray-300 rounded"></p>
      </td>
      <td className="px-4 py-2 text-center">
        <div className="bg-gray-300 h-4 w-12 rounded"></div>
      </td>
      <td className="px-4 py-2 text-center">
        <div className="bg-gray-300 h-4 w-12 rounded"></div>
      </td>
      <td className="px-4 py-2 text-center">
        <div className="bg-gray-300 h-4 w-12 rounded"></div>
      </td>
      <td className="px-4 py-2 text-center">
        <div className="bg-gray-300 h-8 w-24 rounded"></div>
      </td>
    </tr>
  );

  return (
    <table className="w-full table-auto bg-white shadow-md rounded">
      <tbody>
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : contacts && contacts.data && contacts.data.length > 0 ? (
          contacts.data.map((contact, index) => (
            <tr key={index} className="border-b hover:bg-gray-100 transition duration-150">
              <td className="px-4 py-2">{contact.email}</td>
              <td className="px-4 py-2 text-center">{contact.full_name || 'N/A'}</td>
              <td className="px-4 py-2 text-center">
                {new Date(contact.created_at).toLocaleDateString('vi-VN')}
              </td>
              <td className="px-4 py-2 text-center">
                <div className="relative flex justify-center items-center space-x-4">
                  <Tooltip content="Sửa Liên Hệ">
                    <Link href={`/lists/subscribers/create`} className="relative group inline-block">
                      <div className="border border-gray-300 rounded-lg p-2 hover:border-gray-500 transition duration-200">
                        <PencilIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                      </div>
                    </Link>
                  </Tooltip>

                  <button
                    onClick={() => toggleDropdown(index)}
                    className="border border-gray-300 rounded-lg p-2 hover:border-gray-500 transition duration-200"
                  >
                    <ChevronDownIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen === index && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <ul className="py-1">
                        <li>
                          <button
                            onClick={() => handleRemoveContact(contact.id)}
                            disabled={deleting} // Disabled when deleting
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {deleting ? (
                              <div className="animate-spin h-5 w-5 mr-2 border-4 border-t-4 border-gray-500 rounded-full"></div>
                            ) : (
                              <TrashIcon className="h-5 w-5 text-gray-500 mr-2" />
                            )}
                            <span>{deleting ? 'Đang xóa...' : 'Xóa liên hệ'}</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="px-4 py-2 text-center" colSpan="4">
              Không có liên hệ nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
