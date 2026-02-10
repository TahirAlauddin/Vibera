export function Typography({
  variant = 'regular',
  size = 'h3',
  children,
}: {
  variant?: 'heavy' | 'bold' | 'medium' | 'regular' | 'thin'
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'small' | 'tiny'
  children: React.ReactNode
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
    <div style={{ fontSize: headingSizes[size], fontWeight: currentVariant.fontWeight }}>
      {children}
    </div>
  )
}
