'use client'

type ProfileContactInfoProps = {
  fullName: string
  email: string
  phone: string
  onFullNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
}

const inputClass =
  'w-full rounded-xl border border-[#E0E6D9] bg-[#FAF7E6] px-4 py-2.5 text-sm text-[#1F2E13] outline-none transition focus:border-[#F6C531] focus:ring-2 focus:ring-[#F6C531]/30'

export function ProfileContactInfo({
  fullName,
  email,
  phone,
  onFullNameChange,
  onEmailChange,
  onPhoneChange,
}: ProfileContactInfoProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-[#1F2E13]">Contact Information</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-[#4B5A41]">Full Name</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#4B5A41]">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#4B5A41]">Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className={inputClass}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-[#4B5A41]">Password</span>
          <input type="password" value="••••••••••" disabled className={`${inputClass} opacity-60`} />
          <p className="mt-1 text-xs text-[#7A6B3F]">Use Security settings to change your password.</p>
        </label>
      </div>
    </section>
  )
}
