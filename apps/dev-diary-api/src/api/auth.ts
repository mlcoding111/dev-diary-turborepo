export async function fetchMe() {
  try {
    const res = await fetch(`${process.env.API_URL}/auth/me`, {
      credentials: 'include', // 🔥 sends cookies with the request
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!response.ok) return null;

  return await response.json();
}
