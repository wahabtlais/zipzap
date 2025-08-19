import Header from "@/shared/widgets/header";
import "./global.css";

export const metadata = {
  title: "ZipZap",
  description: "Your one-stop solution for all your needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
