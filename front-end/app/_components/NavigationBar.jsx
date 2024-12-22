import Link from 'next/link';
import { useParams } from 'next/navigation';

const NavigationBar = ({ campaign }) => {
  const { id } = useParams(); // Lấy campaign ID từ URL
  const items = [
    { label: 'Người nhận', icon: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z' },
    { label: 'Cài đặt', icon: 'M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z' },
    { label: 'Mẫu Email', icon: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.1...' },
    { label: 'Lịch trình', icon: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
    { label: 'Xác nhận', icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
  ];

  // Giới hạn chỉ lấy 5 item
  const limitedItems = items.slice(0, 5);

  // Kiểm tra nếu campaign chưa có dữ liệu
  const isLoading = !campaign || !campaign.data;

  return (
    <div className="flex justify-between space-x-2 w-full">
      {isLoading ? (
        // Skeleton Loader
        <div className="flex flex-1 space-x-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2 animate-pulse">
              <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        // Hiển thị Navigation Items khi dữ liệu có
        limitedItems.map((item, index) => {
          let linkPath = `/campaigns/${id}/template`; // Đường dẫn mặc định

          if (item.label === 'Người nhận') {
            linkPath = `/campaigns/${id}/recipients`;
          } else if (item.label === 'Cài đặt') {
            linkPath = `/campaigns/${id}/setup`;
          } else if (item.label === 'Mẫu Email') {
            linkPath = campaign?.data.email_template_id ? `/campaigns/${id}/template` : `/campaigns/${id}/template/create`;
          } else if (item.label === 'Lịch trình') {
            linkPath = `/campaigns/${id}/schedule`;
          }

          const isEmailTemplateEmpty = !campaign?.data?.email_template_id;
          const isContactListEmpty = !campaign?.data?.contact_list_id;
          const isScheduleEmpty = !campaign?.data?.scheduled_at;
          const isDisabled = (isEmailTemplateEmpty && item.label === 'Mẫu Email') || (isContactListEmpty && item.label === 'Cài đặt' ) || (isScheduleEmpty && item.label === 'Lịch trình' );

          const isLastItem = index === limitedItems.length - 1;

          return (
            <Link
              key={index}
              href={linkPath}
              className={`flex flex-1 items-center space-x-2 text-gray-600 hover:text-teal-500 focus:outline-none ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span>{item.label}</span>
              {!isLastItem && (
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </span>
              )}
            </Link>
          );
        })
      )}
    </div>
  );
};

export default NavigationBar;
