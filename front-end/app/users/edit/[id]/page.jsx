import { notFound } from "next/navigation";
import Form from "./Form"

export const metadata = {
    title : " cap nhat nguoi dung ",
}
const getUser = async (id) => {
    
    const response = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
    const { data : user} = await response.json();
    return user;
}
export default async function EditUserPage({ params }) {
    const { id } = params;
    const user = await getUser(id);
    if (!user){
        return notFound();
    }
  return (
    <div>
        <h1>cap nhat nguoi dung</h1>
        <Form user = {user} id = {id}/>
    </div>
    
  )
}
