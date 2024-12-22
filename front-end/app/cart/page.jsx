"use client";
import { useState } from 'react';

import styles from '../styles/checkout.module.css';


export default function Checkout() {
    const [discountCode, setDiscountCode] = useState('');
    const [total, setTotal] = useState(3000000);
    const [discountApplied, setDiscountApplied] = useState(false);
  
    const handleDiscountApply = () => {
      if (discountCode === 'DISCOUNT50') {
        setTotal(total - 50000);
        setDiscountApplied(true);
      }
    };
  
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.steps}>
          <div className={styles.stepActive}>Giỏ hàng</div>
          <div className={styles.step}>Thông tin khách hàng</div>
          <div className={styles.step}>Thanh toán</div>
          <div className={styles.step}>Hoàn thành</div>
        </div>
  
        <div className={styles.checkoutContent}>
          {/* Left Section: Product Table */}
          <div className={styles.productTable}>
          <table className={styles.productTableElement}>
    <thead>
      <tr>
        <th>Tên</th>
        <th>Thời gian</th>
        <th>Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Tùy chỉnh: CRE-50K</td>
        <td></td>
        <td>3.000.000đ</td>
      </tr>
    </tbody>
  </table>
          </div>
  
          {/* Right Section: Checkout Summary */}
          <div className={styles.checkoutSummary}>
            <div className={styles.discountSection}>
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button onClick={handleDiscountApply}>Áp dụng</button>
            </div>
  
            <div className={styles.totalSection}>
              <p>Tổng tiền: 3.000.000đ</p>
              <p>VAT: 0đ</p>
              <p className={styles.totalAmount}>Tổng thanh toán: {total.toLocaleString()}đ</p>
            </div>
  
            <button className={styles.continueButton}>Tiếp tục</button>
          </div>
        </div>
      </div>
    );
  }