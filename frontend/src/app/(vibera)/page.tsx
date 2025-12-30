"use client";
import { useState } from "react";
import SignUpModal from "../../components/signupPage";
import LoginModal from "../../components/loginPage";
import Image from "next/image";
import Features from "../../components/features";
import Testimonials from "../../components/testimonials";

export default function Home() {
  const [modal, setModal] = useState(null); // null/ "signup" / "signin"
  const decorativeEmojis = [
    {
      emoji: "😊",
      position: "top-20 left-24",
      size: "text-2xl",
      opacity: "opacity-70",
    },
    {
      emoji: "😁",
      position: "top-40 left-1/3",
      size: "text-2xl",
      opacity: "opacity-70",
    },
    {
      emoji: "😍",
      position: "top-18 right-12",
      size: "text-3xl",
      opacity: "opacity-70",
    },
    {
      emoji: "😳",
      position: "bottom-32 right-20",
      size: "text-2xl",
      opacity: "opacity-70",
    },
    {
      emoji: "🥰",
      position: "top-130 left-1/6",
      size: "text-2xl",
      opacity: "opacity-80",
    },
    {
      emoji: "😜",
      position: "top-140 left-1/2",
      size: "text-2xl",
      opacity: "opacity-80",
    },
  ];
  return (
    <div>
      <div className="h-auto min-h-[80vh] flex flex-col  md:flex-row">
        {/* Decorative emoji elements */}
        {decorativeEmojis.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.position} ${item.size} ${item.opacity} animate-pulse`}
          >
            {item.emoji}
          </div>
        ))}
        <div className="flex flex-1 justify-center flex-col items-center">
          <h1 className="text-center p-4 font-bold text-3xl sm:text-4xl color-accent ">
            VIBERA: Track Your Mood, Share Story
          </h1>
          <p className="p-4 text-center">
            A daily mood journal for mindful reflection & community connection
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
            <button
              className=" color-primary text-white font-bold px-6 py-2 rounded-full hover:bg-primary/80 "
              onClick={() => setModal("signup")}
            >
              Get Started - its Free
            </button>
            <button className="bg-white text-accent border border-primary font-bold px-6 py-2 rounded-full hover:bg-white/80">
              Learn More
            </button>
          </div>
        </div>
        {modal === "signup" && (
          <SignUpModal
            onClose={() => setModal(null)}
            onSwitch={() => setModal("signin")}
          />
        )}
        {modal === "signin" && (
          <LoginModal
            onClose={() => setModal(null)}
            onSwitch={() => setModal("signup")}
          />
        )}
        {/* Product demo */}
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
          <Image
            src="/assets/hero.jpeg"
            alt="product demo"
            width={520}
            height={520}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
      <div>
        <Features />
      </div>
      <div>
        <Testimonials />
      </div>
    </div>
  );
}
