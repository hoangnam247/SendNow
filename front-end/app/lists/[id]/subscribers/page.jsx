'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/app/_components/NavigationBar_Lists';
import SubscribersList from './SubscribersList';
import { fetchLists, fetchContacts } from './action';
import {
  UserGroupIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useToken } from '@/app/contexts/TokenContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContactPage({ params }) {
  const { id } = params; // Lấy id từ params
  const [contacts, setContacts] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState({ lists: true, contacts: true });
  const [error, setError] = useState(null);
  const  { token } = useToken();

  const router = useRouter();

  // Gọi API để lấy danh sách
  useEffect(() => {
    async function loadLists() {
      try {
        setLoading((prev) => ({ ...prev, lists: true }));
        if (!token) {
          throw new Error('Token không hợp lệ hoặc bị thiếu.');
        }

        const listsData = await fetchLists(token);

        if (!Array.isArray(listsData) || listsData.length === 0) {
          throw new Error('Không có danh sách nào để hiển thị.');
        }

        setLists(listsData);

        // Kiểm tra nếu params.id không hợp lệ, điều hướng đến danh sách đầu tiên
        if (!id || !listsData.some((list) => list.id === parseInt(id, 10))) {
          const firstList = listsData[0];
          router.push(`/lists/${firstList.id}/subscribers`);
        }
      } catch (err) {
        console.error('Error in loadLists:', err.message);
        setError(err.message || 'Lỗi khi tải danh sách.');
      } finally {
        setLoading((prev) => ({ ...prev, lists: false }));
      }
    }

    if (token) loadLists();
  }, [token, id, router]);

  // Gọi API để lấy liên hệ dựa trên danh sách đã chọn
  useEffect(() => {
    async function loadContacts() {
      try {
        setLoading((prev) => ({ ...prev, contacts: true }));
        if (!token || !id) return;

        const contactsData = await fetchContacts(id, token);
        setContacts(contactsData);
      } catch (err) {
        console.error('Error in loadContacts:', err.message);
        setError(err.message || 'Lỗi khi tải liên hệ.');
      } finally {
        setLoading((prev) => ({ ...prev, contacts: false }));
      }
    }

    if (token && id) loadContacts();
  }, [id, token]);

  return (
    <>
      <ToastContainer /> {/* Đặt ToastContainer ngoài cùng để đảm bảo không bị lỗi cấu trúc HTML */}
      <div className="p-4 max-w-screen-lg mx-auto">
        <nav className="text-sm text-gray-500 mb-4">
          <ol className="flex space-x-2 items-center">
            <li>
              <a href="/" className="hover:text-gray-900">Trang chủ</a>
            </li>
            <li>/</li>
            <li>
              <a href="/lists" className="hover:text-gray-900">Danh sách</a>
            </li>
            <li>/</li>
            <li className="text-gray-900">
              {loading.lists ? (
                <div className="animate-pulse w-48 h-8 bg-gray-300 rounded"></div>
              ) : (
                <select
                  className="bg-transparent border-none text-gray-700 font-semibold py-2 px-4 inline-flex items-center"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    router.push(`/lists/${selectedId}/subscribers`);
                  }}
                  value={id || ''}
                  disabled={loading.lists}
                >
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.list_name} - {list.contacts_count} Liên hệ
                    </option>
                  ))}
                </select>
              )}
            </li>
          </ol>
        </nav>

        {/* Hiển thị tên danh sách và số lượng liên hệ */}
        <div className="mb-6">
          {loading.lists ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          ) : lists.length > 0 && id ? (
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {lists.find((list) => list.id === parseInt(id, 10))?.list_name || 'Danh sách không tồn tại'}
              </h1>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white text-lg font-bold">
                  {lists.find((list) => list.id === parseInt(id, 10))?.contacts_count || 0}
                </div>
                <p className="text-gray-700 text-lg font-medium">
                  <span className="text-gray-500">Liên hệ</span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Không có thông tin về danh sách liên hệ.</p>
          )}
        </div>

        <NavigationBar id={id} />

        <div className="mt-6 flex items-center justify-between bg-gray-100 rounded-lg p-4 mb-4 shadow">
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="h-8 w-8 text-teal-500" />
            <h1 className="text-2xl font-bold text-gray-800">Liên Hệ</h1>
          </div>
          <Link
            href="/lists/create"
            className="flex items-center justify-center w-10 h-10 bg-teal-500 rounded-full hover:bg-teal-600 transition-all duration-200"
            title="Thêm liên hệ"
          >
            <PlusIcon className="h-6 w-6 text-white" />
          </Link>
        </div>

        <div>
          <SubscribersList contacts={contacts} loading={loading.contacts} setContacts={setContacts} />
        </div>
      </div>
    </>
  );
}
