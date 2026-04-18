import Hero from "../components/hero";
import React from "react";
import About from "../components/about";
import Features from "../components/features";
import Footer from "../components/footer";
import CTA from "../components/CTA";
import HowItWorksFlow from "../components/HowItWorks";
export default function Landing() {
  return (
    <div>
      <Hero />
      <About />
      <Features />
      <HowItWorksFlow/>
      <CTA />
        <Footer />
    </div>
  );
}