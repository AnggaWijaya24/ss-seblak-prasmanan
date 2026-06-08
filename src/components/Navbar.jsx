import { ShoppingCart, BookOpen } from "lucide-react";

export default function Navbar({ view, setView, user, totalItemsInCart, setIsCartOpen }) {
  return (
    <header className="bg-red-600 text-white shadow-md sticky top-0 z-50 w-full">
      {/* Container responsif: flex-col di HP, flex-row di Desktop */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* LOGO TEXT */}
        <h1 onClick={() => setView("user")} className="font-black text-xl sm:text-2xl tracking-wider cursor-pointer uppercase select-none hover:text-amber-200 transition-colors text-center sm:text-left w-full sm:w-auto">
          🍲 SS SEBLAK PRASMANAN
        </h1>

        {/* BUTTON GROUP - Lebar penuh di HP, otomatis di desktop */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <button
            type="button"
            onClick={() => setView(view === "about" ? "user" : "about")}
            className={`font-bold text-xs px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all border flex-1 sm:flex-none ${
              view === "about" ? "bg-amber-400 text-red-950 border-amber-400" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{view === "about" ? "Menu" : "Tentang Kedai"}</span>
          </button>

          {view === "user" && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all border border-white/10 flex-1 sm:flex-none"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Keranjang</span>
              {totalItemsInCart > 0 && <span className="bg-amber-400 text-red-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">{totalItemsInCart}</span>}
            </button>
          )}

          {view !== "login" && view !== "about" && (
            <button
              onClick={() => setView(view === "admin" ? "user" : user ? "admin" : "login")}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3 py-2.5 rounded-xl border border-white/10 transition-all flex-1 sm:flex-none"
            >
              {view === "admin" ? "Toko" : "🔒 Admin"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
