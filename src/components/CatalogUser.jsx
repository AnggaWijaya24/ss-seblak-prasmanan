import { useState } from "react";
import { ShieldCheck, Image as ImageIcon, X, Minus, Plus, ShoppingCart, Check, Flame, Search, Sparkles, TicketPercent } from "lucide-react";

export default function CatalogUser({ menu, loading, cart, addToCart, decreaseQty, removeInstantFromCart, calculateTotal, totalItemsInCart, isCartOpen, setIsCartOpen, handleCheckoutSubmit, checkoutForm, setCheckoutForm, daftarKuah }) {
  const [activeTab, setActiveTab] = useState("Semua Topping");
  const [searchQuery, setSearchQuery] = useState(""); // State baru untuk pencarian

  const daftarKategori = ["Semua Topping", "Mie", "Sayuran", "Jamur", "Topping", "Kerupuk", "Telur"];

  // Logika penyaringan ganda: Berdasarkan Kategori DAN Kotak Pencarian
  const menuTersaring = menu.filter((item) => {
    const cocokKategori = activeTab === "Semua Topping" || item.kategori === activeTab;
    const cocokPencarian = item.nama_item.toLowerCase().includes(searchQuery.toLowerCase());
    return cocokKategori && cocokPencarian;
  });

  return (
    <>
      {/* HERO SECTION DENGAN GRADIENT & AKSEN ESTETIK BARU */}
      <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-orange-500 text-white py-14 px-4 overflow-hidden shadow-md">
        {/* Ornamen Estetik Latar Belakang */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-30px] left-[-20px] w-52 h-52 bg-amber-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1 bg-amber-400 text-red-950 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm animate-bounce">
            <Sparkles className="w-3 h-3 fill-red-950" /> LEVEL UP SEBLAK PRASMANAN
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
            SS SEBLAK <span className="text-amber-300">PRASMANAN</span> 🔥
          </h2>
          <p className="text-red-50 max-w-md mx-auto text-xs sm:text-sm font-medium leading-relaxed opacity-90">Sensasi petualangan ngeracik seblak sesukamu. Pilih toppingnya, tentukan kuah rempahnya, tantang level pedasmu!</p>

          <div className="pt-2 flex justify-center gap-3 text-[10px] font-bold">
            <span className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> 100% Halal
            </span>
            <span className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Bahan Fresh Harian
            </span>
          </div>
        </div>
      </section>

      {/* BANNER PROMO CAROUSEL MINI (MELAYANG DI ATAS MENU) */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-amber-500 to-amber-400 p-3.5 rounded-2xl shadow-md border border-amber-300 flex items-center gap-3 text-amber-950">
            <div className="bg-white/30 p-2 rounded-xl">
              <TicketPercent className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-wide">Sirkel Hemat Banner! 🏷️</h5>
              <p className="text-[11px] font-semibold opacity-90">Makan bareng temen minimal Rp30.000, GRATIS Es Teh Manis Jumbo!</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-3.5 rounded-2xl shadow-md border border-slate-700 flex items-center gap-3 text-white">
            <div className="bg-white/10 p-2 rounded-xl">🍜</div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-wide text-amber-400">Rekomendasi Racikan Koki ✨</h5>
              <p className="text-[11px] font-medium text-slate-300">
                Paduan <span className="text-white font-bold">Indomie + Cuanki Lidah + Telur Kocok</span> adalah kelezatan hakiki.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {/* FILTER BAR & SEARCH BAR ROW CONTAINER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
          {/* TAB FILTER KATEGORI */}
          <div className="overflow-x-auto pb-1 scrollbar-none md:max-w-[70%]">
            <div className="flex gap-2 min-w-max items-center">
              {daftarKategori.map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setActiveTab(kat)}
                  className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all duration-200 ${
                    activeTab === kat ? "bg-red-600 text-white shadow-md shadow-red-600/20 scale-105" : "bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100"
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          {/* KOTAK PENCARIAN (SEARCH BAR) INTERAKTIF */}
          <div className="relative flex-grow md:max-w-[28%]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ceker, dumpling, mie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 hover:text-slate-600">
                ×
              </button>
            )}
          </div>
        </div>

        {/* LOGIKA SKELETON LOADING YANG KINI TERPISAH BERSIH (ANTI ANOMALI) */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border p-4 flex flex-col justify-between animate-pulse space-y-4">
                <div>
                  <div className="w-full h-32 bg-slate-200 rounded-xl mb-3"></div>
                  <div className="w-1/3 h-3 bg-slate-200 rounded mb-2"></div>
                  <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="w-1/2 h-5 bg-slate-200 rounded"></div>
                  <div className="w-1/3 h-7 bg-slate-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : menuTersaring.length === 0 ? (
          /* PERBAIKAN: Jika pembeli mencari topping yang tidak ada di rak, muncul pemberitahuan yang estetik */
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 max-w-md mx-auto p-6 shadow-inner animate-fade-in">
            <div className="text-4xl mb-2">🔍❌</div>
            <h5 className="font-black text-slate-700 text-sm">Topping "{searchQuery}" Gak Ditemukan</h5>
            <p className="text-[11px] text-slate-400 mt-1">Coba cek ejaan kamu atau pilih varian bahan seblak mantap lainnya di tab kategori ya!</p>
          </div>
        ) : (
          /* GRID UTAMA MENU DENGAN SENTUHAN VISUAL TAG TERLARIS */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
            {menuTersaring.map((item) => {
              const apakahBestSeller = item.is_terlaris;

              return (
                <div key={item.id} className={`bg-white rounded-2xl shadow-sm border border-amber-100 p-4 flex flex-col justify-between transition-all hover:shadow-md relative group ${!item.stok_tersedia && "opacity-60"}`}>
                  {/* VISUAL TAG: Label kuning emas melayang yang sangat profesional */}
                  {apakahBestSeller && item.stok_tersedia && (
                    <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-500 to-amber-400 text-amber-950 font-black text-[9px] px-2 py-0.5 rounded-lg shadow-sm border border-amber-300 flex items-center gap-0.5 tracking-wider uppercase">
                      👑 Terlaris
                    </div>
                  )}

                  <div>
                    {item.gambar_url ? (
                      <img
                        src={item.gambar_url}
                        alt={item.nama_item}
                        loading="lazy"
                        className="w-full h-32 object-cover rounded-xl mb-3 border border-amber-100 transition-transform duration-300 group-hover:scale-102 will-change-transform"
                      />
                    ) : (
                      <div className="w-full h-32 bg-amber-50/60 rounded-xl flex flex-col items-center justify-center text-slate-400 font-bold text-xs mb-3 border border-dashed border-amber-100 gap-1">
                        <ImageIcon className="w-5 h-5 text-amber-200" /> Tanpa Foto
                      </div>
                    )}
                    <span className="text-[10px] uppercase tracking-wider font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{item.kategori}</span>
                    <h4 className="font-bold text-slate-800 mt-1 text-sm sm:text-base line-clamp-1">{item.nama_item}</h4>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-50 flex justify-between items-center">
                    <span className="font-black text-red-600 text-sm sm:text-base">Rp {item.harga.toLocaleString("id-ID")}</span>
                    {item.stok_tersedia ? (
                      <button type="button" onClick={() => addToCart(item)} className="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg transition-all border border-red-200 shadow-sm">
                        + Ambil
                      </button>
                    ) : (
                      <span className="bg-slate-100 text-slate-400 font-bold text-[10px] px-2 py-1.5 rounded-lg">Habis</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* SIDEBAR DRAWER KERANJANG (PERBAIKAN TOTAL MODE MOBILE & DESKTOP RESPONSIVITAS) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="flex-grow" onClick={() => setIsCartOpen(false)}></div>

          {/* FIXED PANEL: Dikunci h-full dan max-h-screen agar stabil di laptop dan HP */}
          <div className="w-full max-w-md bg-white h-full max-h-screen shadow-2xl flex flex-col justify-between border-l border-amber-100 animate-slide-left">
            {/* A. HEADER PANEL (Tetap Diam / Sticky di Atas) */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2 text-red-600">
                <ShoppingCart className="w-5 h-5" />
                <h4 className="font-black text-base sm:text-lg text-slate-800">Isi Mangkok Kamu</h4>
              </div>
              <button type="button" onClick={() => setIsCartOpen(false)} className="p-1.5 text-slate-400 bg-white hover:bg-slate-100 rounded-full border shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* B. AREA INTERNAL SCROLL: Menampung list menu belanjaan & input data pembeli */}
            {/* Bagian ini flex-1 dan overflow-y-auto agar bebas di-scroll kebawah pas keyboard HP muncul */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 pb-24 scrollbar-thin">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-medium text-sm">
                  Mangkok masih kosong!
                  <br />
                  Yuk ambil topping pilihanmu.
                </div>
              ) : (
                /* List Item Belanja Topping */
                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="max-w-[55%]">
                        <h5 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-1">{item.nama_item}</h5>
                        <p className="text-xs text-red-600 font-black mt-0.5">
                          Rp {(item.harga * item.qty).toLocaleString("id-ID")} <span className="text-slate-400 font-normal">({item.qty}x)</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-sm">
                          <button type="button" onClick={() => decreaseQty(item.id)} className="text-slate-500 hover:text-red-600">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-xs text-slate-800 w-3 text-center">{item.qty}</span>
                          <button type="button" onClick={() => addToCart(item)} className="text-slate-500 hover:text-red-600">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button type="button" onClick={() => removeInstantFromCart(item.id, item.nama_item)} className="p-1.5 text-slate-300 hover:text-red-600 bg-white border border-slate-200 rounded-lg">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Form Isian Alamat / Meja Pembeli */}
              {cart.length > 0 && (
                <form id="formCheckoutSeblak" onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    {["Dine In", "Takeaway"].map((tipe) => (
                      <button
                        key={tipe}
                        type="button"
                        onClick={() => setCheckoutForm({ ...checkoutForm, tipeMakan: tipe })}
                        className={`p-2.5 rounded-xl font-bold border text-center transition-all ${checkoutForm.tipeMakan === tipe ? "bg-slate-900 text-white border-slate-900 shadow-sm" : "bg-white text-slate-500 border-slate-200"}`}
                      >
                        {tipe === "Dine In" ? "🍽️ Makan Sini" : "🛵 Bungkus / Antar"}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Pemesan</label>
                      <input
                        type="text"
                        required
                        value={checkoutForm.nama}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, nama: e.target.value })}
                        className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-red-500"
                        placeholder="Nama Pemesan"
                      />
                    </div>

                    {checkoutForm.tipeMakan === "Takeaway" && (
                      <div className="animate-fade-in">
                        <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Aktif</label>
                        <input
                          type="tel"
                          required
                          value={checkoutForm.whatsapp || ""}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, whatsapp: e.target.value })}
                          className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-red-500"
                          placeholder="No. WhatsApp"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pilih Tipe Kuah Rempah</label>
                    <div className="space-y-1.5">
                      {daftarKuah.map((k) => (
                        <div
                          key={k.nama}
                          onClick={() => setCheckoutForm({ ...checkoutForm, kuah: k.nama })}
                          className={`p-2 rounded-xl border cursor-pointer transition-all ${checkoutForm.kuah === k.nama ? "border-red-500 bg-red-50/20" : "border-slate-100 bg-slate-50/50"}`}
                        >
                          <div className="flex justify-between items-center font-bold text-slate-800 text-xs">
                            <span>{k.nama}</span>
                            {checkoutForm.kuah === k.nama && <Check className="w-3.5 h-3.5 text-red-600" />}
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{k.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-slate-700 flex items-center gap-1">Tingkat Kepedasan: </label>
                      <span className="bg-red-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                        <Flame className="w-3 h-3 fill-white" /> Level {checkoutForm.levelPedas}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={checkoutForm.levelPedas}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, levelPedas: parseInt(e.target.value) })}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{checkoutForm.tipeMakan === "Dine In" ? "Nomor Meja Kamu" : "Alamat Pengiriman Lengkap"}</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.nomorMejaAlamat}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, nomorMejaAlamat: e.target.value })}
                      className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs focus:outline-none focus:border-red-500"
                      placeholder={checkoutForm.tipeMakan === "Dine In" ? "Contoh: Meja 05" : "Contoh: Jl. Mawar No. 4B, Binjai"}
                    />
                  </div>
                </form>
              )}
            </div>

            {/* C. FOOTER TOTAL HARGA & TOMBOL SUBMIT (Dikunci Mati Sticky di Dasar Komponen) */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex-shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-20">
                <div className="bg-red-50 p-3 rounded-xl border border-red-100/70 mb-3 text-xs">
                  <div className="flex justify-between items-center font-bold text-slate-500">
                    <span>Subtotal Racikan Prasmanan</span>
                    <span>Rp {calculateTotal().toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 mt-1.5 border-t border-red-200/30">
                    <span className="font-black text-slate-800">Total Pembayaran</span>
                    <span className="text-base font-black text-red-600">Rp {calculateTotal().toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {/* Tombol submit dikoneksikan ke ID Form diatas via HTML5 attribute form="" */}
                <button
                  form="formCheckoutSeblak"
                  type="submit"
                  className={`w-full text-white font-black p-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md active:scale-98 ${checkoutForm.tipeMakan === "Takeaway" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}
                >
                  {checkoutForm.tipeMakan === "Takeaway" ? "KIRIM PESANAN VIA WHATSAPP 📱" : "PESAN LANGSUNG KE DAPUR 🍲"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FITUR BARU: STICKY FLOATING BASKET (KERANJANG MELAYANG) */}
      {totalItemsInCart > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-6 z-40 animate-fade-in md:bottom-8 md:right-8">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-black px-5 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 border border-white/20 tracking-wide text-xs sm:text-sm"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 drop-shadow" />
              <span className="absolute -top-2 -right-2 bg-amber-400 text-red-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-red-600 shadow-sm animate-pulse">{totalItemsInCart}</span>
            </div>
            <div className="text-left border-l border-white/20 pl-3">
              <p className="text-[10px] uppercase font-bold text-red-100 leading-none">Isi Mangkok</p>
              <p className="mt-0.5 font-black text-amber-300">Rp {calculateTotal().toLocaleString("id-ID")}</p>
            </div>
          </button>
        </div>
      )}
    </>
  );
}
