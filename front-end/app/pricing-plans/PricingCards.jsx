"use client";
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
const PricingCards = ({ plans }) => {
    return (
      <div className="pricingCards">
        {plans.map((plan) => (
          <div className="card" key={plan.id}>
            <h2>{plan.name}</h2>
            <p className="price">{formatPrice(plan.price)}đ</p>
            <ul>
              <li>Hạn mức: {plan.max_emails} Email</li>
              <li>{plan.max_contacts} Liên hệ</li>
              <li>{plan.max_campaigns} Chiến dịch</li>
              <li>{plan.domains} Tên miền gửi</li>
            </ul>
            <button className="button">Đăng ký</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default PricingCards;