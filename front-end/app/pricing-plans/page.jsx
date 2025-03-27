import React from 'react';
import '../styles/price_style.css';
import PricingCards from './PricingCards';
import { useToken } from '../contexts/TokenContext';

const getPrice = async (token) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/pricing-plans`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',

      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch lists: ${response.status}, ${errorText}`);
    }

    const { data: lists, total } = await response.json();

    return { success: true, data: lists, total };
  } catch (error) {
    console.error("Error fetching lists:", error);
    return { success: false, error: error.message };
  }
};

const PricePage = async () => {
  const  { token } = useToken();
  const { data: lists } = await getPrice(token);
 
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
    <PricingCards plans={lists} /> 
  </div>
  );
};

export default PricePage;
