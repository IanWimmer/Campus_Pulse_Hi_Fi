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

  return (
    <html lang="en">
      <body
        className={`antialiased bg-white h-[calc(var(--vh,1vh)*100)]`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}



export default RootLayout