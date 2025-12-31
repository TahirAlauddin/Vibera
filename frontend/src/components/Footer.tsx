import { Button } from "./ui/button";

export default function Footer() {
  const footerLinks = ["Home", "About Us", "Contacts", "Privacy"];
  const socialButtons = ["☀️", "𝕏", "⋯"];

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div
          className="
            flex flex-col gap-6
            sm:items-center
            md:flex-row md:items-center md:justify-between
          "
        >
          {/* Left */}
          <p className="text-sm text-gray-600 text-center md:text-left">
            © 2025 Vibera. All rights reserved.
          </p>

          {/* Center */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-gray-600 hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div className="flex justify-center md:justify-end gap-4">
            {socialButtons.map((icon) => (
              <Button
                variant="ghost"
                key={icon}
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
              >
                {icon}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
