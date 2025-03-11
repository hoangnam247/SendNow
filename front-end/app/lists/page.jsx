import React from 'react';
import ContactListsList from './ContactListList';
import Pagination from '../_components/Pagination';
import { cookies } from 'next/headers';

// API fetching function
const getLists = async (token, current, pageSize, query) => {
  try {
    const response = await fetch(
      `${process.env.SERVER_API}/lists?current=${current}&pageSize=${pageSize}&query=${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch lists: ${response.status}, ${errorText}`);
    }

    const { data: lists, total } = await response.json();

    return { success: true, data: lists, total };
  } catch (error) {
    console.error("Error fetching lists:", error);
    return { success: false, error: error.message };
  }
};

// Main component
const ListsPage = async ({ searchParams }) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token?.value) {
    return <h2>Token is invalid or expired</h2>;
  }

  // Parse and validate searchParams
  const pageSize = searchParams.pageSize ? parseInt(searchParams.pageSize) : 10;
  const current = searchParams.current ? parseInt(searchParams.current) : 1;
  const query = searchParams.query || "";

  console.log("Query:", query);

  const { success, data: lists, total } = await getLists(
    token.value,
    current,
    pageSize,
    query
  );

  if (!success || current === 0 || pageSize === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
          <nav className="text-sm text-gray-500 mb-4">
            <ol className="flex space-x-2 items-center">
              <li>
                <a href="/" className="hover:text-gray-900">
                  Trang chủ
                </a>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold mb-6 flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7 text-teal-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span>Danh sách liên hệ</span>
          </h1>
          <div className="text-center text-gray-500">Không có dữ liệu để hiển thị</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
        <nav className="text-sm text-gray-500 mb-4">
          <ol className="flex space-x-2 items-center">
            <li>
              <a href="/" className="hover:text-gray-900">
                Trang chủ
              </a>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold mb-6 flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7 text-teal-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span>Danh sách liên hệ</span>
        </h1>
        <ContactListsList
          lists={lists || []}
          total={total || 0}
          current={current}
          pageSize={pageSize}
          query={query}
        />
      </main>
    </div>
  );
};

export default ListsPage;
