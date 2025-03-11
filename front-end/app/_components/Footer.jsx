'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 ">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div>
            {/* <Image src="/logo.png" alt="Zozo Logo" width={100} height={50} /> */}
            <p>© 2017 Zozo. Powered By INET</p>
          </div>

          {/* Kết nối với Zozo */}
          <div>
            <h5 className="font-semibold mb-4">Kết nối với Zozo</h5>
            <p>
              <strong>Tổng đài:</strong> 1900.9260 <br />
              <strong>Email:</strong> contact@zozo.vn
            </p>
            <div className="flex space-x-4 mt-2">
              <Link href="#"><i className="fab fa-facebook fa-lg"></i></Link>
              <Link href="#"><i className="fab fa-youtube fa-lg"></i></Link>
            </div>
          </div>

          {/* Văn phòng */}
          <div>
            <h5 className="font-semibold mb-4">Văn phòng</h5>
            <p>Hà Nội: Tầng 7, Tòa nhà iNET, Số 247 Cầu Giấy, Hà Nội</p>
            <p>TP. Hồ Chí Minh: Tầng 1, Tòa nhà Arrow, Số 40 Hoàng Việt</p>
            <p>Đà Nẵng: Tòa nhà S-HOME, Số 56 Nguyễn Tri Phương</p>
          </div>

          {/* Dịch vụ */}
          <div>
            <h5 className="font-semibold mb-4">Dịch vụ</h5>
            <ul className="space-y-2">
              <li>Thiết kế Website Bán hàng</li>
              <li>Thiết kế Website Doanh nghiệp</li>
              <li>Thiết kế Website Thời trang</li>
              <li>Thiết kế Website Bất động sản</li>
            </ul>
          </div>
        </div>

        {/* Thông tin, hỗ trợ, hợp tác */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div>
            <h5 className="font-semibold mb-4">Thông tin</h5>
            <ul className="space-y-2">
              <li>Về chúng tôi</li>
              <li>Bảng giá</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Hỗ trợ</h5>
            <ul className="space-y-2">
              <li>Đăng ký Tên miền</li>
              <li>Hướng dẫn thanh toán</li>
              <li>Video hướng dẫn</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Hợp tác</h5>
            <ul className="space-y-2">
              <li>Chương trình Đối tác</li>
              <li>Cộng tác viên bán hàng</li>
              <li>Liên hệ hợp tác</li>
            </ul>
          </div>
        </div>

        {/* Mobile Apps */}
        <div className="mt-8">
          <h5 className="font-semibold mb-4">Zozo Mobile</h5>
          <p>Quản lý bán hàng thuận tiện trên ứng dụng di động</p>
          <div className="flex space-x-4 mt-2">
            {/* <Link href="#"><Image src="/app-store.png" alt="App Store" width={150} height={50} /></Link>
            <Link href="#"><Image src="/google-play.png" alt="Google Play" width={150} height={50} /></Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
