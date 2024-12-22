'use server';
export async function fetchLists(token) {
  const res = await fetch(`${process.env.SERVER_API}/lists`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error('Không thể tải danh sách liên hệ');
  }
  return data.data.data; // Trả về danh sách
}

export async function fetchContacts(listId, token) {
  const res = await fetch(`${process.env.SERVER_API}/lists/${listId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  
  if (!res.ok || !data.success) {
    throw new Error('Không thể tải danh sách liên hệ');
  }
  return data; // Trả về dữ liệu liên hệ
}
