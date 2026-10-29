/* Format rupiah tersedia dari data.js melalui fungsi rp(). */
/* ============ RENDER KATEGORI ============ */
function renderCategories(){
  const container = document.getElementById("catGrid");
  if (!container) return;
  container.innerHTML =
    ["Semua",...categories].map(c =>
      `<div class="cat-card ${c===activeCat?'active':''}" onclick="pickCat('${c}')">
         <span class="icon">${catIcon(c)}</span><b>${c}</b>
       </div>`).join("");
}
const catIcon = c => ({
  "Semua":"🛍️","Lipstik":"💄","Foundation":"🧴","Eyeshadow":"🎨",
  "Blush On":"🌸","Mascara":"✨","Skincare":"💧","Kuas Makeup":"🖌️"
})[c];

function pickCat(c){ activeCat = c; renderCategories(); renderProducts(); }

/* ============ RENDER PRODUK + SEARCH ============ */
function renderProducts(){
  const searchInput = document.getElementById("searchInput");
  const productContainer = document.getElementById("productGrid");
  if (!productContainer) return;
  const q = (searchInput?.value || "").trim().toLowerCase();
  const safeProducts = Array.isArray(products) ? products.filter(p => p && typeof p.name === "string" && typeof p.cat === "string") : [];
  const list = safeProducts.filter(p =>
    (activeCat === "Semua" || p.cat === activeCat) &&
    (p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q))
  );
  const resultInfo = document.getElementById("resultInfo");
  if (resultInfo) resultInfo.textContent =
    list.length ? `Menampilkan ${list.length} produk` : "Produk belum tersedia";
  productContainer.innerHTML = list.length ? list.map(p => `
    <div class="card">
      <div class="img" style="background:${p.bg}">${p.image ? `<img src="${p.image}" alt="${p.name}">` : p.emoji}</div>
      <div class="card-body">
        <span class="cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <div class="rating">⭐ ${p.rating}</div>
        <div class="price">${p.discountValue>0 ? `<del style="color:#999;font-size:.8rem">${rp(p.price)}</del> ` : ""}${rp(effectivePrice(p))}${p.discountValue>0 ? `<small style="color:#c94f82"> Diskon</small>` : ""}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">+ Keranjang</button>
      </div>
    </div>`).join("")
    : `<p class="empty-msg">😅 Produk "<b>${q}</b>" tidak ditemukan.</p>`;
}

