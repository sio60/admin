import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function NoticeDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 조회수 +1
    fetch(`/api/notices/${id}?inc=1`)
      .then((r) => r.json())
      .then((json) => setPost(json))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout title="Notice"><p>로딩중…</p></Layout>;
  if (!post || !post.id) return <Layout title="Notice"><p>게시글이 없습니다.</p></Layout>;

  return (
    <Layout title="Notice">
      <article className="notice-detail">
        <h1 className="notice-title">{post.title}</h1>
        <div className="notice-meta">
          <span>작성자 {post.author || "Zestco"}</span>
          <span> · </span>
          <span>
            {new Date(post.published_at || post.created_at).toLocaleString()}
          </span>
          <span> · 조회 {post.views ?? 0}</span>
        </div>

        <div
          className="notice-content"
          dangerouslySetInnerHTML={{ __html: post.content_html || "" }}
        />
      </article>

      <div className="notice-actions">
        <Link to="/notice" className="btn">목록</Link>
      </div>
    </Layout>
  );
}
