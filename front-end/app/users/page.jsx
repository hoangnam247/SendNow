import Link from 'next/link';
import UserList from './UserList'; // Đường dẫn đến component SearchForm

export const  metadata = {
  title : " Danh sach nguoi dung "
};
const getUsers = async () => {
  const response = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
  return response.json();
};
export default async function UsersPage() {

    const {success, data: users} = await getUsers();
    if (!success){
      return <h2>Khong the tai nguoi dung</h2>
    }
  return (
    <div>
    <h1>Quản Lý Người Dùng</h1>
    <Link href="/users/create" className="btn btn-primary mb3">ADD</Link>
    <UserList users={users}/>
    
    </div>
  )
}
