import { X } from "lucide-react";

export default function LoginAdmin({ handleLogin, email, setEmail, password, setPassword, loginError, setView }) {
  return (
    <div className="max-w-md mx-auto my-16 p-6 bg-white rounded-3xl shadow-sm border border-amber-100 relative">
      {/* TOMBOL SILANG KEMBALI KE KATALOG */}
      <button onClick={() => setView("user")} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors" title="Kembali ke Katalog Pembeli">
        <X className="w-4 h-4" />
      </button>

      <div className="text-center space-y-1 mb-6">
        <h3 className="text-xl font-black text-slate-800">Gembok Akun Admin 🔒</h3>
        <p className="text-xs text-slate-400 font-medium">Khusus internal pengelola SS Seblak Prasmanan</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold text-slate-600">
        <div>
          <label className="block mb-1">Email / Username Admin</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-sm focus:outline-none focus:border-red-500" placeholder="admin@seblak.com" />
        </div>
        <div>
          <label className="block mb-1">Password Keamanan</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-sm focus:outline-none focus:border-red-500" placeholder="••••••••" />
        </div>

        {loginError && <p className="text-red-600 text-[11px] font-bold bg-red-50 p-2 rounded-lg text-center border border-red-100">❌ {loginError}</p>}

        <div className="flex flex-col gap-2 pt-2">
          <button type="submit" className="w-full bg-red-600 text-white font-black p-3 rounded-xl text-xs uppercase tracking-wider hover:bg-red-700 transition-colors">
            Masuk Kunci Dashboard 🔑
          </button>
          <button type="button" onClick={() => setView("user")} className="w-full bg-slate-100 text-slate-600 font-bold p-3 rounded-xl text-xs transition-colors">
            Batal & Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
