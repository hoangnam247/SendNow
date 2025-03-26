
export const debounce = (callack, timeout = 500) => {
    let id = null;
    return (...args) => {
        clearTimeout(id);
        id = setTimeout(() => {
            callack.apply(this, args);
        }, timeout);
    }
};

export const getProfile = async (token) => {
    const response = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        headers : {
            Authorization: `Bearer ${token}`, 
            Accept : "application/json",
        },
        credentials: 'include',

    });
    if(!response.ok){
        return false;
    }
    return response.json();
};