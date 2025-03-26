"use server"

import { redirect } from 'next/navigation';
import { cookies } from "next/headers";

export const handleLogin = async (formData) => {
    const form = Object.fromEntries(formData);
    const response = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,{
        method : "POST",
        headers: {
            "Content-Type" : "application/json",
            'Accept' : "application/json",
        },

        body: JSON.stringify(form),
    });
    if (!response.ok){
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Tài khoản hoặc mật khẩu sai"  };
    }
    const { success, access_token , expires_in} = await response.json();
    if(!success){
        return { success: false, message: message || "Tài khoản hoặc mật khẩu sai" }; // Sử dụng message từ server hoặc thông báo mặc định
    }
    console.log(access_token)
    // Gọi Next.js API để set cookies
    try {
        const response = await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: access_token,
            expiresAt: new Date(Date.now() + expires_in * 1000).toISOString()
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Lỗi khi thiết lập session');
        }
        
        // Xử lý response thành công
      } catch (error) {
        console.error('Lỗi:', error);
        // Xử lý lỗi
      }

    redirect("/");
};