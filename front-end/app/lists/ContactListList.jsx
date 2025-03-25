"use client"
import { useState, useRef, useEffect } from "react";
import { debounce } from '../utils/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";
import Pagination from "../_components/Pagination"; // Giả sử bạn có Pagination component
import SearchForm from './SearchForm';
import {
  UserPlusIcon,
  ArrowTrendingUpIcon,
  ChevronDownIcon ,
  UsersIcon ,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';


import { toast, ToastContainer } from "react-toastify"; // Import Toast từ react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS của Toastify
import {Tooltip} from "@nextui-org/tooltip";
import { useToken } from '../contexts/TokenContext';

const ContactListsList = ({ lists, total, current, pageSize, query }) => {
  const [currentPage, setCurrentPage] = useState(current);
  const [querySearch, setQuerySearch] = useState(query);
  const [initialLists, setInitialLists] = useState(lists);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const  { token } = useToken();
  useEffect(() => {
    // Cập nhật lại khi trang thay đổi
    setCurrentPage(current);
    setQuerySearch(query);
    setInitialLists(lists);
  }, [current, query, lists]);

  const handleSearch = debounce((e) => {
    const query = e.target.value;
    setQuerySearch(query); // Cập nhật trạng thái tìm kiếm
    setCurrentPage(1);  // Reset to first page on new search
    updateURL(query, 1); // Cập nhật URL
  }, 300);

  const updateURL = (newQuery, page) => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set('query', newQuery);
    updatedSearchParams.set('current', page); // Reset page to 1

    router.push(`${window.location.pathname}?${updatedSearchParams.toString()}`, undefined, { shallow: true });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL(querySearch, page); // Cập nhật URL khi thay đổi trang
  };

  const [dropdownOpen, setDropdownOpen] = useState(null); // Trạng thái kiểm soát menu dropdown
  const dropdownRef = useRef(null); // Tạo ref cho dropdown

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null); // Đóng dropdown nếu click ra ngoài
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const toggleDropdown = (index) => {
    setDropdownOpen((prev) => (prev === index ? null : index)); // Đóng/mở dropdown theo từng dòng
  };

  const removeContactList = async (id) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lists/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',

        });
        if (!response.ok) {
            throw new Error('Failed to delete contactlist');
        }
        return response.ok;
    } catch (err) {
        setError(err.message);
        return false;
    }
};

const handleRemoveContactList = async (id) => {
  if (window.confirm('Bạn có chắc chắn muốn xóa danh sách này ? ')) {
    const status = await removeContactList(id); // Hàm thực hiện xóa

    if (status) {
      // Cập nhật lại danh sách sau khi xóa thành công
      setInitialLists((prevLists) => ({
        ...prevLists,
        data: prevLists.data.filter((list) => list.id !== id),
      }));

      // Hiển thị thông báo thành công
      toast.success("Xóa danh sách thành công!", {
        position: "top-right",
        autoClose: 1500, // Đóng tự động sau 2 giây
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      // Hiển thị thông báo lỗi nếu xóa thất bại
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 1500, // Đóng tự động sau 3 giây
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
};

  return (
    <>

  <SearchForm onSearch={handleSearch} />
      <table className="w-full table-auto bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Tên</th>
            <th className="px-4 py-2">Liên hệ</th>
            <th className="px-4 py-2">Tỷ lệ mở</th>
            <th className="px-4 py-2">Tỷ lệ nhấp chuột</th>
            <th className="px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {initialLists?.data?.length > 0 && initialLists?.data?.map((list, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">
              <Link
                  href={`/lists/${list.id}/overview`}
                  className="text-teal-700 hover:text-blue-700 text-xl	"
                >
                  {list.list_name}
                </Link>
                
                <p className="text-gray-400">Ngày tạo: {list.created_at}</p>
              </td>
              <td className="px-4 py-2 text-center">
                <Link
                  href={`/lists/${list.id}/subscribers`}
                  className="text-teal-700 hover:text-blue-700 text-xl"
                >
                  {list.contacts_count}
                </Link>
                <br />
                Liên hệ
              </td>
              <td className="px-4 py-2 text-center">{list.contacts_count}%</td>
              <td className="px-4 py-2 text-center">{list.contacts_count}%</td>
              <td className="px-4 py-2 text-center">
              <div className="relative flex justify-center items-center space-x-4">
                    <Tooltip content="Thêm liên hệ">
                      <Link href={`/lists/${list.id}/subscribers/create`} className="relative group inline-block">
                        <div className="border border-gray-300 rounded-lg p-2 hover:border-gray-500 transition duration-200">
                          <UserPlusIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </div>
                      </Link>
                    </Tooltip>
                    {/* ArrowTrendingUpIcon */}
                    <Link
                      href="/analytics/trend"
                      className="inline-flex items-center space-x-1 border border-gray-300 rounded-md px-2 py-1 hover:border-gray-500 hover:text-gray-700 transition duration-200"
                    >
                      <ArrowTrendingUpIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500">Tổng Quan</span>
                    </Link>

                    {/* ChevronDownIcon */}
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="border border-gray-300 rounded-lg p-2 hover:border-gray-500 transition duration-200"
                    >
                      <ChevronDownIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    </button>

                    {/* Dropdown menu */}
                    {dropdownOpen === index && (
                      <div ref={dropdownRef}  className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => alert(`Thêm vào danh sách ${list.list_name}`)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <UsersIcon className="h-5 w-5 text-gray-500 mr-2" />
                          <span>Liên Hệ</span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => alert(`Sửa danh sách ${list.list_name}`)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <PencilIcon className="h-5 w-5 text-gray-500 mr-2" />
                          <span>Sửa danh sách</span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleRemoveContactList(list.id)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <TrashIcon className="h-5 w-5 text-gray-500 mr-2" />
                          <span>Xóa danh sách</span>
                        </button>
                      </li>
                    </ul>
                      </div>
                    )}
                  </div>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={handlePageChange}
        
      />
    </>
    
  );
};

export default ContactListsList;
