import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Check, X, AlertTriangle, RotateCcw, Trash2 } from "lucide-react";

import Navbar from "./components/Navbar";
import CatalogUser from "./components/CatalogUser";
import LoginAdmin from "./components/LoginAdmin";
import DashboardAdmin from "./components/DashboardAdmin";
import AboutUs from "./components/AboutUs";

export default function App() {
  const [view, setViewState] = useState(() => {
    return localStorage.getItem("seblak_last_view") || "user";
  });

  function setView(targetView) {
    setViewState(targetView);
    localStorage.setItem("seblak_last_view", targetView);
  }

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    actionType: "",
    targetId: null,
    title: "",
    message: "",
  });

  const [checkoutForm, setCheckoutForm] = useState({
    nama: "",
    whatsapp: "",
    kuah: "Seblak Kuah Nyemek",
    levelPedas: 3,
    tipeMakan: "Dine In",
    nomorMejaAlamat: "",
  });

  // MODIFIKASI FITUR: 2 Tipe Kuah Resmi Seblak Prasmanan Gen Z
  const daftarKuah = [
    { nama: "Seblak Kuah Nyemek", desc: "Kuah kental berwangi kencur yang menyusut gurih meresap ke topping." },
    { nama: "Seblak Kuah Banjir (Cair)", desc: "Kuah melimpah segar bertabur daun jeruk, nikmat diseruput hangat." },
  ];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [newItem, setNewItem] = useState({ nama_item: "", kategori: "Topping", harga: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, itemId: null, itemName: "" });
  const [alertModal, setAlertModal] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    fetchMenu();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchOrders();
      }
    });
  }, []);

  async function fetchMenu() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("menu_seblak").select("*").order("id", { ascending: false });
      if (error) throw error;
      setMenu(data);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase.from("pesanan_seblak").select("*").neq("status_orderan", "Diarsipkan").order("id", { ascending: false });
      if (error) throw error;
      setOrders(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoadingOrders(false);
    }
  }

  function showToast(message, type = "success") {
    setAlertModal({ show: true, message, type });
    setTimeout(() => setAlertModal({ show: false, message: "", type: "success" }), 3000);
  }

  function openConfirmModal(type, id, info) {
    let title = "";
    let message = "";
    if (type === "reset_omzet") {
      title = "Tutup Buku Harian?";
      message = "Aksi ini akan mengarsipkan seluruh omzet sukses hari ini ke memori jangka panjang. ID urutan orderan berikutnya otomatis di-reset ulang dari nomor 1!";
    } else if (type === "delete_order") {
      title = "Hapus Nota Transaksi?";
      message = `Apakah kamu yakin ingin melenyapkan nota pesanan atas nama "${info}" secara permanen dari server kasir?`;
    }
    setConfirmModal({ show: true, actionType: type, targetId: id, title, message });
  }

  async function executeConfirmedAction() {
    const { actionType, targetId } = confirmModal;
    setConfirmModal((prev) => ({ ...prev, show: false }));
    try {
      if (actionType === "reset_omzet") {
        const { error: archiveError } = await supabase.from("pesanan_seblak").update({ status_orderan: "Diarsipkan" }).eq("status_orderan", "Selesai");
        if (archiveError) throw archiveError;
        const { data: antreanAktif } = await supabase.from("pesanan_seblak").select("id").neq("status_orderan", "Diarsipkan");
        if (!antreanAktif || antreanAktif.length === 0) {
          await supabase.rpc("reset_pesanan_sequence");
        }
        showToast("Buku ditutup! ID orderan di-reset dari nomor 1 🌅");
      } else if (actionType === "delete_order") {
        const { error } = await supabase.from("pesanan_seblak").delete().eq("id", targetId);
        if (error) throw error;
        showToast("Nota transaksi berhasil dimusnahkan!", "success");
      }
      fetchOrders();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleSaveEditPesanan(updatedOrder) {
    try {
      const { error } = await supabase
        .from("pesanan_seblak")
        .update({
          nama_pemesan: updatedOrder.nama_pemesan,
          varian_kuah: updatedOrder.varian_kuah,
          level_pedas: updatedOrder.level_pedas,
          tipe_makan: updatedOrder.tipe_makan,
          lokasi_me_alamat: updatedOrder.lokasi_meja_alamat,
          rincian_mangkok: updatedOrder.rincian_mangkok,
          total_bayar: updatedOrder.total_bayar,
        })
        .eq("id", updatedOrder.id);
      if (error) throw error;
      showToast(`Nota order #${updatedOrder.id} sukses dimodifikasi! 📝`);
      fetchOrders();
    } catch (err) {
      showToast("Gagal update: " + err.message, "error");
    }
  }

  function addToCart(item) {
    setCart((prevCart) => {
      const existing = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prevCart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem));
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
    showToast(`${item.nama_item} masuk ke mangkok! 🍜`);
  }

  function decreaseQty(id) {
    setCart((prevCart) => {
      const existing = prevCart.find((cartItem) => cartItem.id === id);
      if (existing.qty === 1) return prevCart.filter((cartItem) => cartItem.id !== id);
      return prevCart.map((cartItem) => (cartItem.id === id ? { ...cartItem, qty: cartItem.qty - 1 } : cartItem));
    });
  }

  function removeInstantFromCart(id, name) {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== id));
    showToast(`${name} dikeluarkan dari mangkok`, "error");
  }

  const calculateTotal = () => cart.reduce((total, item) => total + item.harga * item.qty, 0);
  const totalItemsInCart = cart.reduce((total, item) => total + item.qty, 0);

  async function handleCheckoutSubmit(e) {
    e.preventDefault();

    // 1. Ambil data keranjang & hitung total belanja saat ini secara lokal
    const rincianTopping = cart.map((item) => ({ nama_item: item.nama_item, qty: item.qty }));
    const totalTagihan = calculateTotal();
    const backupCart = [...cart]; // Backup data jika internet putus di tengah jalan

    // 2. TAKTIK OPTIMISTIC UI: Tutup modal & kosongkan layar pembeli INSTAN tanpa nunggu internet lemot
    setCart([]);
    setIsCartOpen(false);

    // 3. LOGIKA NOTIFIKASI & REDIRECT WHATSAPP INSTAN
    if (checkoutForm.tipeMakan === "Takeaway") {
      const nomorWAAdmin = "6282177526903";
      let teksWA = `*NOTIFIKASI ORDERAN SEBLAK BARU (TAKEAWAY)* 🛵\n\n`;
      teksWA += `👤 *Nama:* ${checkoutForm.nama}\n`;
      teksWA += `📱 *No. WA:* ${checkoutForm.whatsapp}\n`;
      teksWA += `🍜 *Kuah:* ${checkoutForm.kuah}\n`;
      teksWA += `🔥 *Level Pedas:* Level ${checkoutForm.levelPedas}\n`;
      teksWA += `📍 *Alamat Kirim:* ${checkoutForm.nomorMejaAlamat}\n\n`;
      teksWA += `🛒 *Rincian Isi Mangkok:* \n`;

      backupCart.forEach((item, index) => {
        teksWA += `${index + 1}. ${item.nama_item} (x${item.qty}) - Rp ${(item.harga * item.qty).toLocaleString("id-ID")}\n`;
      });

      teksWA += `\n💰 *Total Pembayaran:* Rp ${totalTagihan.toLocaleString("id-ID")}\n\n`;
      teksWA += `_Pesanan ini dikirim otomatis dari sistem website SS Seblak Prasmanan._`;

      const urlWhatsApp = `https://api.whatsapp.com/send?phone=${nomorWAAdmin}&text=${encodeURIComponent(teksWA)}`;
      window.open(urlWhatsApp, "_blank");
      showToast("Menghubungkan ke WhatsApp Toko... 📱");
    } else {
      showToast("Pesanan dikirim! Silakan tunggu di meja, koki sedang memasak 🍲🔥");
    }

    // Reset isi form pembeli secara instan
    const formKosong = { nama: "", whatsapp: "", kuah: "Seblak Kuah Nyemek", levelPedas: 3, tipeMakan: "Dine In", nomorMejaAlamat: "" };
    setCheckoutForm(formKosong);

    try {
      // 4. Proses penyimpanan data ke database Supabase berjalan tenang di latar belakang (Asynchronous Background Task)
      const { error } = await supabase.from("pesanan_seblak").insert([
        {
          nama_pemesan: checkoutForm.nama,
          varian_kuah: checkoutForm.kuah,
          level_pedas: checkoutForm.levelPedas,
          tipe_makan: checkoutForm.tipeMakan,
          lokasi_meja_alamat: checkoutForm.nomorMejaAlamat,
          rincian_mangkok: rincianTopping,
          total_bayar: totalTagihan,
        },
      ]);
      if (error) throw error;

      // Segarkan barisan antrean dapur admin secara real-time
      fetchOrders();
    } catch (err) {
      // Pemulihan darurat jika koneksi internet terputus total
      setCart(backupCart);
      showToast("Gagal mengirim data ke server dapur: " + err.message, "error");
    }
  }

  async function handleUpdateStatusOrder(id, nextStatus) {
    try {
      const { error } = await supabase.from("pesanan_seblak").update({ status_orderan: nextStatus }).eq("id", id);
      if (error) throw error;
      showToast(`Status pesanan updated ke: ${nextStatus}`);
      fetchOrders();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError("Email atau password admin salah!");
    } else {
      setUser(data.user);
      setView("admin");
      setEmail("");
      setPassword("");
      fetchOrders();
      showToast("Selamat Datang Kembali, Ratu! 👑");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setView("user");
    setIsEditing(false);
    showToast("Berhasil keluar dari mode admin");
  }

  function startEdit(item) {
    setIsEditing(true);
    setEditId(item.id);
    setNewItem({ nama_item: item.nama_item, kategori: item.kategori, harga: item.harga });
    setSelectedFile(null);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditId(null);
    setNewItem({ nama_item: "", kategori: "Topping", harga: "" });
    setSelectedFile(null);
  }

  async function handleSubmitItem(e) {
    e.preventDefault();
    setUploading(true);
    let finalImageUrl = null;
    try {
      if (selectedFile) {
        const filePath = `${Math.random()}.${selectedFile.name.split(".").pop()}`;
        const { error: uploadError } = await supabase.storage.from("foto-seblak").upload(filePath, selectedFile);
        if (uploadError) throw uploadError;
        finalImageUrl = supabase.storage.from("foto-seblak").getPublicUrl(filePath).data.publicUrl;

        // FITUR AUTO-CLEAN (SAAT EDIT): Jika sedang mengedit DAN mengunggah foto baru, hapus foto lama dari Storage
        if (isEditing) {
          const menuLama = menu.find((m) => m.id === editId);
          if (menuLama && menuLama.gambar_url) {
            // Mengambil nama file asli dari URL publik Supabase
            const namaFileLama = menuLama.gambar_url.split("/").pop();
            // Tembak hapus file fisik di Cloud Storage Supabase
            await supabase.storage.from("foto-seblak").remove([namaFileLama]);
          }
        }
      }

      if (isEditing) {
        const updateData = { nama_item: newItem.nama_item, kategori: newItem.kategori, harga: parseInt(newItem.harga) };
        if (finalImageUrl) updateData.gambar_url = finalImageUrl;
        await supabase.from("menu_seblak").update(updateData).eq("id", editId);
        showToast("Menu diperbarui & Foto lama dibersihkan! ✨");
        setIsEditing(false);
        setEditId(null);
      } else {
        await supabase.from("menu_seblak").insert([{ nama_item: newItem.nama_item, kategori: newItem.kategori, harga: parseInt(newItem.harga), gambar_url: finalImageUrl }]);
        showToast("Menu baru sukses disajikan!");
      }
      setNewItem({ nama_item: "", kategori: "Topping", harga: "" });
      setSelectedFile(null);
      fetchMenu();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploading(false);
    }
  }

  async function executeDeleteItem() {
    try {
      // Ambil info menu terlebih dahulu sebelum dihapus dari database
      const menuTarget = menu.find((m) => m.id === deleteModal.itemId);

      // 1. Hapus baris data di tabel database
      await supabase.from("menu_seblak").delete().eq("id", deleteModal.itemId);

      // 2. Jika menu tersebut punya foto, musnahkan juga filenya di Storage Cloud
      if (menuTarget && menuTarget.gambar_url) {
        const namaFileLama = menuTarget.gambar_url.split("/").pop();
        await supabase.storage.from("foto-seblak").remove([namaFileLama]);
      }

      showToast("Menu dan file gambar berhasil dihapus permanen!");
      if (editId === deleteModal.itemId) cancelEdit();
      fetchMenu();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleteModal({ show: false, itemId: null, itemName: "" });
    }
  }

  async function handleToggleStok(id, currentStatus) {
    await supabase.from("menu_seblak").update({ stok_tersedia: !currentStatus }).eq("id", id);
    fetchMenu();
  }

  // FITUR BARU: Mengubah status Rekomendasi Terlaris pilihan admin di database
  async function handleToggleTerlaris(id, currentStatus) {
    try {
      const { error } = await supabase.from("menu_seblak").update({ is_terlaris: !currentStatus }).eq("id", id);

      if (error) throw error;
      showToast("Status rekomendasi menu berhasil diperbarui! 👑");
      fetchMenu(); // Muat ulang data menu agar sinkron
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <div className="min-h-screen bg-amber-50/60 text-slate-800 font-sans flex flex-col justify-between overflow-x-hidden">
      <div>
        <Navbar view={view} setView={setView} user={user} totalItemsInCart={totalItemsInCart} setIsCartOpen={setIsCartOpen} />

        {view === "user" && (
          <CatalogUser
            menu={menu}
            loading={loading}
            cart={cart}
            addToCart={addToCart}
            decreaseQty={decreaseQty}
            removeInstantFromCart={removeInstantFromCart}
            calculateTotal={calculateTotal}
            totalItemsInCart={totalItemsInCart}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            handleCheckoutSubmit={handleCheckoutSubmit}
            checkoutForm={checkoutForm}
            setCheckoutForm={setCheckoutForm}
            daftarKuah={daftarKuah}
          />
        )}

        {view === "about" && <AboutUs setView={setView} />}

        {view === "login" && <LoginAdmin handleLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} loginError={loginError} setView={setView} />}

        {view === "admin" && (
          <DashboardAdmin
            handleLogout={handleLogout}
            user={user}
            isEditing={isEditing}
            editId={editId}
            newItem={newItem}
            setNewItem={setNewItem}
            handleSubmitItem={handleSubmitItem}
            uploading={uploading}
            setSelectedFile={setSelectedFile}
            startEdit={startEdit} /* <-- SEKARANG FUNGSI EDIT SUDAH MASUK LENGKAP */
            cancelEdit={cancelEdit}
            menu={menu}
            handleToggleStok={handleToggleStok}
            setDeleteModal={setDeleteModal}
            orders={orders}
            handleUpdateStatusOrder={handleUpdateStatusOrder}
            loadingOrders={loadingOrders}
            openConfirmModal={openConfirmModal}
            daftarKuah={daftarKuah}
            handleSaveEditPesanan={handleSaveEditPesanan}
            handleToggleTerlaris={handleToggleTerlaris}
          />
        )}
      </div>

      <footer className="bg-slate-800 text-slate-400 text-center py-4 border-t border-slate-700 text-xs font-medium">&copy; 2026 SS Seblak Prasmanan. All Rights Reserved. {/* <-- Nama Baru */}</footer>

      {/* CUSTOM MODAL CONFIRMATION */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-amber-100">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-3 ${confirmModal.actionType === "reset_omzet" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}>
              {confirmModal.actionType === "reset_omzet" ? <RotateCcw className="w-6 h-6" /> : <Trash2 className="w-6 h-6" />}
            </div>
            <h4 className="text-lg font-black text-slate-800">{confirmModal.title}</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{confirmModal.message}</p>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setConfirmModal((prev) => ({ ...prev, show: false }))} className="flex-1 bg-slate-100 text-slate-600 font-bold py-2.5 rounded-xl text-xs">
                Batal
              </button>
              <button type="button" onClick={executeConfirmedAction} className={`flex-1 text-white font-black py-2.5 rounded-xl text-xs shadow-sm ${confirmModal.actionType === "reset_omzet" ? "bg-emerald-600" : "bg-red-600"}`}>
                Eksekusi Aksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MENU MODAL */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-slate-800">Hapus Varian Menu?</h4>
            <p className="text-sm text-slate-500 mt-1">Yakin menghapus "{deleteModal.itemName}"?</p>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setDeleteModal({ show: false, itemId: null, itemName: "" })} className="flex-1 bg-slate-100 text-slate-600 font-bold py-2 rounded-xl text-sm">
                Batal
              </button>
              <button type="button" onClick={executeDeleteItem} className="flex-1 bg-red-600 text-white font-bold py-2 rounded-xl text-sm">
                Ya, Hapus!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST ALERTS */}
      {alertModal.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-11/12 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-center gap-2 text-xs font-bold animate-fade-in-down">
          {alertModal.type === "success" ? <Check className="text-emerald-400 w-4 h-4 flex-shrink-0" /> : <X className="text-red-400 w-4 h-4 flex-shrink-0" />}
          <span className="text-center">{alertModal.message}</span>
        </div>
      )}
    </div>
  );
}
