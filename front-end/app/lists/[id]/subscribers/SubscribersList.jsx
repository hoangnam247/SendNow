"use client";

import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css"; // Import CSS của Toastify
import { Tooltip } from "@nextui-org/tooltip";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  ArrowRightStartOnRectangleIcon,
  UsersIcon ,
} from "@heroicons/react/24/outline";
import { useToken } from "@/app/contexts/TokenContext";
import { toast } from "react-toastify";

// Dynamic import ToastContainer để tránh lỗi hydration
const ToastContainerDynamic = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

export default function SubscribersList({ contacts, loading, setContacts }) {
  const [dropdownOpen, setDropdownOpen] = useState(null); // Trạng thái kiểm soát menu dropdown
  const [actionStatus, setActionStatus] = useState({}); // Trạng thái riêng cho từng liên hệ

  const  { token } = useToken();

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => (prev === id ? null : id)); // Đóng/mở dropdown theo từng liên hệ
  };

  const setAction = (id, action, status) => {
    setActionStatus((prev) => ({
      ...prev,
      [id]: { ...prev[id], [action]: status },
    }));
  };

  // Hàm xóa liên hệ
  const removeContact = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',

      });

      if (!response.ok) {
        throw new Error("Failed to delete contact");
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

  // Hàm cập nhật trạng thái liên hệ
  const updateContactStatus = async (id, status) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/${id}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',

        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update contact to ${status}`);
      }

      return response.ok;
    } catch (err) {
      toast.error(`Cập nhật thất bại: ${err.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      return false;
    }
  };

  const handleRemoveContact = async (id) => {
    const confirmation = typeof window !== "undefined" && window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?");
    if (confirmation) {
      setAction(id, "deleting", true); // Bắt đầu xóa
      const status = await removeContact(id);

      if (status) {
        setContacts((prevContacts) => ({
          ...prevContacts,
          data: prevContacts.data.filter((contact) => contact.id !== id),
        }));

        toast.success("Xóa liên hệ thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          icon: "✅",
          style: { backgroundColor: "#ffffff", color: "#000" }, 
        });
      }

      setAction(id, "deleting", false); // Kết thúc xóa
    }
  };

  const statusTranslation = {
    approved: "Đã đăng ký",
    pending: "Đang chờ hủy đăng ký",
    rejected: "Hủy đăng ký",
  };

  const handleUpdateStatus = async (id, status) => {
    const statusNew = statusTranslation[status] || "Trạng thái không xác định";

    setAction(id, "updating", true);
    const result = await updateContactStatus(id, status);
    if (result) {
      setContacts((prevContacts) => ({
        ...prevContacts,
        data: prevContacts.data.map((contact) =>
          contact.id === id ? { ...contact, status } : contact
        ),
      }));

      toast.success(`Cập nhật trạng thái thành ${statusNew} thành công!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        icon: "✅",
        style: { backgroundColor: "#ffffff", color: "#000" }, 
      });
    }
    setAction(id, "updating", false);
  };

  const SkeletonRow = () => (
    <tr className="border-b">
      {[...Array(5)].map((_, idx) => (
        <td key={idx} className="px-4 py-2">
          <div className="bg-gray-300 h-4 w-24 rounded"></div>
        </td>
      ))}
    </tr>
  );

  const formatDate = (dateString) => {
    if (typeof window === "undefined") return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <>
    <ToastContainerDynamic />
    <table className="w-full table-auto bg-gray-100 shadow-md rounded-lg">
     
      <tbody>
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : contacts?.data?.length > 0 ? (
          contacts.data.map((contact, index) => (
            <tr key={contact.id} className="border-b hover:bg-gray-100 transition duration-150">
              <td className="px-4 py-2">
                <div>{contact.email}</div>
                <div className="mt-2">
                  {contact.status === "approved" && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Đã đăng ký
                    </span>
                  )}
                  {contact.status === "pending" && (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      Đang chờ hủy đăng ký
                    </span>
                  )}
                  {contact.status === "rejected" && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      Hủy đăng ký
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-2 text-center">{contact.full_name || "N/A"}
                {/* Trạng thái */}
              <div className="mt-2">
                <span className="text-gray-400 text-sm">
                  Tên
                </span>
              </div>
              </td>
              <td className="px-4 py-2 text-center">{formatDate(contact.created_at)}
              <div className="mt-2">
                <span className="text-gray-400 text-sm">
                  Ngày Tạo
                </span>
              </div>
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
                    onClick={() => toggleDropdown(contact.id)}
                    className="border border-gray-300 rounded-lg p-2 hover:border-gray-500 transition duration-200"
                  >
                    <ChevronDownIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                  </button>

                  {dropdownOpen === contact.id && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <ul className="py-1">
                        <li>
                          <button
                            onClick={() => handleUpdateStatus(contact.id, "approved")}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span>Đăng ký</span>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleUpdateStatus(contact.id, "rejected")}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-gray-500 mr-2" />
                            <span>Hủy đăng ký</span>
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleRemoveContact(contact.id)}
                            disabled={actionStatus[contact.id]?.deleting}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {actionStatus[contact.id]?.deleting ? (
                              <div className="animate-spin h-5 w-5 mr-2 border-4 border-t-4 border-gray-500 rounded-full"></div>
                            ) : (
                              <TrashIcon className="h-5 w-5 text-gray-500 mr-2" />
                            )}
                            <span>Xóa</span>
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
          <td className="px-4 py-6 text-center" colSpan="4">
            <div className="flex flex-col items-center justify-center space-y-2 py-10">
              <UsersIcon className="h-16 w-16 text-gray-500" />
              <span className="text-lg text-gray-600">Bạn chưa có liên hệ.</span>
            </div>
          </td>
        </tr>
        )}
      </tbody>
    </table>
    </>
  );
}
