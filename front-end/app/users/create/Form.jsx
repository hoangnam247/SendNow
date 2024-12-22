"use client"
import React, { useRef, useState } from 'react'
import { handleCreateUser } from '../action'

export default function Form() {
    const [msg,setMsg] = useState("");
    const formRef = useRef();
    
  return (
    <form 
        ref={formRef}
        action={async (formData) => {
            const response = await handleCreateUser(formData);
            if(!response) {
            setMsg("Da co loi xay ra.Vui long thu lai sau");
            return;
            }
            setMsg('them nguoi dung thanh cong');
            formRef.current.reset();
    }}>
    <div className='mb-3'>
        <label htmlFor="">Ten</label>
        <input 
        type="text" 
        name="name" 
        className='form-control'
        placeholder='ten...' 
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
        required 
        />
    </div>
    <button className='btn btn-primary'>Add</button>
    {msg  && <span className='text-danger'>{msg}</span>}
</form>
  )
}
