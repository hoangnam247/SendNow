
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import './globals.css';
import { fetchUserProfile } from "./utils/session";
import React from 'react';
import { TokenProvider } from "./contexts/TokenContext";
import { cookies } from 'next/headers';

export const metadata = {
    title : "GetNow",
};

export default async function ClientLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get('access_token')?.value;

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
