import { cn } from '@/lib/utils'

export function TogglePreview({
  on = false,
  size = 'sm',
}: {
  on?: boolean
  size?: 'sm' | 'lg'
}) {
  const trackClass = size === 'lg' ? 'h-7 w-12' : 'h-6 w-10'
  const knobClass = size === 'lg' ? 'size-5' : 'size-4'

  return (
    <div
      className={cn(
        'relative rounded-full transition-colors',
        trackClass,
        on ? 'bg-[#F6C531]' : 'bg-[#D1D5DB]'
      )}
    >
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm transition-all',
          knobClass,
          on ? (size === 'lg' ? 'right-1' : 'right-1') : 'left-1'
        )}
      />
    </div>
  )
}

export function ToggleMatrix() {
  return (
    <div className="flex flex-wrap gap-10">
      <div className="space-y-4">
        <p className="text-sm font-medium text-[#7A6B3F]">Small</p>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <TogglePreview on={false} size="sm" />
            <p className="mt-2 text-xs text-[#7A6B3F]">Off</p>
          </div>
          <div className="text-center">
            <TogglePreview on size="sm" />
            <p className="mt-2 text-xs text-[#7A6B3F]">On</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-[#7A6B3F]">Large</p>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <TogglePreview on={false} size="lg" />
            <p className="mt-2 text-xs text-[#7A6B3F]">Off</p>
          </div>
          <div className="text-center">
            <TogglePreview on size="lg" />
            <p className="mt-2 text-xs text-[#7A6B3F]">On</p>
          </div>
        </div>
      </div>
    </div>
  )
}
