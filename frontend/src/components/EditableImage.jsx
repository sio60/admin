import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'                 // 업로드 용
import { useEditMode } from '../context/EditModeContext'
import { useServerAdmin } from '../context/ServerAdminProvider'
import { getContent, upsertContent } from '../routes/admin-auth'
import '../styles/editable.css'

export default function EditableImage({ blockKey, alt='', className='', width, height }) {
  const { on } = useEditMode()
  const { token } = useServerAdmin()
  const [url, setUrl] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await getContent(blockKey)
        const u = res?.content?.url ?? res?.items?.[0]?.content?.url ?? ''
        if (alive) setUrl(u)
      } catch {}
    })()
    return () => { alive = false }
  }, [blockKey])

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()
    const path = `${blockKey}-${crypto.randomUUID()}.${ext}`

    // 1) Supabase Storage 업로드
    const { error: upErr } = await supabase.storage.from('images').upload(path, file)
    if (upErr) { alert('업로드 실패'); return }

    const { data: pub } = supabase.storage.from('images').getPublicUrl(path)
    const publicUrl = pub?.publicUrl
    if (!publicUrl) return

    // 2) 컨텐츠 저장(백엔드)
    await upsertContent(token, { key: blockKey, type: 'image', content: { url: publicUrl } })
    setUrl(publicUrl)
  }

  return (
    <div className="editable">
      {url
        ? <img src={url} alt={alt} className={className} width={width} height={height}/>
        : <div className={`image-placeholder ${className}`}>이미지 없음</div>
      }
      {on && (
        <label className="toolbar">
          <input type="file" accept="image/*" onChange={handleFile} />
          이미지 바꾸기
        </label>
      )}
    </div>
  )
}
