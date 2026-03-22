import "../globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton"; // We will create this
import AdminAuthCheck from "@/components/admin/AdminAuthCheck"; // Auth Guard
import KillSwitch from "@/components/layout/KillSwitch";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Dashboard - HMI Cabang Garut",
  description: "Halaman Admin HMI Cabang Garut",
};

export default function AdminRootLayout({ children }) {
  // Kill Switch: Untuk perlindungan jika belum lunas
  const isLocked = process.env.NEXT_PUBLIC_SITE_LOCKED === 'true';

  if (isLocked) {
    return <KillSwitch />;
  }

  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <AdminAuthCheck>
          <div className="min-h-screen flex">
            {/* Sidebar (Fixed) */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0 z-50">
              {/* Logo Area */}
              <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <span className="text-xl font-black text-[#004e26] tracking-tight">HMI MANAGER</span>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Konten Website</p>

                <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-600 font-medium hover:text-green-700 transition group">
                  <span className="group-hover:translate-x-1 transition-transform">📊</span> Dashboard
                </Link>
                <Link href="/admin/news" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-600 font-medium hover:text-green-700 transition group">
                  <span className="group-hover:translate-x-1 transition-transform">📰</span> Berita
                </Link>
                <Link href="/admin/events" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-600 font-medium hover:text-green-700 transition group">
                  <span className="group-hover:translate-x-1 transition-transform">🗓️</span> Kegiatan
                </Link>
                <Link href="/admin/trainings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-600 font-medium hover:text-green-700 transition group">
                  <span className="group-hover:translate-x-1 transition-transform">🎓</span> Training
                </Link>
                <Link href="/admin/gallery" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-600 font-medium hover:text-green-700 transition group">
                  <span className="group-hover:translate-x-1 transition-transform">🖼️</span> Galeri
                </Link>

                <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Internal</p>
                <Link href="/admin/members" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-600 font-medium hover:text-green-700 transition group">
                  <span className="group-hover:translate-x-1 transition-transform">👥</span> Pengurus
                </Link>
                <Link href="/admin/departments" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-600 font-medium hover:text-green-700 transition group">
                  <span className="group-hover:translate-x-1 transition-transform">📂</span> Bidang
                </Link>
                <Link href="/admin/lpp" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-600 font-medium hover:text-green-700 transition group">
                  <span className="group-hover:translate-x-1 transition-transform">🏢</span> LPP
                </Link>
                <Link href="/admin/chairmen" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-gray-600 font-medium hover:text-green-700 transition group">
                  <span className="group-hover:translate-x-1 transition-transform">👑</span> Ketua Umum
                </Link>
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <Link href="/" className="flex items-center gap-2 justify-center w-full px-4 py-2 text-sm text-gray-500 hover:text-green-600 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition">
                  ← Lihat Website
                </Link>
              </div>
            </aside>

            {/* Main Content (Offset for Sidebar) */}
            <div className="flex-1 flex flex-col md:ml-64 min-h-screen transition-all duration-300">
              {/* Header */}
              <header className="bg-white border-b border-gray-200 h-16 px-6 flex justify-between items-center sticky top-0 z-40 shadow-sm">
                <h2 className="font-semibold text-gray-700">Admin Area</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 hidden sm:inline">Hi, Admin</span>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">A</div>
                  <LogoutButton />
                </div>
              </header>

              {/* Content */}
              <main className="flex-1 p-6 md:p-8 bg-gray-50">
                {children}
              </main>
            </div>
          </div>
        </AdminAuthCheck>
      </body>
    </html>
  );
}
