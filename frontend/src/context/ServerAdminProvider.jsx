import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminVerify, adminLogin } from '../routes/admin-auth';

const AdminCtx = createContext({
  token: '',
  isAdmin: false,
  loading: true,
  loginWithPassword: async (_pw) => false,
  logout: () => {},
});

export function ServerAdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('adm_tk') || '');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // token 변경 시 검증
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!token) {
        if (alive) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }
      const ok = await adminVerify(token);
      if (!alive) return;
      setIsAdmin(ok);
      if (!ok) {
        localStorage.removeItem('adm_tk');
        setToken('');
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [token]);

  async function loginWithPassword(password) {
    const data = await adminLogin(password);
    if (!data?.token) return false;
    localStorage.setItem('adm_tk', data.token);
    setToken(data.token);
    setIsAdmin(true);
    return true;
  }

  function logout() {
    localStorage.removeItem('adm_tk');
    setToken('');
    setIsAdmin(false);
  }

  return (
    <AdminCtx.Provider value={{ token, isAdmin, loading, loginWithPassword, logout }}>
      {children}
    </AdminCtx.Provider>
  );
}

export const useServerAdmin = () => useContext(AdminCtx);
