// // lib/session.js
// export const setSession = (token, user) => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('jwt_token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       // Hoặc dùng cookies (nếu cần HTTP-only)
//     }
//   };
  
// utils/auth.js
export async function fetchUserProfile(token) {
  if (!token) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data?.id) {
      throw new Error("Invalid user data structure");
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
}