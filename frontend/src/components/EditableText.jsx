import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useEditMode } from '../context/EditModeContext'
import '../styles/editable.css'

export default function EditableText({ blockKey, tag = 'p', placeholder='내용을 입력하세요', className='' }) {
  const { on } = useEditMode()
  const [value, setValue] = useState('')
  const [id, setId] = useState(null)
  const [dirty, setDirty] = useState(false)
  const Tag = tag

  useEffect(() => {
    let live = true
    ;(async () => {
      const { data } = await supabase.from('content_blocks').select('id, content').eq('key', blockKey).maybeSingle()
      if (live) {
        setId(data?.id ?? null)
        setValue(data?.content?.text ?? '')
      }
    })()
    return () => { live = false }
  }, [blockKey])

  async function save() {
    const row = { key: blockKey, type: 'text', content: { text: value } }
    if (id) row.id = id
    const { data, error } = await supabase.from('content_blocks').upsert(row).select('id').single()
    if (!error && data) { setId(data.id); setDirty(false) }
  }

  if (!on) return <Tag className={className}>{value || placeholder}</Tag>

  return (
    <div className={`editable ${dirty ? 'dirty' : ''}`}>
      <textarea value={value} onChange={e=>{ setValue(e.target.value); setDirty(true) }} placeholder={placeholder} />
      <div className="toolbar">
        <button onClick={save} disabled={!dirty}>저장</button>
      </div>
    </div>
  )
}
