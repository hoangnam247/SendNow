export async function POST(request) {
  const body = await request.json();
  const sessionToken = body.access_token;
  const expiresAt = body.expiresAt;

  // Kiểm tra sessionToken và expiresAt có hợp lệ không
  if (!sessionToken) {
    return Response.json(
      { message: 'Không nhận được session token' },
      { status: 400 }
    );
  }

  if (!expiresAt || isNaN(new Date(expiresAt).getTime())) {
    return Response.json(
      { message: 'Ngày hết hạn không hợp lệ' },
      { status: 400 }
    );
  }

  // Chuyển đổi expiresAt thành định dạng UTC
  const expiresDate = new Date(expiresAt).toUTCString();

  return Response.json(body, {
    status: 200,
    headers: {
      'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`
    }
  });
}
