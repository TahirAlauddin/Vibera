export function Typography({
  variant = 'regular',
}: {
  variant?: 'heavy' | 'bold' | 'medium' | 'regular' | 'thin'
}) {
  const variantConfig = {
    heavy: {
      label: 'Heavy',
      fontWeight: '800',
    },
    bold: {
      label: 'Bold',
      fontWeight: '700',
    },
    medium: {
      label: 'Medium',
      fontWeight: '600',
    },
    regular: {
      label: 'Regular',
      fontWeight: '400',
    },
    thin: {
      label: 'Thin',
      fontWeight: '300',
    },
  }

  // Font sizes - same for all variants, only changes by heading level
  const headingSizes = {
    h1: '80px',
    h2: '60px',
    h3: '40px',
    h4: '30px',
    h5: '24px',
    h6: '20px',
    body: '16px',
    caption: '14px',
    small: '12px',
    tiny: '10px',
  }

  const currentVariant = variantConfig[variant]

  return (
    <div
      className={`
        relative w-130 min-h-[500px] border-2 rounded-lg p-6 bg-white overflow-hidden
        transition-all duration-200 hover:border-blue-400 cursor-pointer
      `}
    >
      {/* Label */}
      <div className="text-2xl text-gray-500 mb-3">{currentVariant.label}</div>

      {/* Heading hierarchy */}
      <div className="space-y-2 mt-8">
        <h1 style={{ fontSize: headingSizes.h1, fontWeight: currentVariant.fontWeight }}>
          Heading 1
        </h1>
        <h2 style={{ fontSize: headingSizes.h2, fontWeight: currentVariant.fontWeight }}>
          Heading 2
        </h2>
        <h3 style={{ fontSize: headingSizes.h3, fontWeight: currentVariant.fontWeight }}>
          Heading 3
        </h3>
        <h4 style={{ fontSize: headingSizes.h4, fontWeight: currentVariant.fontWeight }}>
          Heading 4
        </h4>
        <h5 style={{ fontSize: headingSizes.h5, fontWeight: currentVariant.fontWeight }}>
          Heading 5
        </h5>
        <h6 style={{ fontSize: headingSizes.h6, fontWeight: currentVariant.fontWeight }}>
          Heading 6
        </h6>
        <p style={{ fontSize: headingSizes.body, fontWeight: currentVariant.fontWeight }}>Body</p>
        <div>
          <span style={{ fontSize: headingSizes.caption, fontWeight: currentVariant.fontWeight }}>
            Caption
          </span>
        </div>
        <div>
          <small style={{ fontSize: headingSizes.small, fontWeight: currentVariant.fontWeight }}>
            Small
          </small>
        </div>
        <div>
          <span style={{ fontSize: headingSizes.tiny, fontWeight: currentVariant.fontWeight }}>
            Tiny
          </span>
        </div>
      </div>
    </div>
  )
}
