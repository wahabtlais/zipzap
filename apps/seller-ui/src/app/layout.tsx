import "./global.css";
import Providers from "./Provider";
import { Poppins, Roboto } from "next/font/google";

export const metadata = {
  title: "ZipZap - Seller",
  description: "Your one-stop solution for all your needs",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-slate-950 antialiased ${poppins.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
