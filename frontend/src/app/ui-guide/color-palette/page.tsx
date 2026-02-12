// -----------------------------
// THEME DATA
// -----------------------------

const LIGHT_THEME = {
  leftSections: [
    {
      title: 'Base',
      labels: ['base-Dark:', 'border:', 'sections:'],
      colors: ['#FAF7E6', '#E0E6D9', '#F4F6F1'],
    },
    {
      title: 'Accent',
      labels: ['primary accent:', 'secondary accent:', 'disabled accent:'],
      colors: ['#F6C531', '#D7E9B6', '#91B6A2'],
    },
    {
      title: 'Text',
      labels: ['primary text:', 'secondary text:', 'body text:'],
      colors: ['#1F2E13', '#7A6B3F', '#4B5A41'],
    },
    {
      title: 'Neutrals',
      labels: ['001:', '002:', '003:'],
      colors: ['#FAF7E6', '#F1DC9A', '#F6C531'],
    },
  ],
  rightSections: [
    {
      title: 'Neutrals',
      items: [
        {
          color: '#FAF7E6',
          name: '001',
          hex: '#FAF7E6',
          rgb: 'rgb(250, 247, 230)',
          hsl: 'hsl(51, 67, 94)',
        },
        {
          color: '#F1DC9A',
          name: '002',
          hex: '#F1DC9A',
          rgb: 'rgb(241, 220, 154)',
          hsl: 'hsl(46, 76, 77)',
        },
        {
          color: '#F6C531',
          name: '003',
          hex: '#F6C531',
          rgb: 'rgb(246, 197, 49)',
          hsl: 'hsl(45, 92, 58)',
        },
      ],
    },
    {
      title: 'Base',
      items: [
        {
          color: '#E0E6D9',
          name: 'Light/border',
          hex: '#E0E6D9',
          rgb: 'rgb(224, 230, 217)',
          hsl: 'hsl(88, 21, 88)',
        },
        {
          color: '#FAF7E6',
          name: 'Light/base',
          hex: '#FAF7E6',
          rgb: 'rgb(250, 247, 230)',
          hsl: 'hsl(51, 67, 94)',
        },
        {
          color: '#F4F6F1',
          name: 'Light/section',
          hex: '#F4F6F1',
          rgb: 'rgb(244, 246, 241)',
          hsl: 'hsl(84, 22, 95)',
        },
      ],
    },
    {
      title: 'Accent',
      items: [
        {
          color: '#F6C531',
          name: 'Light/primary',
          hex: '#F6C531',
          rgb: 'rgb(246, 197, 47)',
          hsl: 'hsl(45, 92, 58)',
        },
        {
          color: '#D7E9B6',
          name: 'Light/secondary',
          hex: '#D7E9B6',
          rgb: 'rgb(215, 233, 182)',
          hsl: 'hsl(81, 54, 81)',
        },
        {
          color: '#91B6A2',
          name: 'Light/disabled',
          hex: '#91B6A2',
          rgb: 'rgb(145, 182, 162)',
          hsl: 'hsl(148, 20, 64)',
        },
      ],
    },
    {
      title: 'Text',
      items: [
        {
          color: '#1F2E13',
          name: 'Light/primary',
          hex: '#1F2E13',
          rgb: 'rgb(31, 46, 19)',
          hsl: 'hsl(93, 42, 13)',
        },
        {
          color: '#7A6B3F',
          name: 'Light/secondary',
          hex: '#7A6B3F',
          rgb: 'rgb(122, 107, 63)',
          hsl: 'hsl(45, 32, 36)',
        },
        {
          color: '#4B5A41',
          name: 'Light/body',
          hex: '#4B5A41',
          rgb: 'rgb(75, 90, 65)',
          hsl: 'hsl(96, 16, 30)',
        },
      ],
    },
  ],
}

// Dark theme data
const DARK_THEME = {
  leftSections: [
    {
      title: 'Base',
      labels: ['base-Dark:', 'border:', 'sections:'],
      colors: ['#12121A', '#2D2D44', '#1E1E2E'],
    },
    {
      title: 'Accent',
      labels: ['primary accent:', 'secondary accent:', 'disabled accent:'],
      colors: ['#06B6D4', '#F472B6', '#4B5563'],
    },
    {
      title: 'Text',
      labels: ['primary text:', 'secondary text:', 'body text:'],
      colors: ['#F8FAFC', '#94A3B8', '#CBD5E1'],
    },
    {
      title: 'Neutrals',
      labels: ['001:', '002:', '003:'],
      colors: ['#FAF7E6', '#F1DC9A', '#F6C531'],
    },
  ],
  rightSections: [
    {
      title: 'Base',
      items: [
        {
          color: '#2D2D44',
          name: 'Dark/border',
          hex: '#2D2D44',
          rgb: 'rgb(45, 45, 68)',
          hsl: 'hsl(240, 20, 22)',
        },
        {
          color: '#1E1E2E',
          name: 'Dark/section',
          hex: '#1E1E2E',
          rgb: 'rgb(30, 30, 46)',
          hsl: 'hsl(240, 21, 15)',
        },
        {
          color: '#12121A',
          name: 'Dark/base',
          hex: '#12121A',
          rgb: 'rgb(18, 18, 26)',
          hsl: 'hsl(240, 18, 9)',
        },
      ],
    },
    {
      title: 'Accent',
      items: [
        {
          color: '#06B6D4',
          name: 'Dark/primary',
          hex: '#06B6D4',
          rgb: 'rgb(6, 182, 212)',
          hsl: 'hsl(189, 94, 43)',
        },
        {
          color: '#F472B6',
          name: 'Dark/secondary',
          hex: '#F472B6',
          rgb: 'rgb(244, 114, 182)',
          hsl: 'hsl(329, 86, 70)',
        },
        {
          color: '#4B5563',
          name: 'Dark/disabled',
          hex: '#4B5563',
          rgb: 'rgb(75, 85, 99)',
          hsl: 'hsl(215, 14, 34)',
        },
      ],
    },
    {
      title: 'Text',
      items: [
        {
          color: '#F8FAFC',
          name: 'Dark/primary',
          hex: '#F8FAFC',
          rgb: 'rgb(248, 250, 252)',
          hsl: 'hsl(210, 40, 9)',
        },
        {
          color: '#94A3B8',
          name: 'Dark/secondary',
          hex: '#94A3B8',
          rgb: 'rgb(148, 163, 184)',
          hsl: 'hsl(215, 20,65)',
        },
        {
          color: '#CBD5E1',
          name: 'Dark/body',
          hex: '#CBD5E1',
          rgb: 'rgb(203, 213, 225)',
          hsl: 'hsl(213, 27, 84)',
        },
      ],
    },
    {
      title: 'Neutrals',
      items: [
        {
          color: '#FAF7E6',
          name: '001',
          hex: '#FAF7E6',
          rgb: 'rgb(250, 247, 230)',
          hsl: 'hsl(51, 67, 94)',
        },
        {
          color: '#F1DC9A',
          name: '002',
          hex: '#F1DC9A',
          rgb: 'rgb(241, 220, 154)',
          hsl: 'hsl(46, 76, 77)',
        },
        {
          color: '#F6C531',
          name: '003',
          hex: '#F6C531',
          rgb: 'rgb(246, 197, 49)',
          hsl: 'hsl(45, 92, 58)',
        },
      ],
    },
  ],
}

// -----------------------------
// REUSABLE COMPONENTS
// -----------------------------

function LeftSection({ title, labels, colors }) {
  return (
    <section>
      <h3 className="text-center p-4 text-2xl">{title}</h3>
      <div className="flex flex-row p-4 justify-center">
        <div className="flex flex-col gap-11 pr-6">
          {labels.map((label, i) => (
            <p key={i}>{label}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {colors.map((color, i) => (
            <div
              key={i}
              className="w-[147px] h-[52px] border border-black"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function RightSection({ title, items }) {
  return (
    <section>
      <h2 className="text-3xl">{title}</h2>
      <div className="flex flex-row p-4">
        {items.map((item, i) => (
          <div key={i} className="p-2">
            <div className="w-[180px] h-[90px]" style={{ backgroundColor: item.color }} />
            <p>{item.name}</p>
            <p>{item.hex}</p>
            <p>{item.rgb}</p>
            <p>{item.hsl}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ThemePalette({ title, theme }) {
  return (
    <div>
      <h2 className="text-5xl font-bold">{title}</h2>

      <div className="flex flex-row p-6">
        <div className="flex flex-1 flex-col p-4">
          {theme.leftSections.map((section, i) => (
            <LeftSection key={i} {...section} />
          ))}
        </div>

        <div className="flex flex-1 p-4">
          <section>
            <div>
              {theme.rightSections.map((section, i) => (
                <RightSection key={i} {...section} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// -----------------------------
// PAGE
// -----------------------------

export default function ColorPalettePage() {
  return (
    <div className="p-5">
      <ThemePalette title="Light theme" theme={LIGHT_THEME} />
      <ThemePalette title="Dark theme" theme={DARK_THEME} />
    </div>
  )
}
