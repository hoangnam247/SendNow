import { cookies } from "next/headers";
export const setSession = async (token, user) => {
    await fetch (`${process.env.APP_URL}/api/session`,{
        method : "POST",  
        headers  : {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({token, user}),

    });
};

export const getSession = async () => {
    const token = cookies().get("token")?.value;
    
    const response = await fetch (`${process.env.APP_URL}/api/session`,{
        headers: {
            token : token,
        },
    });
    if(!response.ok){
        return false;
    }
    const {user} = await response.json();
    if(!user){
        return false;
    }
    return { user, token };
};