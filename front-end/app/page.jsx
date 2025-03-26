"use client"
import React, { useState, useEffect } from "react";
import Carousel from "./_components/Carousel";
import  useScrollMagic  from "./_components/useScrollMagic";
import Image from 'next/image';

import {Tooltip} from "@nextui-org/tooltip";
import {
  UserGroupIcon,
  PlusIcon ,
  MinusIcon ,
  EnvelopeOpenIcon 
} from '@heroicons/react/24/outline';
export default function HomePage() {
  const [openFAQ, setOpenFAQ] = useState({});

  const handleToggle = (index) => {
    setOpenFAQ((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useScrollMagic(".scroll-item", "animate-fade-in");

  return (
    
    <div >
      <Carousel/>
    {/* Thêm phần khách hàng */}
      <div className="text-center py-16 scroll-item opacity-0 translate-y-10 ">
        <h2 className="text-3xl font-bold text-gray-900">KHÁCH HÀNG</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Các thương hiệu hàng đầu đang sử dụng Zozo EMA là một kênh truyền thông đắc lực cho việc chăm sóc khách hàng, tăng hiệu quả truyền thông qua Email Marketing.
        </p>
        <div className="flex justify-center gap-8 mt-8 ">
          {[
            { src: "/images/bk.png", name: "ĐH Bách Khoa" },
            { src: "/images/kt.png", name: "Khơ Thị" },
            { src: "/images/tv.png", name: "TV HUB" },
            { src: "/images/ph.png", name: "Pizza Hut" },
            { src: "/images/iig.png", name: "IIG Việt Nam" },
            { src: "/images/bv.png", name: "BAOVIET Life" },
          ].map((client, index) => (
            <Tooltip key={index} content={client.name} className="relative group">
              <div className="w-36 h-36 rounded-full border-2 border-gray-300 overflow-hidden hover:scale-110 transition-transform duration-300">
                <Image src={client.src} alt={client.name}   width={800}  // Set the width of the image
  height={400} className="w-full h-full object-contain" />
              </div>
            </Tooltip>
          ))}
        </div>
      </div>

    {/* Thêm phần tính năng nổi bật */}
    <div className="text-center py-16 bg-gray-50 scroll-item opacity-0 translate-y-10 ">
        <h2 className="text-3xl font-bold text-gray-900">TÍNH NĂNG NỔI BẬT!</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Những tính năng vượt trội chỉ có trên hệ thống Email Marketing của chúng tôi.
        </p>
        <div className="flex justify-center flex-wrap gap-8 mt-8 px-6 md:px-0 max-w-6xl mx-auto">
          {[
            { icon: "📊", title: "Quản trị trực quan", desc: "Giao diện trực quan, dễ sử dụng với đa ngôn ngữ, không cầu kỳ phức tạp." },
            { icon: "⚡", title: "Gửi Email tốc độ cao", desc: "Máy chủ Zozo EMA được xử lý gửi đa luồng với nhiều máy chủ gửi khác nhau." },
            { icon: "📅", title: "Thiết lập lịch tự động", desc: "Dễ dàng tạo các chiến dịch tự động chăm sóc khách hàng theo kế hoạch lên sẵn của Doanh Nghiệp." },
            { icon: "🚀", title: "Triển khai nhanh chóng", desc: "Bạn dễ dàng thực hiện các chiến dịch Marketing tới khách hàng chỉ trong 15 phút." },
            { icon: "📩", title: "120+ Mẫu Email phổ biến", desc: "Zozo EMA tích hợp sẵn các mẫu email phổ biến, đáp ứng đa năng các nhu cầu sử dụng." },
            { icon: "🛡", title: "Loại bỏ email rác", desc: "Sử dụng công nghệ xác thực email, loại bỏ 99% email ảo, giúp tăng tỷ lệ inbox." },
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 w-80">
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="text-lg font-semibold mt-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

    {/* Thêm phần lợi ích hàng đầu */}
    <div className="text-center py-16 scroll-item opacity-0 translate-y-10 ">
        <h2 className="text-3xl font-bold text-gray-900">Lợi ích hàng đầu khi quảng cáo qua Email Marketing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
          {[
            { title: "Tiết kiệm chi phí Marketing", desc: "Nền tảng Email Marketing tiết kiệm và hiệu quả hơn nhiều so với các kênh quảng cáo khác với chi phí chỉ khoảng 20 đến 40đ cho mỗi Email." },
            { title: "Tăng tỷ lệ chuyển đổi", desc: "Khoảng 66% người tiêu dùng đã thực hiện hành động mua hàng sau khi nhận được Email quảng cáo." },
            { title: "Tăng khả năng giữ chân khách hàng", desc: "Việc duy trì liên lạc qua Email có thể tăng khả năng giữ chân khách hàng lên đến 80%." },
            { title: "Tích hợp dễ dàng với công cụ khác", desc: "73% nhà tiếp thị sử dụng email như một phần trong chiến lược tổng thể." },
            { title: "Cá nhân hóa nội dung", desc: "Cá nhân hóa nội dung trong Email Marketing giúp tăng tỷ lệ chuyển đổi, lòng trung thành và doanh thu." },
            { title: "Tăng nhận diện thương hiệu", desc: "Email Marketing giúp bạn duy trì liên lạc thường xuyên với khách hàng." },
          ].map((benefit, index) => (
            <div key={index} className="p-6 border rounded-lg shadow-md text-center bg-white text-gray-900 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
              <div className="relative w-full h-20 flex items-center justify-center rounded-t-lg transition-all duration-300 hover:bg-blue-500">
                <div className="text-4xl text-gray-500 transition-all duration-300 hover:text-white"><EnvelopeOpenIcon  className="h-8 w-8 text-gray-500" /></div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                <p className="text-sm mt-2 text-gray-600">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    {/* Thêm phần giải pháp Email Marketing */}
    <div className="text-center py-16 scroll-item opacity-0 translate-y-10 ">
        <h2 className="text-3xl font-bold text-gray-900">Giải pháp Email marketing phù hợp với những ai?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Dịch vụ Email Marketing Zozo EMA phù hợp với hầu hết những Doanh Nghiệp, cá nhân và tổ chức có nhu cầu bán hàng, tiếp thị, giới thiệu Doanh Nghiệp, giới thiệu sản phẩm.
        </p>

        <div className="mt-10 space-y-8 max-w-4xl mx-auto">
          {[
            {
              id: 1,
              title: "Cá nhân - Nhóm",
              description:
                "Freelancers có thể sử dụng phần mềm Email Marketing để xây dựng thương hiệu cá nhân, chia sẻ kiến thức chuyên môn, nâng cao độ uy tín trong lĩnh vực của mình. Người sáng tạo nội dung (Bloggers, Influencers) có thể sử dụng Email Marketing để giới thiệu đến người theo dõi những nội dung mới như blog, video, podcast, quảng cáo sản phẩm tiếp thị liên kết hoặc mời tham gia các sự kiện, live trực tuyến.",
            },
            {
              id: 2,
              title: "Doanh Nghiệp",
              description:
                "Đối với Doanh Nghiệp, Email Marketing là công cụ quan trọng để kết nối với các khách hàng Doanh Nghiệp khác bằng việc chia sẻ case study, báo cáo thị trường, hoặc mời tham gia webinar, hội thảo... giúp xây dựng uy tín trong ngành và nuôi dưỡng mối quan hệ với khách hàng tiềm năng. Đối với các Doanh Nghiệp B2C, giải pháp Email Marketing hỗ trợ việc gửi Email hàng loạt nhằm quảng bá giới thiệu sản phẩm, khuyến mãi nhân dịp Black Friday, Giáng Sinh, Năm mới,...",
            },
            {
              id: 3,
              title: "Trường học - Tổ chức giáo dục",
              description:
                "Email Marketing giúp cung cấp thông tin về tuyển sinh, các khóa học mới kèm ưu đãi, thông báo các hoạt động, sự kiện và tăng khả năng tương tác với phụ huynh và học sinh, sinh viên.",
            },
          ].map((solution) => (
            <div key={solution.id} className="flex items-start space-x-6 text-left">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-200 text-gray-900 font-bold text-lg flex items-center justify-center rounded-full">
                {solution.id}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{solution.title}</h3>
                <p className="text-gray-600 mt-2">{solution.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
{/* Thêm phần câu hỏi thường gặp */}
  <div className="text-center py-16 bg-gray-50 scroll-item opacity-0 translate-y-10 ">
        <h2 className="text-3xl font-bold text-gray-900">CÂU HỎI THƯỜNG GẶP</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-8">
        {[  
            { question: "Email marketing là gì?", answer: "Email marketing là phương pháp tiếp thị sử dụng email để giao tiếp với khách hàng." },
            { question: "Tại sao email của tôi hay vào spam?", answer: "Có một số lý do hay gặp như sau:\n(1) Tỷ lệ mở email (open rate) quá thấp: Để tăng tỷ lệ mở email bạn cần đặt tiêu đề thật thu hút gửi các nội dung có hữu ích đối với người nhận.\n(2) Nội dung email có nhiều các từ khóa quảng cáo như khuyến mãi, giảm giá... dễ kích hoạt bộ lọc spam dựa trên thuật toán trí tuệ nhân tạo của Gmail. \n(3) Tần suất gửi email quá nhiều, khiến người nhận khó chịu và đánh dấu email spam. \n(4) Danh sách email không chất lượng, đã bị khai thác bởi nhiều Doanh Nghiệp. " },
            { question: "Zozo EMA có cung cấp dùng thử không?", answer: "Có, Zozo EMA có cung cấp DÙNG THỬ MIỄN PHÍ 10 ngày. Zozo để khách hàng trải nghiệm. Hiện tại EMA là nền tảng email marketing mạnh mẽ với nhiều tính năng tiện lợi. Bạn vui lòng truy cập vào: Dùng thử >> Để đăng ký trải nghiệm." },
            { question: "Zozo EMA có thống kê được ai mở mail hay không?", answer: "Zozo EMA cung cấp báo cáo đầy đủ, trực quan bằng biểu đồ về:\n(1) Danh sách những người mở email.\n(2) Danh sách người bấm vào đường link trong email.\n(3) Danh sách email bị trả lại." },
            { question: "Tỉ lệ inbox trên hệ thống email marketing của Zozo EMA có cao không?", answer: "Zozo EMA sử dụng công nghệ gửi mail hiện đại cùng các nền tảng SMTP hiện đại và được tin dùng nhiều nhất như SendGrid, Amazon... cho nên tỉ lệ vào inbox sẽ rất cao nếu thực hiện đúng." },
            { question: "Tại sao tôi phải xác minh email?", answer: "Nhằm đảm bảo quyền lợi cho người dùng cũng như tuân thủ pháp luật, Zozo EMA yêu cầu người dùng xác minh sở hữu với email dùng để gửi, tránh tình trạng mạo danh gửi email lừa đảo." }
            // các câu hỏi khác
          ].map((faq, index) => {
            return (
              <div key={index} className="border-b border-gray-300 py-4 text-left">
                <button
                  onClick={() => handleToggle(index)}  // Sử dụng function ngoài để xử lý
                  className="w-full flex justify-between items-center text-left text-gray-900 font-medium hover:text-blue-500"
                >
                  {faq.question}
                  {openFAQ[index] ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                </button>
                {openFAQ[index] && <p className="text-gray-600 mt-2 whitespace-pre-line">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
