
import "./globals.css";
import Providers from "@/components/Providers";


const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-white`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}



export default RootLayout