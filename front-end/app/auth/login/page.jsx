import Form from "./Form";
import Image from 'next/image';
import bgImage from '/public/images/nenlogin.jpg';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <Image
        src={bgImage}
        alt="Background"
        fill
        priority
        quality={75}
        className="object-cover -z-10"
      />
      
      {/* Form Container - Căn giữa màn hình */}
      <div className="relative mx-auto w-[90%] max-w-xl"> {/* Thêm relative và mx-auto */}
        <div className="bg-white bg-opacity-80 p-8 shadow-lg rounded-lg w-full max-w-md">
          <h2 className="text-center text-2xl font-bold mb-6">Đăng Nhập</h2>
          <Form />
        </div>
      </div>
    </div>
  );
}