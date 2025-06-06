"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const handleLogin = async (formData) => {
      const form = Object.fromEntries(formData);
      
      // 1. Gọi API đăng nhập
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
          },
        body: JSON.stringify(form),
        credentials: 'include', // Quan trọng cho CORS với cookie

      });
  
      // 2. Xử lý lỗi
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: error.message || "Đăng nhập thất bại"  
        };
      }
  
      // 3. Nhận token
      const { access_token, refresh_token, expires_in } = await response.json();
    
  
      // 5. Lưu cookies
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
        sameSite: 'lax',
        secure: true // BẮT BUỘC khi dùng HTTPS

      };
  
      cookies().set("access_token", access_token, {
        ...cookieOptions,
        expires: new Date(Date.now() + expires_in * 1000),
      });
  
      if (refresh_token) {
        cookies().set("refresh_token", refresh_token, {
          ...cookieOptions,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
        });
      }
  
      // 6. Redirect
      redirect("/");

  };