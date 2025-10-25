import React, { useState } from 'react';
import { useServerAdmin } from '../context/ServerAdminProvider';

export default function AdminLoginButton() {
  const { isAdmin, loginWithPassword, logout } = useServerAdmin();
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAdmin) {
    return (
      <button onClick={logout} className="btn">
        관리자 로그아웃
      </button>
    );
  }

  async function handleLogin() {
    setErr('');
    setLoading(true);
    const ok = await loginWithPassword(pw);
    setLoading(false);
    if (!ok) {
      setErr('비밀번호가 올바르지 않거나, API 서버 경로가 맞지 않습니다.');
      return;
    }
    setOpen(false);
    setPw('');
  }

  return (
    <>
      <button onClick={() => setOpen(v => !v)} className="btn">
        관리자 로그인
      </button>
      {open && (
        <div className="modal card" style={{ position: 'fixed', top: 80, right: 20, zIndex: 1500, width: 300 }}>
          <h4 style={{ marginTop: 0 }}>관리자 비밀번호</h4>
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && handleLogin()}
            disabled={loading}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleLogin} className="btn" disabled={loading || !pw}>
              {loading ? '로그인 중…' : '로그인'}
            </button>
            <button onClick={() => setOpen(false)} className="btn" disabled={loading}>
              취소
            </button>
          </div>
          {err && <p className="error" style={{ color: '#b00020' }}>{err}</p>}
        </div>
      )}
    </>
  );
}
