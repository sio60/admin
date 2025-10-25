import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useEditMode } from '../context/EditModeContext'
import '../styles/editable.css'

export default function EditableImage({ blockKey, alt='', className='', width, height }) {
  const { on } = useEditMode()
  const [url, setUrl] = useState('')
  const [id, setId] = useState(null)

  useEffect(() => {
    let live = true
    ;(async () => {
      const { data } = await supabase.from('content_blocks').select('id, content').eq('key', blockKey).maybeSingle()
      if (live) { setId(data?.id ?? null); setUrl(data?.content?.url ?? '') }
    })()
    return () => { live = false }
  }, [blockKey])

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split('.').pop()
    const path = `${blockKey}-${crypto.randomUUID()}.${ext}`

    const { error: upErr } = await supabase.storage.from('images').upload(path, file)
    if (upErr) return

    const { data: pub } = supabase.storage.from('images').getPublicUrl(path)
    const row = { key: blockKey, type: 'image', content: { url: pub.publicUrl } }
    if (id) row.id = id
    const { data: saved } = await supabase.from('content_blocks').upsert(row).select('id').single()
    setId(saved.id)
    setUrl(pub.publicUrl)
  }

  return (
    <div className="editable">
      {url ? <img src={url} alt={alt} className={className} width={width} height={height}/> : <div className={`image-placeholder ${className}`}>이미지 없음</div>}
      {on && (
        <label className="toolbar">
          <input type="file" accept="image/*" onChange={handleFile} />
          이미지 바꾸기
        </label>
      )}
    </div>
  )
}
