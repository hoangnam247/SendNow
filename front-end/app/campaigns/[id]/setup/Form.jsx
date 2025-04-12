import React from "react";

export default function Form({
  name,
  setName,
  subject,
  setSubject,
  senderName,
  setSenderName,
  emailFrom,
  setEmailFrom,
  emailReplyTo,
  setEmailReplyTo,
  error,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên chiến dịch *</label>
          <input
            type="text"
            placeholder="Chiến dịch chưa đặt tên"
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Tiêu đề email *</label>
          <input
            type="text"
            placeholder="Nhập tiêu đề"
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Tên gửi *</label>
          <input
            type="text"
            placeholder="Nhập tên gửi"
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Email gửi *</label>
          <input
            type="email"
            placeholder="Nhập email gửi"
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            value={emailFrom}
            onChange={(e) => setEmailFrom(e.target.value)}
            required
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">Phản hồi đến *</label>
          <input
            type="email"
            placeholder="Nhập email phản hồi"
            className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
            value={emailReplyTo}
            onChange={(e) => setEmailReplyTo(e.target.value)}
            required
          />
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
          
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Theo dõi lượt mở</h3>
              <p className="text-sm text-gray-600">
                Theo dõi danh sách khách hàng đã mở email trong chiến dịch đã gửi ( Đang phát triển ) 
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 mt-4">{error}</div>}

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button className="bg-gray-500 text-white px-6 py-2 rounded-lg" type="submit">
          Lưu và Tiếp tục →
        </button>
      </div>
    </form>
  );
}
