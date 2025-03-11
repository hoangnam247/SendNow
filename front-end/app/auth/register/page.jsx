"use client"
import { useState } from "react";
import Image from "next/image"; // Nếu bạn muốn tối ưu hóa ảnh bằng next/image

export default function Home() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`container flex w-full max-w-4xl bg-white p-8 rounded-3xl shadow-lg transition-all duration-500`}
      >
        {/* Left Side: Form (Login/Register) */}
        <div
          className={`form-container flex-1 w-full max-w-sm transition-all duration-500 ${
            isRegister ? "transform translate-x-[100%]" : "transform translate-x-0"
          }`}
        >
          <h2 className="text-xl font-semibold text-center mb-4">
            {isRegister ? "Create Account" : "Welcome Back!"}
          </h2>
          <form className="mt-6">
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md mt-4"
            >
              {isRegister ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <div className="toggle-container text-center mt-4">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-500 hover:underline"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Right Side: Image */}
        <div
          className={`image-container flex-1 bg-blue-500 rounded-3xl h-full relative transition-all duration-500 ${
            isRegister ? "transform translate-x-[-100%]" : "transform translate-x-0"
          }`}
        >
          <Image
            src="/image/grid3.png" // Thay đường dẫn này bằng ảnh của bạn trong thư mục public
            alt="Image"
            className="object-cover w-full h-full rounded-3xl"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
