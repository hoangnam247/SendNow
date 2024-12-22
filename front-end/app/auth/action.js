"use server"

import { redirect } from 'next/navigation';
import { cookies } from "next/headers";

export const handleLogin = async (formData) => {
    const form = Object.fromEntries(formData);
    const response = await fetch (`${process.env.SERVER_API}/auth/login`,{
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
    const { success, token} = await response.json();
    if(!success){
        return { success: false, message: message || "Tài khoản hoặc mật khẩu sai" }; // Sử dụng message từ server hoặc thông báo mặc định
    }
    console.log(token)
    cookies().set("token",token, {
        httpOnly: true, 
        secure: false,
        path: "/",
        maxAge: 86400, //1ngay

    });
    redirect("/");
};
