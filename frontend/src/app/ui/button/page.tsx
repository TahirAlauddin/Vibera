import { CircleArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/custom/button'

// Override hover/active so the "Default" column always looks like default state
const primaryDefaultOnly = 'hover:bg-(--color-accent-primary)! active:bg-(--color-accent-primary)!'
const secondaryDefaultOnly =
  'hover:bg-(--color-accent-secondary-default)! hover:border-(--color-accent-secondary-border)! active:bg-(--color-accent-secondary-default)! active:border-(--color-accent-secondary-border)!'
const ghostDefaultOnly =
  'hover:text-(--color-accent-ghost-default)! active:text-(--color-accent-ghost-default)!'

export default function ButtonPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'white',
      }}
    >
      <title>Button page</title>
      <h1
        style={{
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: '2rem',
          fontSize: '2rem',
        }}
      >
        Button page
      </h1>

      <p className="px-16">
        <strong className="font-bold">Primary Button</strong>
      </p>
      <div className="mt-8 flex justify-center">
        <div className="grid grid-cols-4 gap-x-10 gap-y-6 items-center justify-items-start">
          <div />
          <div className="text-sm font-medium">Default</div>
          <div className="text-sm font-medium">Hover</div>
          <div className="text-sm font-medium">Active</div>

          <div className="text-sm">Small</div>
          <Button size="sm" variant="primary" className={primaryDefaultOnly}>
            <CircleArrowLeft />
            Button
          </Button>
          <Button size="sm" variant="primary" className="bg-(--color-accent-primary-hover)!">
            <CircleArrowLeft />
            Button
          </Button>
          <Button size="sm" variant="primary" className="bg-(--color-accent-primary-active)!">
            <CircleArrowLeft />
            Button
          </Button>

          <div className="text-sm">Medium</div>
          <Button size="default" variant="primary" className={primaryDefaultOnly}>
            <CircleArrowLeft />
            Button
          </Button>
          <Button size="default" variant="primary" className="bg-(--color-accent-primary-hover)!">
            <CircleArrowLeft />
            Button
          </Button>
          <Button size="default" variant="primary" className="bg-(--color-accent-primary-active)!">
            <CircleArrowLeft />
            Button
          </Button>

          <div className="text-sm">Large</div>
          <Button size="lg" variant="primary" className={primaryDefaultOnly}>
            <CircleArrowLeft />
            Button
          </Button>
          <Button size="lg" variant="primary" className="bg-(--color-accent-primary-hover)!">
            <CircleArrowLeft />
            Button
          </Button>
          <Button size="lg" variant="primary" className="bg-(--color-accent-primary-active)!">
            <CircleArrowLeft />
            Button
          </Button>
        </div>
      </div>
      <p className="px-16">
        <strong className="font-bold">Secondary Button</strong>
      </p>
      <div className="mt-8 flex justify-center">
        <div className="grid grid-cols-4 gap-x-10 gap-y-6 items-center justify-items-start">
          <div />
          <div className="text-sm font-medium">Default</div>
          <div className="text-sm font-medium">Hover</div>
          <div className="text-sm font-medium">Active</div>

          <div className="text-sm">Small</div>
          <Button size="sm" variant="secondary" className={secondaryDefaultOnly}>
            <ExternalLink />
            Button
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-(--color-accent-secondary-hover)! border-(--color-accent-secondary-hover)! text-black"
          >
            <ExternalLink />
            Button
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-(--color-accent-secondary-active)! border-(--color-accent-secondary-border)!"
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
            className="bg-(--color-accent-secondary-hover)! border-(--color-accent-secondary-hover)! text-black"
          >
            <ExternalLink />
            Button
          </Button>
          <Button
            size="default"
            variant="secondary"
            className="bg-(--color-accent-secondary-active)! border-(--color-accent-secondary-border)!"
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
            className="bg-(--color-accent-secondary-hover)! border-(--color-accent-secondary-hover)! text-black"
          >
            <ExternalLink />
            Button
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="bg-(--color-accent-secondary-active)! border-(--color-accent-secondary-border)!"
          >
            <ExternalLink />
            Button
          </Button>
        </div>
      </div>
      <p className="px-16">
        <strong className="font-bold">Ghost Button</strong>
      </p>
      <div className="mt-8 flex justify-center">
        <div className="grid grid-cols-4 gap-x-10 gap-y-6 items-center justify-items-start">
          <div />
          <div className="text-sm font-medium">Default</div>
          <div className="text-sm font-medium">Hover</div>
          <div className="text-sm font-medium">Active</div>

          <div className="text-sm">Small</div>
          <Button size="sm" variant="ghost" className={ghostDefaultOnly}>
            Button
          </Button>
          <Button size="sm" variant="ghost" className="text-(--color-accent-ghost-hover)!">
            Button
          </Button>
          <Button size="sm" variant="ghost" className="text-(--color-accent-ghost-active)!">
            Button
          </Button>

          <div className="text-sm">Medium</div>
          <Button size="default" variant="ghost" className={ghostDefaultOnly}>
            Button
          </Button>
          <Button size="default" variant="ghost" className="text-(--color-accent-ghost-hover)!">
            Button
          </Button>
          <Button size="default" variant="ghost" className="text-(--color-accent-ghost-active)!">
            Button
          </Button>

          <div className="text-sm">Large</div>
          <Button size="lg" variant="ghost" className={ghostDefaultOnly}>
            Button
          </Button>
          <Button size="lg" variant="ghost" className="text-(--color-accent-ghost-hover)!">
            Button
          </Button>
          <Button size="lg" variant="ghost" className="text-(--color-accent-ghost-active)!">
            Button
          </Button>
        </div>
      </div>
      <p className="px-16">
        <strong className="font-bold">Disabled Button</strong>
      </p>

      <div className="mt-8 flex justify-center">
        <div className="grid grid-cols-4 gap-x-10 gap-y-6 items-center justify-items-start">
          <div />
          <div className="text-sm font-medium">Default</div>
          <div className="text-sm font-medium">Hover</div>
          <div className="text-sm font-medium">Active</div>

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
        </div>
      </div>
    </div>
  )
}
