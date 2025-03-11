import Form from "./Form";

export default function LoginPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/nenlogin.jpg')" }}
    >
      <div className="bg-white bg-opacity-80 p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">Đăng Nhập</h2>
        <Form />
      </div>
    </div>
  );
}