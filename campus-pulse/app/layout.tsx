"use client"


import { useEffect } from "react";
import "./globals.css";
import Providers from "@/contexts/Providers";


const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  useEffect(() => {
    // used to make sure that the full screen height is actually 
    // the full screen height on mobile (mobile browser sometimes 
    // mess up the layout/height property)
    const setVhProperty = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVhProperty();
    window.addEventListener("resize", setVhProperty);

    return () => window.removeEventListener("resize", setVhProperty);
  }, []);

  useEffect(() => {
    const setVwProperty = () => {
      // FIX: Use visualViewport.width if available.
      // This solves the issue where missing meta tags cause innerWidth to return
      // a massive desktop width (e.g. 1629px) instead of the emulated mobile width (e.g. 407px).
      const width = window.visualViewport?.width || window.innerWidth;
      const vw = width * 0.01;
      document.documentElement.style.setProperty("--vw", `${vw}px`);
    };

    setVwProperty();
    window.addEventListener("resize", setVwProperty);
    
    // Also listen to visualViewport resize events (crucial for mobile keyboards/pinch-zoom)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", setVwProperty);
    }

    return () => {
      window.removeEventListener("resize", setVwProperty);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", setVwProperty);
      }
    };
  }, []);

  return (
    <html lang="en">
      <body className={`antialiased bg-white h-[calc(var(--vh,1vh)*100)]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}



export default RootLayout