import React, { useState } from 'react'
import Layout from '../components/Layout'
import EditableText from '../components/EditableText'

export default function Contact() {
  // 폼은 우선 프론트만. 백엔드(CF) 연동 시 /api/contact로 POST
  const [sent, setSent] = useState(false)
  return (
    <Layout title="Contact">
      <EditableText blockKey="contact.head" tag="div" placeholder="문의 안내문" />
      <form className="contact-form" onSubmit={e=>{ e.preventDefault(); setSent(true) }}>
        <label>이름 <input required /></label>
        <label>이메일 <input type="email" required /></label>
        <label>내용 <textarea required /></label>
        <button type="submit">보내기</button>
      </form>
      {sent && <p>임시: 전송 완료(데모)</p>}
    </Layout>
  )
}
