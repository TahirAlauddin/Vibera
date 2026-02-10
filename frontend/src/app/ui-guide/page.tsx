import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { Search } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Vibera UI Component Guide',
    description: 'A comprehensive design system for the mood logging journal app',
}

export default function UIGuidePage() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F5F3ED' }}>
            <div className="max-w-7xl mx-auto py-8 px-6 md:px-12 lg:px-16">
                {/* Title Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2 text-center" style={{ color: '#2C2C2C' }}>
                        Vibera UI Component Guide
                    </h1>
                    <p className="text-lg text-center" style={{ color: '#666' }}>
                        A comprehensive design system for the mood logging journal app
                    </p>
                </div>

                {/* Color Palette Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
                        Color Palette
                    </h2>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex flex-col items-center">
                                <div
                                    className="rounded-md mb-2"
                                    style={{ backgroundColor: '#F5F3ED', width: '280px', height: '128px' }}
                                />
                                <p className="font-semibold">Cream</p>
                                <p className="text-sm text-gray-600">#F5F3ED</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div
                                    className="rounded-md mb-2"
                                    style={{ backgroundColor: '#E8E4DC', width: '280px', height: '128px' }}
                                />
                                <p className="font-semibold">Cream Dark</p>
                                <p className="text-sm text-gray-600">#E8E4DC</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div
                                    className="rounded-md mb-2"
                                    style={{ backgroundColor: '#F4C400', width: '280px', height: '128px' }}
                                />
                                <p className="font-semibold">Primary Yellow</p>
                                <p className="text-sm text-gray-600">#F4C400</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div
                                    className="rounded-md mb-2"
                                    style={{ backgroundColor: '#B8BCB0', width: '280px', height: '128px' }}
                                />
                                <p className="font-semibold">Sage</p>
                                <p className="text-sm text-gray-600">#B8BCB0</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Typography Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
                        Typography
                    </h2>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-semibold mb-2" style={{ lineHeight: '1.2' }}>
                                    Heading 1
                                </h1>
                                <p className="text-sm text-gray-600">2.5rem - 600 weight - 1.2 line height</p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-semibold mb-2" style={{ lineHeight: '1.3' }}>
                                    Heading 2
                                </h2>
                                <p className="text-sm text-gray-600">2rem - 600 weight - 1.3 line height</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-2" style={{ lineHeight: '1.4' }}>
                                    Heading 3
                                </h3>
                                <p className="text-sm text-gray-600">1.5rem - 600 weight - 1.4 line height</p>
                            </div>
                            <div>
                                <p className="text-base mb-2" style={{ lineHeight: '1.6', fontWeight: 400 }}>
                                    Body Text - This is a sample paragraph showing the default body text styling used throughout
                                    the application.
                                </p>
                                <p className="text-sm text-gray-600">1rem - 400 weight - 1.6 line height</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Buttons Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
                        Buttons
                    </h2>
                    <div className="space-y-8">
                        {/* Primary Buttons */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-semibold mb-4">Primary Buttons</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <Button variant="default" size="sm" className="bg-[#F4C400] hover:bg-[#F4C400]/90 text-black" style={{ width: '128.68px', height: '59.98px' }}>
                                    Small Button
                                </Button>
                                <Button variant="default" size="default" className="bg-[#F4C400] hover:bg-[#F4C400]/90 text-black" style={{ width: '170.35px', height: '59.98px' }}>
                                    Medium Button
                                </Button>
                                <Button variant="default" size="lg" className="bg-[#F4C400] hover:bg-[#F4C400]/90 text-black" style={{ width: '177.5px', height: '59.98px' }}>
                                    Large Button
                                </Button>
                                <Button variant="default" disabled className="bg-gray-300 text-gray-500 cursor-not-allowed">
                                    Disabled
                                </Button>
                            </div>
                        </section>

                        {/* Secondary Buttons */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-semibold mb-4">Secondary Buttons</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <Button variant="secondary" size="sm" style={{ width: '128.68px', height: '59.98px' }}>
                                    Small Button
                                </Button>
                                <Button variant="secondary" size="default" style={{ width: '170.35px', height: '59.98px' }}>
                                    Medium Button
                                </Button>
                                <Button variant="secondary" size="lg" style={{ width: '177.5px', height: '59.98px' }}>
                                    Large Button
                                </Button>
                                <Button variant="secondary" disabled>
                                    Disabled
                                </Button>
                            </div>
                        </section>

                        {/* Ghost & Outline Buttons */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-semibold mb-4">Ghost & Outline Buttons</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <Button variant="ghost" size="default">
                                    Ghost Button
                                </Button>
                                <Button variant="outline" size="default">
                                    Outline Button
                                </Button>
                                <Button variant="ghost" disabled>
                                    Ghost Disabled
                                </Button>
                                <Button variant="outline" disabled>
                                    Outline Disabled
                                </Button>
                            </div>
                        </section>

                        {/* Full Width Button */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-semibold mb-4">Full Width Button</h3>
                            <Button variant="default" className="w-full bg-[#F4C400] hover:bg-[#F4C400]/90 text-black">
                                Full Width Button
                            </Button>
                        </section>
                    </div>
                </section>

                {/* Input Fields Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
                        Input Fields
                    </h2>
                    <div className="space-y-8">
                        {/* Primary Input */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-semibold mb-4">Primary Input (Default)</h3>
                            <div className="space-y-6">
                                {/* Default State */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Label</label>
                                    <Input placeholder="Placeholder" />
                                    <p className="text-xs text-gray-500">this is information text</p>
                                </div>
                                {/* Filled State */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Label</label>
                                    <Input defaultValue="Filled value" />
                                    <p className="text-xs text-gray-500">this is information text</p>
                                </div>
                                {/* Error State */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Label</label>
                                    <Input placeholder="Placeholder" aria-invalid="true" className="border-red-500" />
                                    <p className="text-xs text-red-500">This is an error message</p>
                                </div>
                            </div>
                        </section>

                        {/* Secondary Input (Green) */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-semibold mb-4">Secondary Input (Green)</h3>
                            <div className="space-y-6">
                                {/* Default State */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Label</label>
                                    <Input
                                        placeholder="Placeholder"
                                        className="bg-green-50 border-green-200 focus:border-green-400"
                                    />
                                    <p className="text-xs text-gray-500">This is information text</p>
                                </div>
                                {/* Filled State */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Label</label>
                                    <Input
                                        defaultValue="Filled value"
                                        className="bg-green-50 border-green-200 focus:border-green-400"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Search Input */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-semibold mb-4">Search Input</h3>
                            <InputGroup className="max-w-md">
                                <InputGroupAddon>
                                    <Search className="w-4 h-4" />
                                </InputGroupAddon>
                                <InputGroupInput placeholder="Search..." />
                            </InputGroup>
                        </section>
                    </div>
                </section>

                {/* Text Areas Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
                        Text Areas
                    </h2>
                    <div className="space-y-8">
                        {/* Primary TextArea */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-semibold mb-4">Primary TextArea</h3>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Share your thoughts</label>
                                <Textarea placeholder="What's on your mind..." className="min-h-24" />
                                <p className="text-xs text-gray-500">
                                    Optional: Share more details about your mood
                                </p>
                            </div>
                        </section>

                        {/* TextArea with Error */}
                        <section className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-semibold mb-4">TextArea with Error</h3>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Enter description..."
                                    aria-invalid="true"
                                    className="min-h-24 border-red-500"
                                />
                                <p className="text-xs text-red-500">This field is required</p>
                            </div>
                        </section>
                    </div>
                </section>

                {/* Cards Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
                        Cards
                    </h2>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Default Card */}
                            <div className="border border-gray-200 bg-white rounded-lg p-4">
                                <h4 className="font-semibold mb-2">Default Card</h4>
                                <p className="text-sm text-gray-600">With border and background</p>
                            </div>
                            {/* Elevated Card */}
                            <div className="bg-white rounded-lg p-4 shadow-lg">
                                <h4 className="font-semibold mb-2">Elevated Card</h4>
                                <p className="text-sm text-gray-600">With shadow effect</p>
                            </div>
                            {/* Outlined Card */}
                            <div className="border-2 border-gray-800 bg-transparent rounded-lg p-4">
                                <h4 className="font-semibold mb-2">Outlined Card</h4>
                                <p className="text-sm text-gray-600">Transparent with border</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mood Specific Components Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
                        Mood Specific Components
                    </h2>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-xl font-semibold mb-4">Mood Emotions</h3>
                        <div className="flex flex-wrap gap-4 justify-between p-10">
                            <div className="flex flex-col items-center cursor-pointer">
                                <div className="text-4xl mb-2">😊</div>
                                <span className="text-sm">Happy</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer">
                                <div className="text-4xl mb-2">💙</div>
                                <span className="text-sm">Calm</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer">
                                <div className="text-4xl mb-2">😐</div>
                                <span className="text-sm">Neutral</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer">
                                <div className="text-4xl mb-2">😰</div>
                                <span className="text-sm">Anxious</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer">
                                <div className="text-4xl mb-2">😢</div>
                                <span className="text-sm">Sad</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer">
                                <div className="text-4xl mb-2">🔥</div>
                                <span className="text-sm">Angry</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Spacing System Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
                        Spacing System
                    </h2>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-[#F4C400]" style={{ width: '0.5rem', height: '0.5rem' }} />
                                <span className="text-sm">XS: 0.5rem (8px)</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-[#F4C400]" style={{ width: '0.5rem', height: '1rem' }} />
                                <span className="text-sm">SM: 1rem (16px)</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-[#F4C400]" style={{ width: '0.5rem', height: '1.5rem' }} />
                                <span className="text-sm">MD: 1.5rem (24px)</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-[#F4C400]" style={{ width: '0.5rem', height: '2rem' }} />
                                <span className="text-sm">LG: 2rem (32px)</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-[#F4C400]" style={{ width: '0.5rem', height: '3rem' }} />
                                <span className="text-sm">XL: 3rem (48px)</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Border Radius Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-6" style={{ color: '#2C2C2C' }}>
                        Border Radius
                    </h2>
                    <div className="bg-white rounded-lg shadow-sm p-6 ">
                        <div className="flex flex-wrap gap-8 items-end">
                            <div className="flex flex-col items-center">
                                <div
                                    className="bg-[#F4C400] w-24 h-12 mb-2"
                                    style={{ borderRadius: '0.5rem' }}
                                />
                                <span className="text-sm">SM: 0.5rem</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div
                                    className="bg-[#F4C400] w-24 h-12 mb-2"
                                    style={{ borderRadius: '0.75rem' }}
                                />
                                <span className="text-sm">MD: 0.75rem</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div
                                    className="bg-[#F4C400] w-24 h-12 mb-2"
                                    style={{ borderRadius: '1rem' }}
                                />
                                <span className="text-sm">LG: 1rem</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-[#F4C400] w-24 h-24 mb-2 rounded-full" />
                                <span className="text-sm">Full</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
