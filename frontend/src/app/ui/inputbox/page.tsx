import type { Metadata } from 'next'
import { InputBox } from '@/components/custom/inputBox'

export const metadata: Metadata = {
  title: 'InputBox page',
}

function InputBoxPage() {
  return (
    <div className="min-h-screen bg-white p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center">
        InputBox page
      </h1>

      {/* Default */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Default</p>
        <InputBox placeholder="Search..." />
      </div>

      {/* Focused */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Focused</p>
        <InputBox state="focused" placeholder="Search..." />
      </div>

      {/* Filled */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Filled</p>
        <InputBox
          state="filled"
          defaultValue="Query text"
        />
      </div>

      {/* Error */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Error</p>
        <InputBox
          state="error"
          placeholder="Search..."
        />
      </div>

      {/* Disabled */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Disabled</p>
        <InputBox
          state="disabled"
          placeholder="Search..."
        />
      </div>
    </div>
  )
}

export default InputBoxPage
