"use client";  

// TokenContext.js
import { createContext, useContext } from "react";

// Tạo Context
const TokenContext = createContext();

export const TokenProvider = ({ token, user, children }) => {
  return (
    <TokenContext.Provider value={{ token, user }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  return useContext(TokenContext);
};