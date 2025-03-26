// lib/session.js
export const setSession = (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      // Hoặc dùng cookies (nếu cần HTTP-only)
    }
  };
  
  export const getSession = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token');
      const user = localStorage.getItem('user');
      return token && user ? { token, user: JSON.parse(user) } : null;
    }
    return null;
  };