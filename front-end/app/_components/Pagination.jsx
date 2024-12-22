"use client";
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';

const Pagination = ({ currentPage, pageSize, totalItems, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center space-x-2 mt-4">
      {currentPage > 1 && (
        <button onClick={() => handlePageChange(currentPage - 1)} className="px-4 py-2 bg-gray-300 rounded">Trước</button>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 rounded ${page === currentPage ? 'bg-teal-500 text-white' : 'bg-gray-300'}`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <button onClick={() => handlePageChange(currentPage + 1)} className="px-4 py-2 bg-gray-300 rounded">Sau</button>
      )}
    </div>
  );
};

export default Pagination;
