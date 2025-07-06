import { AuthProvider } from "@/contexts/UserContext";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Josh - Personal Finance Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-background text-text antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-center" />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
