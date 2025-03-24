"use client";
import { useState, useEffect } from 'react';
import SearchForm from './SearchForm'; // Đường dẫn đến component SearchForm
import { debounce } from '../utils/utils';
import Link from 'next/link';

export default function UserList({ users }) {
    const [usersData, setUsersData] = useState(users); // Khởi tạo từ props ban đầu
    const [error, setError] = useState(null); // Trạng thái lỗi

    const getUsers = async (q = "") => {
        setError(null); // Reset lỗi trước đó (nếu có)
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?q=${q}`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const { data: users } = await response.json();
            setUsersData(users); // Cập nhật bảng dữ liệu với kết quả tìm kiếm
        } catch (err) {
            setError(err.message); // Ghi nhận lỗi
        }
    };

    const handleRemoveUser = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            const status = await removeUser(id);
            if (status) {
                getUsers(); // Tải lại danh sách sau khi xóa
            }
        }
    };

    const removeUser = async (id) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            return response.ok;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    const handleSearch = debounce((e) => {
        getUsers(e.target.value); // Tìm kiếm và cập nhật bảng
    }, 300);

    useEffect(() => {
        getUsers(); // Tải dữ liệu lần đầu khi trang load
    }, []);

    return (
        <>
            <SearchForm onChange={handleSearch} />
            {error && <p className="text-red-500">{error}</p>} {/* Hiển thị lỗi */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border border-gray-300">STT</th>
                            <th className="px-4 py-2 border border-gray-300">Tên</th>
                            <th className="px-4 py-2 border border-gray-300">Email</th>
                            <th className="px-4 py-2 border border-gray-300">Sửa</th>
                            <th className="px-4 py-2 border border-gray-300">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData?.data?.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border border-gray-300 text-center">{index + 1}</td>
                                <td className="px-4 py-2 border border-gray-300">{user.name}</td>
                                <td className="px-4 py-2 border border-gray-300">{user.email}</td>
                                <td className="px-4 py-2 border border-gray-300 text-center">
                                    <Link
                                        href={`/users/edit/${user.id}`}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded"
                                    >
                                        Edit
                                    </Link>
                                </td>
                                <td className="px-4 py-2 border border-gray-300 text-center">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                                        onClick={() => handleRemoveUser(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
