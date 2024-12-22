"use client";  

// TokenContext.js
import { createContext, useContext } from "react";

// Tạo Context
const TokenContext = createContext();

// Custom hook để sử dụng Context
export const useToken = () => useContext(TokenContext);

// Provider để bọc ứng dụng và cung cấp token
export const TokenProvider = ({ token, children }) => {
  return (
    <TokenContext.Provider value={token}>
      {children}
    </TokenContext.Provider>
  );
};
