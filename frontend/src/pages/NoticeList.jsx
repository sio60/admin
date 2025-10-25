import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";

const PAGE_SIZE = 10;

export default function NoticeList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const sort = searchParams.get("sort") || "newest"; // newest|viewed|updated|best
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setLoading(true);
    const url = `/api/notices?page=${page}&page_size=${PAGE_SIZE}&sort=${sort}${
      q ? `&q=${encodeURIComponent(q)}&target=all` : ""
    }`;
    fetch(url)
      .then((r) => r.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, [page, sort, q]);

  const totalPages = Math.max(1, Math.ceil((data.total || 0) / PAGE_SIZE));

  const go = (next) => {
    const sp = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null) sp.delete(k);
      else sp.set(k, String(v));
    });
    setSearchParams(sp);
  };

  return (
    <Layout title="Notice">
      <div className="notices-toolbar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go({ page: 1, q });
          }}
          className="notice-search"
        >
          <input
            value={q}
            placeholder="검색어"
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit">검색</button>
        </form>

        <select
          value={sort}
          onChange={(e) => go({ sort: e.target.value, page: 1 })}
        >
          <option value="newest">최신순</option>
          <option value="viewed">조회순</option>
          <option value="updated">업데이트순</option>
          <option value="best">추천순</option>
        </select>
      </div>

      {loading ? (
        <p>로딩중…</p>
      ) : (
        <table className="notice-table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>번호</th>
              <th>제목</th>
              <th style={{ width: 140 }}>작성자</th>
              <th style={{ width: 160 }}>작성일</th>
              <th style={{ width: 90 }}>추천</th>
              <th style={{ width: 90 }}>조회</th>
            </tr>
          </thead>
          <tbody>
            {(data.items || []).map((it) => (
              <tr key={it.id}>
                <td>{it.id}</td>
                <td>
                  <Link to={`/notice/${it.id}`}>{it.title}</Link>
                </td>
                <td>{it.author || "Zestco"}</td>
                <td>
                  {new Date(it.published_at || it.created_at).toLocaleDateString()}
                </td>
                <td>{it.likes ?? 0}</td>
                <td>{it.views ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => go({ page: page - 1 })}>
          «
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => go({ page: page + 1 })}
        >
          »
        </button>
      </div>
    </Layout>
  );
}
