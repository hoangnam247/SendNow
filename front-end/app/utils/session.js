import { cookies } from "next/headers";
export const setSession = async (token, user) => {
    await fetch (`${process.env.NEXT_PUBLIC_APP_URL}/api/session`,{
        method : "POST",  
        headers  : {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({token, user}),

    });
};

export const getSession = async () => {
    // Sử dụng dynamic API trên server-side
    const cookieStore = await cookies();
    
    const token = cookieStore.get("token")?.value;
    

    if (!token) {
        return false; // Nếu không có token, trả về false
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/session`, {
        headers: {
            token: token,
        },
    });

    if (!response.ok) {
        return false;
    }

    const { user } = await response.json();
    if (!user) {
        return false;
    }

    return { user, token };
};