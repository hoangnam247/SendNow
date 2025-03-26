
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import './globals.css';
import { getSession } from "./utils/session";
import React from 'react';
import { TokenProvider } from "./contexts/TokenContext";

export const metadata = {
    title : "ZoZo",
};

export default async function ClientLayout({ children }) {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user'));


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
