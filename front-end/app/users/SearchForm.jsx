// components/SearchForm.jsx
"use client"; // Thêm dòng này nếu sử dụng Next.js 13 với React Server Components

export default function SearchForm({onChange}) {
    return (
        <input 
            type="search" 
            className='form-control mb-3' 
            placeholder='Từ khóa ...' 
            onChange={onChange} 
        />
    );
}

