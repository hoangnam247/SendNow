"use server";

import { cookies } from 'next/headers';

export const handleCreateContactLists = async (formData) => {
  // Retrieve the token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value;
  
  // Check if the token exists
  if (!token) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn.");
  }

  // Convert formData to an object
  const data = Object.fromEntries(formData.entries());
  console.log(data);
  try {
    // Make the POST request
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the request
      },
      credentials: 'include',

      body: JSON.stringify(data),
    });

    const responseBody = await response.json();

    if (responseBody.success) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw new Error("Đã xảy ra lỗi khi tạo danh sách.");
  }
};

export async function fetchLists(token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lists`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',

  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error('Không thể tải danh sách liên hệ');
  }
  return data.data.data; // Trả về danh sách
}

export async function fetchContacts(listId, token) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lists/${listId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',

  });

  const data = await res.json();
  
  if (!res.ok || !data.success) {
    throw new Error('Không thể tải danh sách liên hệ');
  }
  return data; // Trả về dữ liệu liên hệ
}
