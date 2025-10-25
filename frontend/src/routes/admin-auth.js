// .env 에 VITE_API_BASE_URL(백엔드 origin)을 꼭 넣자.
// 예: VITE_API_BASE_URL=https://your-worker.yourname.workers.dev
const API = (() => {
  const envUrl = import.meta?.env?.VITE_API_BASE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');
  // 로컬 개발 기본값
  const host = window.location.host || '';
  if (host.startsWith('localhost') || host.startsWith('127.')) return 'http://127.0.0.1:8787';
  // 같은 오리진에 /api 라우트가 붙어 있을 때만 동작
  return window.location.origin.replace(/\/+$/, '');
})();

/** 공통: JSON 변환 (실패 시 null) */
async function jsonOrNull(res) {
  try { return await res.json(); } catch { return null; }
}

/** 공통: 에러를 null/false로 통일 */
async function safeFetch(url, init) {
  try {
    const res = await fetch(url, { cache: 'no-store', ...init });
    return { ok: res.ok, status: res.status, data: await jsonOrNull(res) };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

/** ===== Admin ===== */
export async function adminLogin(password) {
  const { ok, data } = await safeFetch(`${API}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // simple header지만 POST+JSON은 preflight 없음
    body: JSON.stringify({ password }),
  });
  return ok ? data : null; // 기대: { token, role }
}

export async function adminVerify(token) {
  if (!token) return false;
  const { ok } = await safeFetch(`${API}/api/admin/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return ok;
}

/** ===== Content (PostgREST 프록시) ===== */
export async function getContent(key) {
  const url = new URL(`${API}/api/content`);
  if (key) url.searchParams.set('key', key);
  const { ok, data } = await safeFetch(url.toString());
  // Supabase는 배열로 반환됨. 단일 키면 첫 요소 편의 제공
  if (!ok) return null;
  if (Array.isArray(data)) {
    if (key) return data[0] ?? null;
    return data;
  }
  return data ?? null;
}

/**
 * upsertContent
 * - 백엔드가 PUT/PATCH 모두 허용하므로 PATCH로 통일
 * - Authorization 헤더는 백엔드에서 검사할 때만 의미가 있으므로 옵션으로만 첨부
 */
export async function upsertContent({ key, type = 'text', content = {} }, token) {
  if (!key) throw new Error('key is required');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const { ok, data, status } = await safeFetch(`${API}/api/content`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ key, type, content }),
  });

  // 백엔드가 토큰 확인을 붙였을 경우 401 처리 메시지
  if (!ok && status === 401) return { ok: false, error: 'UNAUTHORIZED' };
  return ok ? { ok: true, data } : { ok: false, error: 'REQUEST_FAILED', data };
}

export async function deleteContent(key, token) {
  if (!key) throw new Error('key is required');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const url = new URL(`${API}/api/content`);
  url.searchParams.set('key', key);

  const { ok, status } = await safeFetch(url.toString(), {
    method: 'DELETE',
    headers,
  });
  if (!ok && status === 401) return { ok: false, error: 'UNAUTHORIZED' };
  return { ok };
}

/** ===== Products (선택: 필요 시 사용) ===== */
export async function listProducts({ status, page = 1, page_size = 12, order = 'asc' } = {}) {
  const url = new URL(`${API}/api/products`);
  if (status) url.searchParams.set('status', status);
  url.searchParams.set('page', String(page));
  url.searchParams.set('page_size', String(page_size));
  url.searchParams.set('order', order);
  const { ok, data } = await safeFetch(url.toString());
  return ok ? data ?? [] : [];
}

export async function getProduct(id) {
  const { ok, data } = await safeFetch(`${API}/api/products/${id}`);
  return ok ? (Array.isArray(data) ? data[0] : data) : null;
}
