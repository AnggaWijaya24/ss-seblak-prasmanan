import { useState, useEffect } from "react";
import { LogOut, Plus, Edit3, Trash2, Check, X, Image as ImageIcon, ChefHat, CheckCircle, Clock, History, RotateCcw, User } from "lucide-react";

export default function DashboardAdmin({
  handleLogout,
  user,
  isEditing,
  editId,
  newItem,
  setNewItem,
  handleSubmitItem,
  uploading,
  setSelectedFile,
  startEdit,
  cancelEdit,
  menu,
  handleToggleStok,
  setDeleteModal,
  orders,
  handleUpdateStatusOrder,
  loadingOrders,
  openConfirmModal,
  daftarKuah,
  handleSaveEditPesanan,
  handleToggleTerlaris,
}) {
  const [adminSubTab, setAdminSubTab] = useState("live");
  const [imagePreview, setImagePreview] = useState(null); // State baru untuk pratinjau foto instan

  // STATE: Mengurus Modal Popup Edit Pesanan Pembeli
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [editOrderForm, setEditOrderForm] = useState({ id: null, nama_pemesan: "", varian_kuah: "", level_pedas: 3, tipe_makan: "Dine In", lokasi_meja_alamat: "", rincian_mangkok: [] });

  // STATISTIK ENGINE
  const totalVarian = menu.length;
  const stokHabis = menu.filter((item) => !item.stok_tersedia).length;
  const pesananAktif = orders.filter((order) => order.status_orderan === "Pending" || order.status_orderan === "Sedang Dimasak").length;

  const totalOmzet = orders.filter((order) => order.status_orderan === "Selesai").reduce((total, order) => total + Number(order.total_bayar), 0);

  const orderanLiveDapur = orders.filter((order) => order.status_orderan === "Pending" || order.status_orderan === "Sedang Dimasak");
  const orderanRiwayatSelesai = orders.filter((order) => order.status_orderan === "Selesai");

  // Reset pratinjau gambar jika status edit dibatalkan atau selesai disimpan
  useEffect(() => {
    if (!isEditing) {
      setImagePreview(null);
    }
  }, [isEditing, menu]);

  // Fungsi untuk membaca file lokal dan menjadikannya URL pratinjau sebelum diupload
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Membuat blob URL sementara
    }
  }

  function openEditOrderModal(order) {
    setEditOrderForm({
      id: order.id,
      nama_pemesan: order.nama_pemesan,
      varian_kuah: order.varian_kuah,
      level_pedas: order.level_pedas,
      tipe_makan: order.tipe_makan,
      lokasi_meja_alamat: order.lokasi_meja_alamat,
      rincian_mangkok: [...order.rincian_mangkok],
    });
    setIsEditingOrder(true);
  }

  function updateToppingQtyInForm(namaItem, delta) {
    setEditOrderForm((prev) => {
      const updatedMangkok = prev.rincian_mangkok
        .map((it) => {
          if (it.nama_item === namaItem) {
            const newQty = it.qty + delta;
            return newQty > 0 ? { ...it, qty: newQty } : null;
          }
          return it;
        })
        .filter(Boolean);
      return { ...prev, rincian_mangkok: updatedMangkok };
    });
  }

  function addNewToppingToForm(namaItem) {
    const sdhAda = editOrderForm.rincian_mangkok.find((it) => it.nama_item === namaItem);
    if (sdhAda) {
      updateToppingQtyInForm(namaItem, 1);
    } else {
      setEditOrderForm((prev) => ({
        ...prev,
        rincian_mangkok: [...prev.rincian_mangkok, { nama_item: namaItem, qty: 1 }],
      }));
    }
  }

  function submitEditOrder(e) {
    e.preventDefault();
    let totalBaru = 0;
    editOrderForm.rincian_mangkok.forEach((cartItem) => {
      const infoMenu = menu.find((m) => m.nama_item === cartItem.nama_item);
      if (infoMenu) totalBaru += infoMenu.harga * cartItem.qty;
    });
    handleSaveEditPesanan({ ...editOrderForm, total_bayar: totalBaru });
    setIsEditingOrder(false);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
      {/* HEADER UTAMA */}
      <div className="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm border border-amber-100">
        <div>
          <h3 className="text-xl font-black text-slate-800">Dashboard Manajemen Menu 🛠️</h3>
          <p className="text-xs text-slate-500">Pemilik Warung: {user?.email}</p>
        </div>
        <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 border border-red-100 transition-all">
          <LogOut className="w-3 h-3" /> Keluar
        </button>
      </div>

      {/* METRIK STATISTIK */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Menu</p>
            <h4 className="text-lg font-black text-slate-800 mt-0.5">{totalVarian} Varian</h4>
          </div>
          <div className="text-xl bg-amber-50 p-2 rounded-xl">🍱</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stok Habis</p>
            <h4 className={`text-lg font-black mt-0.5 ${stokHabis > 0 ? "text-red-600" : "text-slate-800"}`}>{stokHabis} Item</h4>
          </div>
          <div className="text-xl bg-red-50 p-2 rounded-xl">❌</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Antrean Live</p>
            <h4 className={`text-lg font-black mt-0.5 ${pesananAktif > 0 ? "text-orange-500 animate-pulse" : "text-slate-800"}`}>{pesananAktif} Mangkok</h4>
          </div>
          <div className="text-xl bg-orange-50 p-2 rounded-xl">🔥</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-4 rounded-2xl text-white shadow-sm flex flex-col justify-between gap-1.5">
          <div>
            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Omzet Hari Ini</p>
            <h4 className="text-base font-black">Rp {totalOmzet.toLocaleString("id-ID")}</h4>
          </div>
          <button
            onClick={() => openConfirmModal("reset_omzet", null, "Tutup Buku")}
            className="bg-white/20 hover:bg-white text-white hover:text-emerald-800 font-extrabold text-[9px] py-1 px-2 rounded-lg flex items-center gap-1 transition-all self-start"
          >
            <RotateCcw className="w-2.5 h-2.5" /> Tutup Buku
          </button>
        </div>
      </div>

      {/* PUSAT KENDALI TRANSAKSI RESTO */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
          <h4 className="font-extrabold text-slate-800 flex items-center gap-2 text-base">
            <ChefHat className="text-red-600 w-5 h-5" /> Pusat Kendali Transaksi Resto
          </h4>
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-xs font-bold w-fit border">
            <button onClick={() => setAdminSubTab("live")} className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${adminSubTab === "live" ? "bg-white text-red-600 shadow" : "text-slate-500"}`}>
              <Clock className="w-3.5 h-3.5" /> Antrean Dapur ({orderanLiveDapur.length})
            </button>
            <button onClick={() => setAdminSubTab("history")} className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${adminSubTab === "history" ? "bg-white text-emerald-600 shadow" : "text-slate-500"}`}>
              <History className="w-3.5 h-3.5" /> Riwayat Kasir ({orderanRiwayatSelesai.length})
            </button>
          </div>
        </div>

        {loadingOrders ? (
          <div className="text-center py-6 text-slate-400 text-sm">Menghubungkan ke server kasir... 📨</div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {/* SUB-TAB 1: LIVE QUEUE */}
            {adminSubTab === "live" &&
              (orderanLiveDapur.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 border border-dashed rounded-2xl text-slate-400 text-sm font-medium">🙌 Bersih! Semua seblak pembeli sudah selesai dimasak.</div>
              ) : (
                orderanLiveDapur.map((order, index) => (
                  <div
                    key={order.id}
                    className={`p-5 rounded-2xl border-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all bg-white hover:shadow-sm ${order.status_orderan === "Pending" ? "border-red-100" : "border-orange-200 shadow-inner"}`}
                  >
                    <div className="space-y-2 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-black text-slate-800">Antrean #{index + 1}</span>
                        <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border px-1.5 py-0.5 rounded">ID Database: {order.id}</span>
                        <div className="bg-slate-100 border text-slate-700 px-2.5 py-0.5 rounded-lg font-bold text-xs flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" /> {order.nama_pemesan}
                        </div>
                        <div className="bg-red-50 text-red-700 px-2.5 py-0.5 rounded-lg font-black text-xs uppercase tracking-wider">
                          {order.tipe_makan} ({order.lokasi_meja_alamat})
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wide border ${order.status_orderan === "Pending" ? "bg-red-50 text-red-600 border-red-200" : "bg-orange-50 text-orange-600 border-orange-200"}`}
                        >
                          {order.status_orderan === "Pending" ? "📥 Antrean Masuk" : "🍳 Di Wajan"}
                        </span>
                      </div>

                      <div className="text-xs bg-slate-50 border p-2 rounded-xl inline-flex flex-col gap-0.5 text-slate-600 font-semibold w-full sm:w-auto">
                        <div className="flex items-center gap-1">
                          🍜{" "}
                          <span>
                            Kuah: <strong>{order.varian_kuah}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-red-600">
                          🔥{" "}
                          <span>
                            Kepedasan: <strong>Level {order.level_pedas}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {order.rincian_mangkok.map((it, idx) => (
                          <span key={idx} className="text-[11px] bg-amber-50/50 border border-amber-200/60 px-2.5 py-1 rounded-lg font-bold text-slate-700">
                            {it.nama_item} <strong className="text-red-600 ml-0.5">x{it.qty}</strong>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CONTROLLER PANEL ANTRIAN */}
                    <div className="w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-dashed border-slate-200 flex flex-row md:flex-col justify-between items-center md:items-end gap-3 flex-shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider leading-none">Total Tagihan</span>
                        <div className="flex flex-row items-baseline gap-0.5 text-red-600 font-black text-base md:text-lg whitespace-nowrap mt-0.5">
                          <span>Rp</span>
                          <span>{order.total_bayar.toLocaleString("id-ID")}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openConfirmModal("delete_order", order.id, order.nama_pemesan)}
                          className="p-2 bg-white border border-slate-200 hover:border-red-400 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-xs flex items-center justify-center flex-shrink-0"
                          title="Batalkan / Hapus pesanan"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditOrderModal(order)}
                          className="p-2 bg-white border border-slate-200 hover:border-amber-400 text-slate-400 hover:text-amber-500 rounded-xl transition-all shadow-xs flex items-center justify-center flex-shrink-0"
                          title="Ubah rincian pesanan"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {order.status_orderan === "Pending" ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatusOrder(order.id, "Sedang Dimasak")}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black py-2 px-3.5 rounded-xl flex items-center gap-1 shadow-sm transition-colors whitespace-nowrap"
                          >
                            🍳 Masak
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatusOrder(order.id, "Selesai")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black py-2 px-3.5 rounded-xl flex items-center gap-1 shadow-sm transition-all whitespace-nowrap"
                          >
                            ✅ Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ))}

            {/* SUB-TAB 2: HISTORY LIST */}
            {adminSubTab === "history" &&
              (orderanRiwayatSelesai.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm font-medium">Belum ada riwayat transaksi lunas.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-2">ID/Nama</th>
                        <th className="py-2.5 px-2">Racikan Kuah</th>
                        <th className="py-2.5 px-2">Nota Bayar</th>
                        <th className="py-2.5 px-2 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {orderanRiwayatSelesai.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-2 font-bold text-slate-800">
                            #{order.id} {order.nama_pemesan}
                            <span className="block text-[10px] font-normal text-slate-400">
                              {order.tipe_makan} ({order.lokasi_meja_alamat})
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-slate-500">
                            Lvl {order.level_pedas} - {order.varian_kuah.substring(0, 15)}...
                          </td>
                          <td className="py-2.5 px-2 text-emerald-600 font-bold">Rp {order.total_bayar.toLocaleString("id-ID")}</td>
                          <td className="py-2.5 px-2 text-center">
                            <button type="button" onClick={() => openConfirmModal("delete_order", order.id, order.nama_pemesan)} className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* POPUP EDIT DETAILS MANGKOK ORDERAN */}
      {isEditingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <form onSubmit={submitEditOrder} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-100 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h4 className="font-black text-slate-800 text-base">📝 Ubah Rincian Order Pembeli #{editOrderForm.id}</h4>
              <button type="button" onClick={() => setIsEditingOrder(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-grow">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Pembeli</label>
                  <input
                    type="text"
                    required
                    value={editOrderForm.nama_pemesan}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, nama_pemesan: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Level Pedas (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    required
                    value={editOrderForm.level_pedas}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, level_pedas: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilihan Basis Kuah</label>
                  <select
                    value={editOrderForm.varian_kuah}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, varian_kuah: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 bg-white text-sm font-semibold focus:outline-none"
                  >
                    {daftarKuah.map((k) => (
                      <option key={k.nama} value={k.nama}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi Meja / Alamat</label>
                  <input
                    type="text"
                    required
                    value={editOrderForm.lokasi_meja_alamat}
                    onChange={(e) => setEditOrderForm({ ...editOrderForm, lokasi_meja_alamat: e.target.value })}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="border-t pt-3">
                <label className="block font-black text-red-600 text-xs uppercase tracking-wider mb-2">Isi Mangkok Saat Ini:</label>
                {editOrderForm.rincian_mangkok.length === 0 ? (
                  <p className="text-slate-400 font-medium text-center py-2">Mangkok kosong, silakan tambah di bawah.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border">
                    {editOrderForm.rincian_mangkok.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2 border rounded-lg shadow-sm">
                        <span className="font-bold text-slate-700 line-clamp-1">{it.nama_item}</span>
                        <div className="flex items-center gap-1.5 bg-slate-50 px-1.5 py-0.5 rounded border">
                          <button type="button" onClick={() => updateToppingQtyInForm(it.nama_item, -1)} className="text-red-500 font-bold">
                            -
                          </button>
                          <span className="font-black text-slate-800 text-[11px]">{it.qty}</span>
                          <button type="button" onClick={() => updateToppingQtyInForm(it.nama_item, 1)} className="text-red-500 font-bold">
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-3">
                <label className="block font-bold text-slate-600 mb-1.5">➕ Klik Topping dari Rak untuk Menambahkan:</label>
                <div className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto bg-slate-100/50 p-2 rounded-xl border">
                  {menu
                    .filter((m) => m.stok_tersedia)
                    .map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => addNewToppingToForm(m.nama_item)}
                        className="bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border px-2 py-1 rounded-md text-[11px] font-bold transition-colors"
                      >
                        + {m.nama_item}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t mt-4">
              <button type="button" onClick={() => setIsEditingOrder(false)} className="flex-1 bg-slate-100 font-bold p-2.5 rounded-xl text-xs text-slate-600">
                Batal
              </button>
              <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 font-black p-2.5 rounded-xl text-xs text-white">
                Simpan Perubahan Nota 💾
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RAK MANAGEMENT VARIAN MENU CRUD - TATA LETAK GRID DUA KOLOM UTAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 h-fit">
          <h4 className="font-bold text-slate-800 mb-4 text-base">{isEditing ? <span className="text-amber-600">📝 Edit Varian Menu</span> : <span className="text-red-600">➕ Tambah Varian Baru</span>}</h4>
          <form onSubmit={handleSubmitItem} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nama Bahan/Item</label>
              <input
                type="text"
                required
                disabled={uploading}
                value={newItem.nama_item}
                onChange={(e) => setNewItem({ ...newItem, nama_item: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none disabled:opacity-50"
                placeholder="Contoh: Bakso Mercon"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Kategori</label>
              <select
                disabled={uploading}
                value={newItem.kategori}
                onChange={(e) => setNewItem({ ...newItem, kategori: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm bg-white focus:outline-none disabled:opacity-50"
              >
                <option value="Mie">Mie</option>
                <option value="Sayuran">Sayuran</option>
                <option value="Jamur">Jamur</option>
                <option value="Topping">Topping</option>
                <option value="Kerupuk">Kerupuk</option>
                <option value="Telur">Telur</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Harga Satuan (Rp)</label>
              <input
                type="number"
                required
                disabled={uploading}
                value={newItem.harga}
                onChange={(e) => setNewItem({ ...newItem, harga: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none disabled:opacity-50"
                placeholder="Contoh: 1500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Foto Menu</label>
              <div className={`relative border-2 border-dashed rounded-xl p-4 text-center bg-slate-50/50 transition-colors ${uploading ? "border-amber-400 bg-amber-50/10" : "border-slate-200 cursor-pointer"}`}>
                <input type="file" accept="image/*" disabled={uploading} onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />

                {/* LOGIKA MAKSIMAL INDIKATOR STATUS GAMBAR & LIVE LOCAL PREVIEW */}
                {uploading ? (
                  <div className="flex flex-col items-center justify-center gap-1.5 text-amber-600">
                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[11px] font-bold animate-pulse">Mengirim file gambar ke cloud Supabase...</p>
                  </div>
                ) : imagePreview ? (
                  <div className="flex flex-col items-center justify-center gap-1.5 animate-fade-in">
                    <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-xl shadow-sm border-2 border-amber-400" />
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-wide">✔ File Terpilih & Siap Diupload</p>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-slate-500">Pilih file foto baru jika ingin mengganti</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={uploading}
                className={`w-full font-black p-2.5 rounded-xl text-xs uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 shadow-md ${
                  uploading ? "bg-slate-400 cursor-not-allowed" : isEditing ? "bg-amber-500 hover:bg-amber-600" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {uploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sedang Menyimpan...</span>
                  </>
                ) : isEditing ? (
                  "Simpan Perubahan"
                ) : (
                  "Simpan Menu Baru"
                )}
              </button>

              {isEditing && !uploading && (
                <button type="button" onClick={cancelEdit} className="w-full bg-slate-100 text-slate-600 font-bold p-2.5 rounded-xl text-xs transition-colors">
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* KOLOM MASTER DATA DAFTAR RAK PRASMANAN (PERBAIKAN TOTAL MODE MOBILE & DESKTOP) */}
        <div className="md:col-span-2 bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-amber-100">
          <h4 className="font-bold text-slate-800 mb-4 text-base">Daftar Rak Prasmanan ({menu.length} Item)</h4>

          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 px-1 pb-2 scrollbar-thin">
            {menu.map((item) => {
              const sedangDiEdit = isEditing && Number(editId) === Number(item.id);

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all duration-300 ${
                    sedangDiEdit ? "border-amber-400 bg-amber-50/60 shadow-md ring-2 ring-amber-400/80 scale-[1.01]" : "border-slate-100 bg-slate-50"
                  }`}
                >
                  {/* SISI KIRI: Foto + Nama Bahan + Kategori & Harga */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {item.gambar_url ? (
                      <img
                        src={item.gambar_url}
                        loading="lazy"
                        alt={item.nama_item}
                        className="w-12 h-12 object-cover rounded-xl border flex-shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = item.gambar_url;
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-800 flex-shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h5 className="font-black text-slate-800 text-sm sm:text-base truncate">{item.nama_item}</h5>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{item.kategori}</span>
                        <span className="text-xs font-black text-red-600">Rp {item.harga.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>

                  {/* SISI KANAN: Panel Tombol Kontrol Aksi */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-200/60 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleTerlaris(item.id, item.is_terlaris)}
                      className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-colors flex items-center justify-center gap-0.5 ${
                        item.is_terlaris ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs" : "bg-white text-slate-400 border-slate-200 hover:bg-slate-100"
                      }`}
                      title={item.is_terlaris ? "Hapus dari menu terlaris" : "Jadikan menu terlaris"}
                    >
                      <span>{item.is_terlaris ? "⭐ Terlaris" : "☆ Biasa"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStok(item.id, item.stok_tersedia)}
                      className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-colors flex items-center justify-center min-w-[65px] ${
                        item.stok_tersedia ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600" : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                      }`}
                    >
                      <span>{item.stok_tersedia ? "Tersedia" : "Habis"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className={`p-2 rounded-xl border transition-all duration-200 shadow-sm ${
                        sedangDiEdit ? "bg-amber-500 text-white border-amber-500 animate-pulse" : "bg-white text-slate-400 border-slate-200 hover:border-amber-400 hover:text-amber-500 hover:bg-amber-50"
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteModal({ show: true, itemId: item.id, itemName: item.nama_item })}
                      className="p-2 text-slate-400 bg-white rounded-xl border border-slate-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
