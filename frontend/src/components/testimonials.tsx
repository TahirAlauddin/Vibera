"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const testimonials = [
    {
      name: "TravelBug",
      text: "Vibera has completely transformed the way I reflect on my travels. Tracking my moods alongside my journeys helps me capture the emotions behind each adventure, not just the places I visit.",
      rating: 5,
    },
    {
      name: "MindfulSoul",
      text: "I love how Vibera connects me with a supportive community. Sharing my daily reflections and reading others’ stories makes me feel understood and inspired every day.",
      rating: 5,
    },
    {
      name: "GrowthSeeker",
      text: "The personalized insights are amazing! Vibera highlights patterns in my moods and helps me understand myself better. It feels like having a guide for my personal growth.",
      rating: 5,
    },
  ];

  return (
    <div>
      {/* Testimonials Carousel */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <Button
          onClick={prevTestimonial}
          className="shrink-0 p-2 hover:bg-white/20 rounded-full transition-colors bg-transparent"
        >
          <ChevronLeft size={24} className="text-white" />
        </Button>

        <div className="flex gap-4 justify-center flex-wrap">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-300 ${
                index === currentTestimonial
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-50 hidden md:block"
              }`}
            >
              <div className="bg-white rounded-xl p-6 max-w-sm shadow-lg">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-linear-to-br from-[#7dd3c0] to-[#6cc4b8] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {testimonial.name[0]}
                  </div>
                  <span className="font-semibold text-sm text-foreground">
                    @{testimonial.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={nextTestimonial}
          className="shrink-0 p-2 hover:bg-white/20 rounded-full transition-colors bg-transparent"
        >
          <ChevronRight size={24} className="text-white" />
        </Button>
      </div>
    </div>
  );
}
