import { Typography } from '@/components/custom/typography'
export default function TypographyPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-6xl font-bold mb-10 text-center">Typography</h1>
      <table className="w-full table-fixed border-separate border-spacing-4">
        <tbody>
          <tr>
            <td>
              <Typography variant="heavy" />
            </td>
            <td>
              <Typography variant="bold" />
            </td>
            <td>
              <Typography variant="medium" />
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="regular" />
            </td>
            <td>
              <Typography variant="thin" />
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
