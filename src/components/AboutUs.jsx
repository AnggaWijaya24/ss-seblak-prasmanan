import { Sparkles, Heart, ShieldCheck, Soup, Users, MapPin } from 'lucide-react'

export default function AboutUs({ setView }) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
      {/* HERO PROMOSI */}
      <section className="text-center space-y-4 bg-gradient-to-br from-red-600 to-orange-500 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="inline-flex items-center gap-1 bg-amber-400 text-red-950 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3 fill-red-950" /> Kenalan Yuk!
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Cerita Di Balik <br/><span className="text-amber-300">SS Seblak Prasmanan</span></h2>
        <p className="text-xs sm:text-sm text-red-50 max-w-xl mx-auto leading-relaxed font-medium">
          Lebih dari sekadar kuliner pedas, kami hadir sebagai pelopor petualangan rasa seblak modern yang higienis, bebas pilih suka-suka, dan ramah di kantong anak muda!
        </p>
      </section>

      {/* TIGA PILAR UTAMA TOKO */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm text-center space-y-2">
          <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto text-lg">🍲</div>
          <h4 className="font-black text-slate-800 text-sm">Kuah Rempah Asli</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Kami menggunakan 100% kencur segar dan racikan bumbu rahasia harian tanpa perisa buatan. Gurihnya alami, nagihnya hakiki!</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm text-center space-y-2">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto text-lg">✨</div>
          <h4 className="font-black text-slate-800 text-sm">Konsep Bebas Prasmanan</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Gak ada lagi batasan porsi kaku! Kamu pegang kendali penuh atas mangkokmu. Pilih topping favoritmu sesuka hati dari rak bersih kami.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm text-center space-y-2">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto text-lg">🛡️</div>
          <h4 className="font-black text-slate-800 text-sm">Jaminan 100% Halal & Fresh</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Seluruh bahan pelengkap mulai dari aneka kerupuk, dumpling, hingga sayuran dipasok segar setiap pagi demi menjaga kualitas rasa premium.</p>
        </div>
      </section>

      {/* FILOSOFI WARUNG & STRUKTUR MAPS YANG SEIMBANG */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* KOLOM KIRI: TEKS DAN ADALAT */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-red-600 flex items-center gap-1.5">
              <Soup className="w-5 h-5" /> Mengapa Harus "SS"?
            </h3>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Nama "SS" adalah representasi dari komitmen kami untuk menghadirkan cita rasa seblak yang **Sempurna & Segar**. Warung kami didirikan atas keresahan melihat banyaknya seblak prasmanan di pinggir jalan yang kurang memperhatikan kebersihan wadah dan kesegaran bahan baku.
            </p>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Di SS Seblak Prasmanan, kami mengawinkan estetika warung makan modern yang bersih nan estetik dengan kenikmatan bumbu autentik nusantara tradisional.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl space-y-2 border border-slate-700 shadow-inner">
            <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Lokasi Hangout Kami</h4>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
              Datang langsung ke kedai kami untuk menikmati kehangatan seblak langsung di wajan koki bersama kawan-kawan sirkelmu!
            </p>
            <div className="text-xs font-bold border-t border-slate-700/60 pt-2 text-slate-200">
              📍 Lokasi Operasional Utama Kedai: <br/>
              <span className="text-white font-black text-xs block mt-1">Jl. Ps. 10, Sei Limbat, Kec. Selesai, Kabupaten Langkat, Sumatera Utara</span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: GOOGLE MAPS SEJAJAR PENUH */}
        <div className="w-full h-full min-h-[300px] bg-slate-100 rounded-2xl border-2 border-amber-100/60 overflow-hidden shadow-md relative group">
          <iframe
            title="Lokasi Utama SS Seblak Prasmanan"
            // Link baru ini murni memuat Peta Jalan Raya Area Medan, USU, hingga Binjai
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2018.8243336861053!2d98.43817562235294!3d3.6124718631928374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3030d7001601b9a7%3A0x8e644965a9573a6c!2sSS%20Cafe!5e0!3m2!1sen!2sid!4v1780717240398!5m2!1sen!2sid" 
            className="w-full h-full absolute inset-0 grayscale-[10%] contrast-[105%] group-hover:grayscale-0 transition-all duration-300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* FOOTER ACTION */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setView('user')}
          className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:scale-102 active:scale-98"
        >
          🔥 Mulai Racik Mangkok Seblakmu Sekarang! 🔥
        </button>
      </div>
    </main>
  )
}