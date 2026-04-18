import Hero from "../components/hero";
import React from "react";
import About from "../components/about";
import Features from "../components/features";
import Footer from "../components/footer";
export default function Landing() {
  return (
    <div>
      <Hero />
      <About />
      <Features />
        <Footer />
    </div>
  );
}