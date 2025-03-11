'use client'; // Xác định rằng đây là client-side component

import React from 'react';
import { useParams } from 'next/navigation'; // useParams hook để lấy id từ URL
import EmailEditor from '@/app/_components/EmailEditor';

const CampaignCreatePage = () => {
  const { id } = useParams(); // Lấy `id` từ URL để truyền vào API

  return (
    <div>
      {/* Gọi component EmailEditor với templateId */}
      <EmailEditor templateId={id} />
    </div>
  );
};
CampaignCreatePage.getLayout = (page) => <>{page}</>;

export default CampaignCreatePage;