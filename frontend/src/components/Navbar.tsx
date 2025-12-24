"use client";

import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="flex w-full h-16">
      {/* Left Green Section */}
      <div className="flex shrink-0 justify-between items-center bg-green-500 shadow-md px-4 py-2 rounded-r-[2.5rem] flex-3 min-w-0">
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className=" font-bold text-xl text-white">Vibera</span>
        </div>

        {/* Logo Image */}
        <Image
          src="/assets/Logo.png"
          alt="User"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>

      {/* Right White Section */}
      <div className="flex items-center gap-3 bg-white px-4 py-2 justify-end flex-2 shrink-0">
        <div className="relative hidden sm:flex items-center">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-full px-10 py-1 text-sm "
          />
          <button type="submit" className="cursor-pointer">
            <Image
              src="/assets/search.png"
              alt="search"
              width={22}
              height={22}
              className="rounded-full absolute left-3 top-1/2 -translate-y-1/2 "
            />
          </button>
        </div>
        <div className="sm:hidden">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden cursor-pointer"
          >
            <Image
              src="/assets/search.png"
              alt="search"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className=" p-2 focus:outline-none cursor-pointer "
        >
          <div className="w-6 h-0.5 bg-black mb-1 rounded-full"></div>
          <div className="w-6 h-0.5 bg-black mb-1 rounded-full"></div>
          <div className="w-6 h-0.5 bg-black rounded-full"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white p-4 flex flex-col gap-2  rounded-md shadow-md">
          <a href="#">Settings</a>
          <a href="#">Profile</a>
          <a href="#">Following</a>
          <a href="#">Followers</a>
        </div>
      )}
    </nav>
  );
}
