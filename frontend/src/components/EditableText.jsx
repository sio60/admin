import React, { useEffect, useState } from 'react'
import { useEditMode } from '../context/EditModeContext'
import { useServerAdmin } from '../context/ServerAdminProvider'
import { getContent, upsertContent } from '../routes/admin-auth'
import '../styles/editable.css'

export default function EditableText({ blockKey, tag = 'p', placeholder='내용을 입력하세요', className='' }) {
  const { on } = useEditMode()
  const { token } = useServerAdmin()
  const [value, setValue] = useState('')
  const [dirty, setDirty] = useState(false)
  const Tag = tag

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await getContent(blockKey) // 서버에서 해당 key만 내려주도록 구현 권장
        const text = res?.content?.text ?? res?.items?.[0]?.content?.text ?? ''
        if (alive) setValue(text)
      } catch {}
    })()
    return () => { alive = false }
  }, [blockKey])

  async function save() {
    await upsertContent(token, { key: blockKey, type: 'text', content: { text: value } })
    setDirty(false)
  }

  if (!on) return <Tag className={className}>{value || placeholder}</Tag>

  return (
    <div className={`editable ${dirty ? 'dirty' : ''}`}>
      <textarea
        value={value}
        onChange={e=>{ setValue(e.target.value); setDirty(true) }}
        placeholder={placeholder}
      />
      <div className="toolbar">
        <button onClick={save} disabled={!dirty}>저장</button>
      </div>
    </div>
  )
}
