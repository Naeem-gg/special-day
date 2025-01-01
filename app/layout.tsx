import localFont from "next/font/local";
import "./globals.css";
import FeedbackForm from "./components/FeedbackForm";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       
        
          <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-500 to-pink-500">
      <header className="bg-white bg-opacity-10 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6 flex justify-between">
          <Link href="/" className="text-3xl font-bold text-white hover:text-pink-200 transition-colors">
            BIG DAY
          </Link>
          <FeedbackForm />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white bg-opacity-10 backdrop-blur-md text-white text-center py-4">
        <p>&copy; 2023 BIG DAY. All rights reserved.</p>
      </footer>
    </div>
      </body>
    </html>
  );
}
