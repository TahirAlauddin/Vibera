"use client";

import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="relative flex w-full h-16 items-center">
      {/* LEFT GREEN SECTION – 60% */}
      <div className="flex items-center justify-between color-primary shadow-md px-4 rounded-r-[2.5rem] w-[60%] min-w-0 h-full">
        {/* Brand */}
        <h1 className="font-bold text-2xl sm:text-3xl text-white truncate">
          VIBERA
        </h1>

        {/* Logo at rounded edge */}
        <Image
          src="/assets/Logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full shrink-0"
        />
      </div>

      {/* RIGHT WHITE SECTION – 40% */}
      <div className="flex items-center gap-3 bg-white px-4 justify-end w-[40%] h-full">
        {/* Desktop Search – hide earlier to prevent overlap */}
        <form className="relative hidden md:flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-full pl-4 pr-10 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Image
              src="/assets/search.png"
              alt="search"
              width={18}
              height={18}
            />
          </button>
        </form>

        {/* Mobile / Tablet Search Icon */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden p-2"
        >
          <Image src="/assets/search.png" alt="search" width={22} height={22} />
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 focus:outline-none cursor-pointer"
        >
          <div className="w-6 h-0.5 bg-black mb-1 rounded-full"></div>
          <div className="w-6 h-0.5 bg-black mb-1 rounded-full"></div>
          <div className="w-6 h-0.5 bg-black rounded-full"></div>
        </button>
      </div>

      {/* MOBILE / TABLET SEARCH BAR */}
      {searchOpen && (
        <form className="absolute top-16 left-0 w-full bg-white px-4 py-3 shadow-md md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Image
                src="/assets/search.png"
                alt="search"
                width={18}
                height={18}
              />
            </button>
          </div>
        </form>
      )}

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white p-4 flex flex-col gap-2 rounded-md shadow-md">
          <a href="#">Settings</a>
          <a href="#">Profile</a>
          <a href="#">Following</a>
          <a href="#">Followers</a>
        </div>
      )}
    </nav>
  );
}
