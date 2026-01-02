'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordToggle() {
  const [visible, setVisible] = useState(false)

  return (
    <button onClick={() => setVisible(!visible)}>
      {visible ? <Eye /> : <EyeOff />}
    </button>
  )
}
