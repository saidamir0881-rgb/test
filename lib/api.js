const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const API_ORIGIN = BASE.replace(/\/api\/?$/, '');
export const assetUrl = (p) => (!p ? '' : p.startsWith('http') ? p : API_ORIGIN + p);

export const getToken = () => (typeof window === 'undefined' ? null : localStorage.getItem('ts_token'));
export const setToken = (t) => {
  if (typeof window === 'undefined') return;
  if (t) localStorage.setItem('ts_token', t);
  else localStorage.removeItem('ts_token');
};

export async function api(path, { method = 'GET', body, query, formData } = {}) {
  const url = new URL(BASE + path);
  if (query) Object.entries(query).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v); });
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (formData) payload = formData;
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }

  let res;
  try {
    res = await fetch(url, { method, headers, body: payload, cache: 'no-store' });
  } catch {
    throw new Error("Serverga ulanib bo'lmadi. Internet va server holatini tekshiring");
  }
  let data = null;
  try { data = await res.json(); } catch { /* javob JSON emas */ }
  if (!res.ok) {
    if (res.status === 401 && token) { setToken(null); window.dispatchEvent(new Event('ts-logout')); }
    const err = new Error(data?.message || 'Xatolik yuz berdi');
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  const r = await api('/uploads', { method: 'POST', formData: fd });
  return r.data; // { url, type }
}
