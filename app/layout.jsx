import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Sync Board | Copy and Paste Across Multiple Devices",
  description: "Share your Copy and Paste with your team or anyone.",
};

const poppins = Poppins({
  display: "swap",
  weight: "500",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Navbar />
        <main className="p-2">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
