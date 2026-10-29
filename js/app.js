/* ============ UI HELPERS ============ */
function toggleCart(){
  document.getElementById("cartPanel").classList.toggle("show");
  document.getElementById("overlay").classList.toggle("show");
}
function closeAll(){
  document.getElementById("cartPanel").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
  document.getElementById("checkoutModal").classList.remove("show");
}
function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

/* ============ LOGIN, ADMIN, DISKON & VOUCHER ============ */
// Catatan: autentikasi ini hanya demo front-end. Jangan gunakan untuk data nyata.
const ADMIN_USER = "admin";
const ADMIN_PASS = "VildaAdmin123!";
let isAdmin = sessionStorage.getItem("vildaAdmin") === "yes";
let vouchers = [];
try {
  const storedVouchers = JSON.parse(localStorage.getItem("vildaVouchers") || "[]");
  vouchers = Array.isArray(storedVouchers) ? storedVouchers : [];
} catch (error) {
  console.warn("Data voucher tersimpan tidak valid; memulai dengan daftar voucher kosong.", error);
  localStorage.removeItem("vildaVouchers");
}
let activeVoucher = null;

function effectivePrice(p){
  const base = Number(p.price) || 0, val = Number(p.discountValue) || 0;
  if(p.discountType === "percent") return Math.max(0, Math.round(base * (1 - Math.min(100,val)/100)));
  if(p.discountType === "fixed") return Math.max(0, base - val);
  return base;
}
function voucherDiscount(subtotal){
  if(!activeVoucher || subtotal < Number(activeVoucher.min || 0)) return 0;
  if(activeVoucher.expiry && new Date(activeVoucher.expiry + "T23:59:59") < new Date()) return 0;
  const raw = activeVoucher.type === "percent" ? subtotal * Math.min(100, Number(activeVoucher.value))/100 : Number(activeVoucher.value);
  return Math.min(subtotal, Math.max(0, Math.round(raw)));
}
function applyVoucher(){
  const input = document.getElementById("voucherInput");
  const msg = document.getElementById("voucherMessage");
  if (!input || !msg) return;
  const code = input.value.trim().toUpperCase();
  const found = vouchers.find(v => v.code === code);
  const subtotal = cart.reduce((sum, item) => sum + effectivePrice(item) * item.qty, 0);
  if (!code) {
    activeVoucher = null;
    msg.textContent = "Masukkan kode voucher terlebih dahulu.";
    msg.style.color = "#c33";
  } else if (!found) {
    activeVoucher = null;
    msg.textContent = "Kode voucher tidak ditemukan.";
    msg.style.color = "#c33";
  } else if (found.expiry && new Date(found.expiry + "T23:59:59") < new Date()) {
    activeVoucher = null;
    msg.textContent = "Voucher sudah kedaluwarsa.";
    msg.style.color = "#c33";
  } else if (subtotal < Number(found.min || 0)) {
    activeVoucher = null;
    msg.textContent = "Belanja belum mencapai minimum voucher " + rp(Number(found.min || 0)) + ".";
    msg.style.color = "#c33";
  } else {
    activeVoucher = found;
    msg.textContent = "Voucher " + found.code + " berhasil digunakan.";
    msg.style.color = "#16845b";
  }
  updateCart();
}

function openLogin(){ document.getElementById("loginModal").classList.add("show"); }
function login(){
  const u=document.getElementById("loginUsername").value.trim();
  const p=document.getElementById("loginPassword").value;
  if(u!==ADMIN_USER || p!==ADMIN_PASS) return toast("Username atau password salah.");
  isAdmin=true; sessionStorage.setItem("vildaAdmin","yes");
  document.getElementById("loginModal").classList.remove("show");
  syncAdminUI(); toast("Login admin berhasil.");
}
function logout(){ isAdmin=false; sessionStorage.removeItem("vildaAdmin"); sessionStorage.removeItem("vildaUser"); window.location.href="index.html"; }
function syncAdminUI(){
  document.getElementById("loginLink").hidden=isAdmin;
  document.getElementById("adminLink").hidden=!isAdmin;
  document.getElementById("logoutLink").hidden=!isAdmin;
}
function openAdmin(){
  if(!isAdmin) return openLogin();
  document.getElementById("adminModal").classList.add("show");
  renderAdmin();
}
function saveProduct(){
  if(!isAdmin) return toast("Silakan login sebagai admin.");
  const name=document.getElementById("adminProductName").value.trim();
  const cat=document.getElementById("adminProductCat").value;
  const price=Number(document.getElementById("adminProductPrice").value);
  const emoji=document.getElementById("adminProductEmoji").value.trim()||"💄";
  const id=Number(document.getElementById("editProductId").value);
  const image=document.getElementById("adminProductImageData").value || (id ? (products.find(x=>x.id===id)?.image || "") : "");
  const discountType=document.getElementById("adminDiscountType").value;
  const discountValue=Number(document.getElementById("adminDiscountValue").value)||0;
  if(!name || !cat || !Number.isFinite(price) || price<=0) return toast("Isi nama, kategori, dan harga dengan benar.");
  if(discountValue<0 || (discountType==="percent" && discountValue>100)) return toast("Nilai diskon tidak valid.");
  if(id){ const p=products.find(x=>x.id===id); Object.assign(p,{name,cat,price,emoji,image,discountType,discountValue}); }
  else products.push({id:Math.max(0,...products.map(p=>p.id))+1,name,cat,price,emoji,image,bg:"#fdeef4",rating:5,discountType,discountValue});
  persistProducts(); resetProductForm(); renderCategories(); renderProducts(); renderAdmin(); toast("Produk berhasil disimpan.");
}
function persistProducts(){ localStorage.setItem("vildaProducts",JSON.stringify(products)); }
function resetProductForm(){
  ["editProductId","adminProductName","adminProductPrice","adminProductImageData"].forEach(id=>document.getElementById(id).value="");
  document.getElementById("adminProductEmoji").value="💄";
  document.getElementById("adminProductImage").value="";
  document.getElementById("adminImagePreview").innerHTML="Pratinjau foto produk";
  document.getElementById("productFormTitle").textContent="1. Tambah Produk & Atur Diskon";
  document.querySelector('#adminModal .buy-btn').textContent="Simpan Produk";
  document.getElementById("adminDiscountType").value="percent";
  document.getElementById("adminDiscountValue").value=0;
}
function editProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  document.getElementById("editProductId").value=p.id;
  document.getElementById("adminProductName").value=p.name;
  document.getElementById("adminProductCat").value=p.cat;
  document.getElementById("adminProductPrice").value=p.price;
  document.getElementById("adminProductEmoji").value=p.emoji||"💄";
  document.getElementById("adminProductImageData").value=p.image||"";
  document.getElementById("adminProductImage").value="";
  document.getElementById("adminImagePreview").innerHTML=p.image ? `<img src="${p.image}" alt="Pratinjau foto produk">` : "Pratinjau foto produk";
  document.getElementById("adminDiscountType").value=p.discountType||"percent";
  document.getElementById("adminDiscountValue").value=p.discountValue||0;
  document.getElementById("productFormTitle").textContent="✏️ Edit Produk: "+p.name;
  document.querySelector('#adminModal .buy-btn').textContent="Simpan Perubahan";
  document.getElementById("adminProductName").scrollIntoView({behavior:"smooth",block:"center"});
  toast("Mode edit aktif. Ubah data lalu klik Simpan Perubahan.");
}
function clearProductImage(){
  document.getElementById("adminProductImage").value="";
  document.getElementById("adminProductImageData").value="";
  document.getElementById("adminImagePreview").textContent="Tidak ada foto. Emoji produk akan digunakan.";
}
function handleProductImage(event){
  const file=event.target.files && event.target.files[0];
  if(!file) return;
  if(!["image/jpeg","image/png","image/webp"].includes(file.type)) { event.target.value=""; return toast("Pilih file JPG, PNG, atau WEBP."); }
  if(file.size>1024*1024) { event.target.value=""; return toast("Ukuran foto maksimal 1 MB agar penyimpanan browser tidak penuh."); }
  const reader=new FileReader();
  reader.onload=()=>{
    document.getElementById("adminProductImageData").value=String(reader.result||"");
    document.getElementById("adminImagePreview").innerHTML=`<img src="${reader.result}" alt="Pratinjau foto produk">`;
  };
  reader.onerror=()=>toast("Foto gagal dibaca. Coba pilih file lain.");
  reader.readAsDataURL(file);
}
function deleteProduct(id){
  if(!isAdmin || !confirm("Hapus produk ini?")) return;
  products.splice(products.findIndex(p=>p.id===id),1);
  cart=cart.filter(p=>p.id!==id); persistProducts(); updateCart(); renderProducts(); renderAdmin();
}
function saveVoucher(){
  if (!isAdmin) return toast("Silakan login sebagai admin.");
  const code = document.getElementById("adminVoucherCode").value.trim().toUpperCase();
  const type = document.getElementById("adminVoucherType").value;
  const value = Number(document.getElementById("adminVoucherValue").value);
  const min = Number(document.getElementById("adminVoucherMin").value || 0);
  const expiry = document.getElementById("adminVoucherExpiry").value;

  if (!/^[A-Z0-9_-]{3,20}$/.test(code)) return toast("Kode voucher harus 3–20 karakter: huruf, angka, _ atau -.");
  if (!Number.isFinite(value) || value <= 0 || (type === "percent" && value > 100)) return toast("Nilai diskon tidak valid. Persentase maksimal 100%.");
  if (!Number.isFinite(min) || min < 0) return toast("Minimum belanja tidak valid.");
  if (expiry && expiry < new Date().toISOString().slice(0, 10)) return toast("Tanggal kedaluwarsa tidak boleh di masa lalu.");

  // Kode yang sama diperbarui, bukan diduplikasi.
  vouchers = vouchers.filter(v => v.code !== code);
  vouchers.push({ code, type, value, min, expiry });
  localStorage.setItem("vildaVouchers", JSON.stringify(vouchers));
  document.getElementById("adminVoucherCode").value = "";
  document.getElementById("adminVoucherValue").value = "";
  document.getElementById("adminVoucherMin").value = "0";
  document.getElementById("adminVoucherExpiry").value = "";
  renderAdmin();
  toast("Voucher " + code + " berhasil disimpan.");
}

function deleteVoucher(code){
  if (!isAdmin) return toast("Silakan login sebagai admin.");
  vouchers=vouchers.filter(v=>v.code!==code); localStorage.setItem("vildaVouchers",JSON.stringify(vouchers));
  if(activeVoucher&&activeVoucher.code===code)activeVoucher=null;
  renderAdmin(); updateCart();
}
function renderAdmin(){
  const sel=document.getElementById("adminProductCat");
  sel.innerHTML=categories.map(c=>`<option value="${c}">${c}</option>`).join("");
  document.getElementById("adminProductList").innerHTML=products.map(p=>`<div class="admin-row"><span>${p.name}<br><small>${rp(p.price)} · Diskon ${p.discountValue||0}${p.discountType==="percent"?"%":" Rp"}</small></span><span><button onclick="editProduct(${p.id})">Edit</button> <button onclick="deleteProduct(${p.id})">Hapus</button></span></div>`).join("")||"Belum ada produk.";
  document.getElementById("adminVoucherList").innerHTML=vouchers.map(v=>`<div class="admin-row"><span><b>${v.code}</b><br><small>Diskon ${v.type==="percent"?v.value+"%":rp(v.value)} · Minimum ${rp(v.min)} ${v.expiry?"· berlaku sampai "+v.expiry:"· tanpa batas tanggal"}</small></span><button onclick="deleteVoucher('${v.code}')">Hapus</button></div>`).join("")||"Belum ada voucher. Buat voucher menggunakan formulir di atas.";
  syncAdminUI();
}
function closeAll(){
  document.getElementById("cartPanel").classList.remove("show");
  document.getElementById("overlay").classList.remove("show");
  document.getElementById("checkoutModal").classList.remove("show");
  document.getElementById("loginModal").classList.remove("show");
  document.getElementById("adminModal").classList.remove("show");
}
/* ============ INIT ============ */
if(sessionStorage.getItem("vildaAdmin") !== "yes" && !sessionStorage.getItem("vildaUser")){ window.location.replace("index.html"); }
// Muat produk tersimpan. Jika data tersimpan kosong/rusak, gunakan 12 produk bawaan.
try {
  const savedProducts = localStorage.getItem("vildaProducts");
  if (savedProducts) {
    const parsed = JSON.parse(savedProducts);
    if (Array.isArray(parsed) && parsed.length > 0) {
      products.splice(0, products.length, ...parsed);
    } else if (Array.isArray(parsed) && parsed.length === 0) {
      localStorage.removeItem("vildaProducts");
    }
  }
} catch (error) {
  console.warn("Data produk tersimpan tidak valid; memakai produk bawaan.", error);
  localStorage.removeItem("vildaProducts");
}

// Pastikan kategori dan produk dirender setelah semua elemen HTML tersedia.
function initializeShop() {
  const categoryContainer = document.getElementById("catGrid");
  const productContainer = document.getElementById("productGrid");
  if (!categoryContainer || !productContainer) return;
  const imageInput=document.getElementById("adminProductImage");
  if(imageInput) imageInput.addEventListener("change", handleProductImage);
  renderCategories();
  renderProducts();
  updateCart();
  syncAdminUI();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeShop, { once: true });
} else {
  initializeShop();
}
