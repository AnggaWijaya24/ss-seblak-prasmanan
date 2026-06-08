import { ShoppingCart, BookOpen } from "lucide-react";

export default function Navbar({ view, setView, user, totalItemsInCart, setIsCartOpen }) {
  return (
    <header className="bg-red-600 text-white shadow-md sticky top-0 z-40">
      {/* Container utama menggunakan padding responsif dan flex-col saat mobile */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-2.5 md:gap-3">
        {/* LOGO TEXT - Dibuat sedikit lebih besar dan pas di tengah saat mobile */}
        <h1 onClick={() => setView("user")} className="font-black text-lg sm:text-xl tracking-wider cursor-pointer uppercase select-none hover:text-amber-200 transition-colors text-center md:text-left">
          🍲 SS SEBLAK PRASMANAN
        </h1>

        {/* GRUP BUTTON NAVIGASI - Otomatis melebar penuh (w-full) di HP agar tombolnya seimbang */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
          {/* TOMBOL MENU PROMOSI / TENTANG KEDAI */}
          <button
            type="button"
            onClick={() => setView(view === "about" ? "user" : "about")}
            className={`font-black text-[11px] sm:text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all border flex-1 md:flex-none shadow-sm ${
              view === "about" ? "bg-amber-400 text-red-950 border-amber-400 font-extrabold scale-102" : "bg-white/10 text-white border-white/10 hover:bg-white/20 active:scale-95"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{view === "about" ? "🛒 Lihat Menu" : "📖 Tentang Kedai"}</span>
          </button>

          {/* TOMBOL KERANJANG - Hanya muncul jika berada di halaman user */}
          {view === "user" && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="bg-red-700/60 hover:bg-red-700 text-white font-black text-[11px] sm:text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-white/10 flex-1 md:flex-none active:scale-95 shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Keranjang</span>
              {totalItemsInCart > 0 && <span className="bg-amber-400 text-red-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-red-600 shadow animate-pulse">{totalItemsInCart}</span>}
            </button>
          )}

          {/* TOMBOL ADMIN / LIHAT TOKO */}
          {user ? (
            <button
              onClick={() => setView(view === "admin" ? "user" : "admin")}
              className="bg-white/10 hover:bg-white/20 text-white font-black text-[11px] sm:text-xs px-3 py-2 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1 flex-1 md:flex-none active:scale-95"
            >
              {view === "admin" ? "👁️ Lihat Toko" : "🛠️ Admin"}
            </button>
          ) : (
            // Menyembunyikan tombol admin login saat membuka halaman promosi biar tidak terlalu padat di HP
            view !== "login" &&
            view !== "about" && (
              <button onClick={() => setView("login")} className="bg-white/10 hover:bg-white/20 text-white font-black text-[11px] sm:text-xs px-3 py-2 rounded-xl border border-white/10 transition-all flex-1 md:flex-none active:scale-95">
                🔒 Admin
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
