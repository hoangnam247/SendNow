"use client"
import React, { useRef, useState } from 'react'
import { handleUpdateUser } from '../../action';

export default function Form({ user, id }) {
    const [msg,setMsg] = useState("");
    const formRef = useRef();
    
  return (
    <form 
        ref={formRef}
        action={async (formData) => {
            formData.append("id",id);
            const response = await handleUpdateUser(formData);
            if(!response) {
                setMsg("Da co loi xay ra.Vui long thu lai sau");
                return;
                }
                setMsg('cap nhat nguoi dung thanh cong');
    }}>
    <div className='mb-3'>
        <label htmlFor="">Ten</label>
        <input 
        type="text" 
        name="name" 
        className='form-control'
        placeholder='ten...' 
        defaultValue={user.name}
        required
        />
    </div>
    <div className='mb-3'>
        <label htmlFor="">Email</label>
        <input 
        type="email" 
        name="email" 
        className='form-control'
        placeholder='Email...' 
        defaultValue={user.email}
        required
        />
    </div>
    <div className='mb-3'>
        <label htmlFor="">Mat khau</label>
        <input 
        type="password" 
        name="password" 
        className='form-control'
        placeholder='Mat Khau...'
        />
    </div>
    <button className='btn btn-primary'>UPDATE</button>
    {msg  && <span className='text-danger'>{msg}</span>}
</form>
  )
}
