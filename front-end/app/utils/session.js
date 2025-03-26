"use server";
export async function fetchUserProfile(token) {
  if (!token) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data?.id) {
      throw new Error("Invalid user data structure");
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
}