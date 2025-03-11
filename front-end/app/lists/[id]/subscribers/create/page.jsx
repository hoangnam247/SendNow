"use client"
import { useRouter, useSearchParams } from "next/navigation";
import Form from "./Form"; 
import { useToken } from '@/app/contexts/TokenContext';
import React, { useState, useEffect } from 'react';
import { fetchLists } from '../action';

export default function CreateSubscribers({ params }) {
  const { token } = useToken();
  const [loading, setLoading] = useState({ lists: true, contacts: true });
  const [lists, setLists] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = params; // Lấy id từ params

  
  // Tải danh sách
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

        setLists(listsData); // Cập nhật state lists
      } catch (err) {
        console.error('Error in loadLists:', err.message);
        setError(err.message || 'Lỗi khi tải danh sách.');
      } finally {
        setLoading((prev) => ({ ...prev, lists: false }));
      }
    }

    if (token) loadLists();
  }, [token, id, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
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
            <li>/</li>
            <li className="text-blue-700">
              {loading.lists ? (
                <div className="animate-pulse w-48 h-8 bg-gray-300 rounded"></div>
              ) : (
                lists.length > 0 && id ? (
                  <span>{lists.find((list) => list.id === parseInt(id))?.list_name}</span>
                ) : (
                  <span>Không có danh sách</span>
                )
              )}
            </li>
          </ol>
        </nav>

        <div className="mb-6 text-lg text-gray-700">
          <p className="mb-2 font-medium">Thông tin gửi:</p>
          <p className="text-gray-500">Vui lòng điền đầy đủ thông tin vào form dưới đây để tạo danh sách mới. Các trường có dấu * là bắt buộc.</p>
        </div>

        <Form listId={id}  onListCreated={() => router.refresh()} />
      </main>
    </div>
  );
}
