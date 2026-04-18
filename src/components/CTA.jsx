import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CTA() {
  const containerRef = useRef(null);
  const buttonsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(
      buttonsRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.2,
        delay: 0.4,
      }
    );
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-6 py-16">

      <div
        ref={containerRef}
        className="text-center max-w-3xl mx-auto"
      >

        {/* HEADING */}
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
          Ready to Experience <br />
          <span className="text-yellow-500">
            Seamless Service Booking?
          </span>
        </h1>

        {/* SUBTEXT */}
        <p className="text-gray-500 mt-5 text-base md:text-lg px-2">
          Book trusted professionals instantly or grow your business by joining our platform.
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

          {/* PRIMARY BUTTON */}
          <button
            ref={(el) => (buttonsRef.current[0] = el)}
            onClick={() => alert("Go to Services")}
            className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg 
            hover:bg-yellow-500 hover:scale-105 transition shadow-md"
          >
            Start Booking
          </button>

          {/* SECONDARY BUTTON */}
          <button
            ref={(el) => (buttonsRef.current[1] = el)}
            onClick={() => alert("Go to Provider Login")}
            className="px-8 py-3 border-2 border-yellow-400 text-yellow-500 font-semibold rounded-lg 
            hover:bg-yellow-400 hover:text-black hover:scale-105 transition"
          >
            Become a Provider
          </button>

        </div>

      </div>

    </div>
  );
}