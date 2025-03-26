
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import './globals.css';
import { getSession } from "./utils/session";
import React from 'react';
import { TokenProvider } from "./contexts/TokenContext";
import { cookies } from 'next/headers';

export const metadata = {
    title : "ZoZo",
};
async function fetchUserProfile(token) {
  if (!token) return null;

  try {
    const response  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
      headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          cache: 'no-store' // Đảm bảo luôn lấy dữ liệu mới nhất
      });

      if (!response.ok) {
          throw new Error('Failed to fetch user profile');
      }

      return await response.json();
  } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
  }
}

export default async function ClientLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get('sessionToken')?.value;
  const userData = await fetchUserProfile(token);

  return (
    <html lang="en">
      <body>
        <TokenProvider token={token} user={userData}> {/* Bọc toàn bộ ứng dụng bằng TokenProvider */}
          <Header /> 
          <main>
            {children} {/* Các trang sẽ nằm trong TokenProvider và có thể truy cập token */}
          </main>
          <Footer />
        </TokenProvider>

      </body>
    </html>
  );
}
