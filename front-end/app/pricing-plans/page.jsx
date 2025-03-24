import React from 'react';
import '../styles/price_style.css';
import PricingCards from './PricingCards';

const PricePage = async () => {
  // Gọi API từ Laravel để lấy danh sách gói ưu đãi
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pricing-plans`);
  const plans = await response.json();

  return (
    <div className="container">
    <h1 className="title">Báo giá dịch vụ Email Marketing</h1>
    <div className="description">
      <p>
        Giải pháp Email Marketing hiệu quả. Tích hợp công nghệ chống spam{' '}
        <strong>SpamAssassin™</strong>
      </p>
    </div>

    {/* Sử dụng component PricingCards */}
    <PricingCards plans={plans} />
  </div>
  );
};

export default PricePage;
