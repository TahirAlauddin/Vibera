import type { Metadata } from 'next'
import { CircleArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { UIGuideShell, GuideSection } from '../_components/ui-guide-shell'

export const metadata: Metadata = {
  title: 'Buttons | Vibera UI Guide',
  description: 'Button component variants and states',
}

const primaryDefaultOnly = 'hover:bg-accent-primary! active:bg-accent-primary!'
const secondaryDefaultOnly =
  'hover:bg-accent-secondary-default! hover:border-accent-secondary-border! ' +
  'active:bg-accent-secondary-default! active:border-accent-secondary-border!'
const ghostDefaultOnly = 'hover:text-accent-ghost-default! active:text-accent-ghost-default!'

function StateGrid({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <GuideSection title={title}>
      <div className="overflow-x-auto">
        <div className="grid min-w-[600px] grid-cols-4 gap-x-10 gap-y-6 items-center justify-items-start">
          <div />
          <div className="text-sm font-medium text-[#4B5A41]">Default</div>
          <div className="text-sm font-medium text-[#4B5A41]">Hover</div>
          <div className="text-sm font-medium text-[#4B5A41]">Active</div>
          {children}
        </div>
      </div>
    </GuideSection>
  )
}

export default function ButtonsPage() {
  return (
    <UIGuideShell
      showBack
      title="Buttons"
      description="Primary, secondary, ghost, and disabled button variants across sizes"
    >
      <StateGrid title="Primary Button">
        <div className="text-sm">Small</div>
        <Button size="sm" variant="primary" className={primaryDefaultOnly}>
          <CircleArrowLeft />
          Button
        </Button>
        <Button size="sm" variant="primary" className="bg-accent-primary-hover!">
          <CircleArrowLeft />
          Button
        </Button>
        <Button size="sm" variant="primary" className="bg-accent-primary-active!">
          <CircleArrowLeft />
          Button
        </Button>

        <div className="text-sm">Medium</div>
        <Button size="default" variant="primary" className={primaryDefaultOnly}>
          <CircleArrowLeft />
          Button
        </Button>
        <Button size="default" variant="primary" className="bg-accent-primary-hover!">
          <CircleArrowLeft />
          Button
        </Button>
        <Button size="default" variant="primary" className="bg-accent-primary-active!">
          <CircleArrowLeft />
          Button
        </Button>

        <div className="text-sm">Large</div>
        <Button size="lg" variant="primary" className={primaryDefaultOnly}>
          <CircleArrowLeft />
          Button
        </Button>
        <Button size="lg" variant="primary" className="bg-accent-primary-hover!">
          <CircleArrowLeft />
          Button
        </Button>
        <Button size="lg" variant="primary" className="bg-accent-primary-active!">
          <CircleArrowLeft />
          Button
        </Button>
      </StateGrid>

      <StateGrid title="Secondary Button">
        <div className="text-sm">Small</div>
        <Button size="sm" variant="secondary" className={secondaryDefaultOnly}>
          <ExternalLink />
          Button
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-accent-secondary-hover! border-accent-secondary-hover! text-black"
        >
          <ExternalLink />
          Button
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="bg-accent-secondary-active! border-accent-secondary-border!"
        >
          <ExternalLink />
          Button
        </Button>

        <div className="text-sm">Medium</div>
        <Button size="default" variant="secondary" className={secondaryDefaultOnly}>
          <ExternalLink />
          Button
        </Button>
        <Button
          size="default"
          variant="secondary"
          className="bg-accent-secondary-hover! border-accent-secondary-hover! text-black"
        >
          <ExternalLink />
          Button
        </Button>
        <Button
          size="default"
          variant="secondary"
          className="bg-accent-secondary-active! border-accent-secondary-border!"
        >
          <ExternalLink />
          Button
        </Button>

        <div className="text-sm">Large</div>
        <Button size="lg" variant="secondary" className={secondaryDefaultOnly}>
          <ExternalLink />
          Button
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="bg-accent-secondary-hover! border-accent-secondary-hover! text-black"
        >
          <ExternalLink />
          Button
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="bg-accent-secondary-active! border-accent-secondary-border!"
        >
          <ExternalLink />
          Button
        </Button>
      </StateGrid>

      <StateGrid title="Ghost Button">
        <div className="text-sm">Small</div>
        <Button size="sm" variant="ghost" className={ghostDefaultOnly}>
          Button
        </Button>
        <Button size="sm" variant="ghost" className="text-accent-ghost-hover!">
          Button
        </Button>
        <Button size="sm" variant="ghost" className="text-accent-ghost-active!">
          Button
        </Button>

        <div className="text-sm">Medium</div>
        <Button size="default" variant="ghost" className={ghostDefaultOnly}>
          Button
        </Button>
        <Button size="default" variant="ghost" className="text-accent-ghost-hover!">
          Button
        </Button>
        <Button size="default" variant="ghost" className="text-accent-ghost-active!">
          Button
        </Button>

        <div className="text-sm">Large</div>
        <Button size="lg" variant="ghost" className={ghostDefaultOnly}>
          Button
        </Button>
        <Button size="lg" variant="ghost" className="text-accent-ghost-hover!">
          Button
        </Button>
        <Button size="lg" variant="ghost" className="text-accent-ghost-active!">
          Button
        </Button>
      </StateGrid>

      <StateGrid title="Disabled Button">
        <div className="text-sm">Small</div>
        <Button size="sm" variant="disabled" disabled>
          Button
        </Button>
        <Button size="sm" variant="disabled" disabled>
          Button
        </Button>
        <Button size="sm" variant="disabled" disabled>
          Button
        </Button>

        <div className="text-sm">Medium</div>
        <Button size="default" variant="disabled" disabled>
          Button
        </Button>
        <Button size="default" variant="disabled" disabled>
          Button
        </Button>
        <Button size="default" variant="disabled" disabled>
          Button
        </Button>

        <div className="text-sm">Large</div>
        <Button size="lg" variant="disabled" disabled>
          Button
        </Button>
        <Button size="lg" variant="disabled" disabled>
          Button
        </Button>
        <Button size="lg" variant="disabled" disabled>
          Button
        </Button>
      </StateGrid>

      <GuideSection title="Full Width Button">
        <Button variant="primary" className="w-full max-w-md">
          Full Width Button
        </Button>
      </GuideSection>
    </UIGuideShell>
  )
}
