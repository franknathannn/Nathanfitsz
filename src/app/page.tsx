// src/app/page.tsx
import Hero from "../components/organisms/Hero";
import ProductShowcase from "../components/organisms/ProductShowcase";
import About from "../components/organisms/About";
import Footer from "../components/organisms/Footer";

// A subtle divider to maintain visual flow between major sections
// This helps pace the scroll on mobile so it doesn't feel like endless content.
const SectionDivider = () => (
  <div 
    className="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-70 my-4" 
    aria-hidden="true"
  />
);

export default function Home() {
  return (
    // Using gap-y ensures consistent vertical rhythm between sections on all devices.
    // Added extra padding at bottom so content doesn't hit the very edge before the footer.
    <div className="flex flex-col w-full min-h-screen gap-y-16 md:gap-y-32 relative z-10">
      
      {/* The Hook */}
      <Hero />
      
      <SectionDivider />
      
      {/* The Value (Main Conversion Point) */}
      <ProductShowcase />
      
      <SectionDivider />
      
      {/* The Trust */}
      <About />
      
      {/* Footer handles its own top spacing */}
      <Footer />
    </div>
  );
}