import type { Metadata } from 'next'
import { InputBox } from '@/components/custom/inputBox'

export const metadata: Metadata = {
  title: 'InputBox page',
}

export default function InputBoxPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      {/* Section title */}
      <h1 className="text-2xl font-bold mb-10">Primary</h1>

      {/* Column headers */}
      <div className="grid grid-cols-[150px_394px_394px] gap-x-16 mb-4">
        <div></div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Label</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Search</p>
        </div>
      </div>

      {/* Table rows */}
      <div className="grid grid-cols-[150px_394px_394px] gap-x-16 gap-y-8 items-start">
        {/* DEFAULT */}
        <p className="text-sm font-medium pt-6">default</p>
        <div className="space-y-1">
          <InputBox placeholder="PlaceHolder" />
          <p className="text-xs text-muted-foreground">this is information text</p>
        </div>
        <InputBox variant="accent" placeholder="PlaceHolder" containerClassName="border-black" />

        {/* FOCUSED */}
        <p className="text-sm font-medium pt-6">focused</p>
        <div className="space-y-1">
          <InputBox state="focused" placeholder="PlaceHolder" />
          <p className="text-xs text-muted-foreground">this is information text</p>
        </div>
        <InputBox
          variant="accent"
          state="focused"
          placeholder="PlaceHolder"
          containerClassName="border-black"
        />

        {/* FILLED */}
        <p className="text-sm font-medium pt-6">filled</p>
        <div className="space-y-1">
          <InputBox state="filled" defaultValue="PlaceHolder" />
          <p className="text-xs text-muted-foreground">this is information text</p>
        </div>
        <InputBox
          variant="accent"
          state="filled"
          defaultValue="PlaceHolder"
          containerClassName="border-black"
        />

        {/* ERROR */}
        <p className="text-sm font-medium pt-6">error</p>
        <div className="space-y-1">
          <InputBox state="error" placeholder="PlaceHolder" />
          <p className="text-xs text-muted-foreground">this is information text</p>
        </div>
        <InputBox variant="accent" state="error" placeholder="PlaceHolder" />

        {/* DISABLED */}
        <p className="text-sm font-medium pt-6">disabled</p>
        <div className="space-y-1">
          <InputBox state="disabled" placeholder="PlaceHolder" />
          <p className="text-xs text-muted-foreground">this is information text</p>
        </div>
        <InputBox variant="accent" state="disabled" placeholder="PlaceHolder" />
      </div>

      {/* SECONDARY SECTION */}
      <h1 className="text-2xl font-bold mb-10 mt-16">Secondary</h1>

      {/* Column headers */}
      <div className="grid grid-cols-[150px_394px_394px] gap-x-16 mb-4">
        <div></div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Label</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Search</p>
        </div>
      </div>

      {/* Table rows */}
      <div className="grid grid-cols-[150px_394px_394px] gap-x-16 gap-y-8 items-start">
        {/* DEFAULT */}
        <p className="text-sm font-medium pt-6">default</p>
        <div className="space-y-1">
          <InputBox placeholder="PlaceHolder" />
          <p className="text-xs text-muted-foreground">this is information text</p>
        </div>
        <InputBox
          variant="secondary-accent"
          placeholder="PlaceHolder"
          containerClassName="border-black"
        />

        {/* FOCUSED */}
        <p className="text-sm font-medium pt-6">focused</p>
        <div className="space-y-1">
          <InputBox state="focused" placeholder="PlaceHolder" />
          <p className="text-xs text-muted-foreground">this is information text</p>
        </div>
        <InputBox
          variant="secondary-accent"
          state="focused"
          placeholder="PlaceHolder"
          containerClassName="border-black"
        />

        {/* FILLED */}
        <p className="text-sm font-medium pt-6">filled</p>
        <div className="space-y-1">
          <InputBox state="filled" defaultValue="PlaceHolder" />
          <p className="text-xs text-muted-foreground">this is information text</p>
        </div>
        <InputBox
          variant="secondary-accent"
          state="filled"
          defaultValue="PlaceHolder"
          containerClassName="border-black"
        />

        {/* ERROR */}
        <p className="text-sm font-medium pt-6">error</p>
        <div className="space-y-1">
          <InputBox state="error" placeholder="PlaceHolder" />
          <p className="text-xs text-muted-foreground">this is information text</p>
        </div>
        <InputBox variant="secondary-accent" state="error" placeholder="PlaceHolder" />

        {/* DISABLED */}
        <p className="text-sm font-medium pt-6">disabled</p>
        <div className="space-y-1">
          <InputBox state="disabled" placeholder="PlaceHolder" />
          <p className="text-xs text-muted-foreground">this is information text</p>
        </div>
        <InputBox variant="secondary-accent" state="disabled" placeholder="PlaceHolder" />
      </div>
    </div>
  )
}
