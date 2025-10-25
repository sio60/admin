import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const PAGE_SIZE = 10;

export default function NoticeList() {
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();

  const page = Math.max(parseInt(sp.get('page') || '1', 10), 1);
  const sort = sp.get('sort') || 'newest'; // newest | viewed | updated | best
  const q = sp.get('q') || '';
  const target = sp.get('target') || 'all';

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const qs = new URLSearchParams({
        page: String(page),
        page_size: String(PAGE_SIZE),
        sort,
      });
      if (q) qs.set('q', q);
      if (target) qs.set('target', target);

      const res = await fetch(`/api/notices?${qs.toString()}`);
      const data = await res.json();
      setRows(data.items || []);
      setTotal(data.total || 0);
      setLoading(false);
    };
    load();
  }, [page, sort, q, target]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const onSearch = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nq = (form.get('q') || '').toString().trim();
    const nt = (form.get('target') || 'all').toString();
    setSp(params => {
      params.set('page', '1');
      if (nq) params.set('q', nq); else params.delete('q');
      params.set('target', nt);
      return params;
    }, { replace: true });
  };

  return (
    <Layout title="Notice">
      <div className="notice-tools">
        <form onSubmit={onSearch} className="notice-search">
          <select name="target" defaultValue={target}>
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="author">작성자</option>
          </select>
          <input name="q" defaultValue={q} placeholder="검색어" />
          <button type="submit">검색</button>

          <select
            value={sort}
            onChange={e => setSp(p => { p.set('sort', e.target.value); return p; })}
            style={{ marginLeft: 12 }}
          >
            <option value="newest">최신순</option>
            <option value="best">추천순</option>
            <option value="viewed">조회순</option>
            <option value="updated">업데이트순</option>
          </select>
        </form>
      </div>

      {loading ? <p>로딩중…</p> : (
        <table className="notice-table">
          <thead>
            <tr>
              <th style={{width:70}}>번호</th>
              <th>제목</th>
              <th style={{width:120}}>작성자</th>
              <th style={{width:140}}>작성일</th>
              <th style={{width:80}}>추천</th>
              <th style={{width:80}}>조회</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td><Link to={`/notice/${r.id}`}>{r.title}</Link></td>
                <td>{r.author || 'Zestco'}</td>
                <td>{new Date(r.published_at).toISOString().slice(0,10)}</td>
                <td>{r.likes ?? 0}</td>
                <td>{r.views ?? 0}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={6} style={{textAlign:'center'}}>게시글이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      )}

      {/* 페이징 */}
      <div className="notice-paging">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              className={`page-btn ${p === page ? 'active' : ''}`}
              onClick={() => setSp(params => { params.set('page', String(p)); return params; })}
            >
              {p}
            </button>
          );
        })}
      </div>
    </Layout>
  );
}
