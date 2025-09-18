export async function apiFetch(endpoint, options = {}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.access_token;

  const res = await fetch(endpoint, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}
