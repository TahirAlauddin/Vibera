import { Typography } from '@/components/custom/typography'

const cardClassName =
  'relative w-105 px-2 mb-8 min-h-[500px] border rounded-lg bg-white overflow-hidden transition-all duration-200 hover:border-blue-400 cursor-pointer'

const variants = ['heavy', 'bold', 'medium', 'regular', 'thin'] as const
const sizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'caption', 'small', 'tiny'] as const

const sizeLabel = (size: (typeof sizes)[number]) =>
  size.startsWith('h') ? `Heading ${size[1]}` : size.charAt(0).toUpperCase() + size.slice(1)

const variantRows: (typeof variants)[number][][] = [
  ['heavy', 'bold', 'medium'],
  ['regular', 'thin'],
]

export default function TypographyPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-6xl font-bold mb-10 text-center">Typography</h1>
      <table className="w-full table-fixed border-separate border-spacing">
        <tbody>
          {variantRows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((variant) => (
                <td key={variant}>
                  <div className={cardClassName}>
                    <div className="text-2xl text-gray-500 px-4 mt-4 mb-3 capitalize">
                      {variant}
                    </div>
                    {sizes.map((size) => (
                      <Typography key={size} variant={variant} size={size}>
                        {sizeLabel(size)}
                      </Typography>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
