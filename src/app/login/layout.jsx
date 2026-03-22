import "../globals.css";
import { Inter } from "next/font/google";
import KillSwitch from "@/components/layout/KillSwitch";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Login - Admin HMI",
  description: "Login untuk masuk ke dashboard admin",
};

export default function LoginLayout({ children }) {
  // Kill Switch: Untuk perlindungan jika belum lunas
  const isLocked = process.env.NEXT_PUBLIC_SITE_LOCKED === 'true';

  if (isLocked) {
    return <KillSwitch />;
  }

  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-100`}>
        {children}
      </body>
    </html>
  );
}

