/* ============ CART ============ */
function addToCart(id){
  const item = cart.find(i => i.id === id);
  if(item) item.qty++;
  else cart.push({...products.find(p => p.id === id), qty:1});
  updateCart(); toast("✅ Produk ditambahkan ke keranjang!");
}
function changeQty(id, d){
  const item = cart.find(i => i.id === id);
  item.qty += d;
  if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCart();
}
function removeItem(id){ cart = cart.filter(i => i.id !== id); updateCart(); }

function updateCart(){
  const count = cart.reduce((s,i) => s + i.qty, 0);
  document.getElementById("cartBadge").textContent = count;
  document.getElementById("cartItems").innerHTML = cart.length ? cart.map(i => `
    <div class="cart-item">
      <div class="thumb" style="background:${i.bg}">${i.emoji}</div>
      <div style="flex:1">
        <h4>${i.name}</h4>
        <small style="color:var(--gold);font-weight:700">${rp(effectivePrice(i))}</small>
      </div>
      <div class="qty">
        <button onclick="changeQty(${i.id},-1)">−</button><span>${i.qty}</span>
        <button onclick="changeQty(${i.id},1)">+</button>
      </div>
      <button class="del" onclick="removeItem(${i.id})">🗑️</button>
    </div>`).join("")
    : `<p style="text-align:center;color:#a07b8b;padding:40px 10px">Keranjang masih kosong 🛒</p>`;
  const subtotal = cart.reduce((s,i) => s + effectivePrice(i) * i.qty, 0);
  document.getElementById("cartTotal").textContent = rp(Math.max(0, subtotal - voucherDiscount(subtotal)));
}

/* ============ CHECKOUT ============ */
function openCheckout(){
  if(!cart.length) return toast("⚠️ Keranjang masih kosong!");
  const total = cart.reduce((s,i) => s + effectivePrice(i) * i.qty, 0);
  const ongkir = 10000;
  document.getElementById("orderSummary").innerHTML =
    cart.map(i => `<div><span>${i.name} ×${i.qty}</span><span>${rp(effectivePrice(i)*i.qty)}</span></div>`).join("")
    + `<hr><div><span>Diskon voucher</span><span>-${rp(voucherDiscount(total))}</span></div><div><span>Ongkos Kirim</span><span>${rp(ongkir)}</span></div>
       <div style="font-weight:800;color:var(--pink-dark)"><span>TOTAL</span><span>${rp(Math.max(0,total-voucherDiscount(total))+ongkir)}</span></div>`;
  document.getElementById("checkoutModal").classList.add("show");
}

function placeOrder(){
  const name = document.getElementById("coName").value.trim();
  const phone = document.getElementById("coPhone").value.trim();
  const addr = document.getElementById("coAddr").value.trim();
  const pay = document.querySelector('input[name="pay"]:checked').value;
  // Validasi form sederhana
  if(!name || !phone || !addr) return toast("⚠️ Lengkapi semua data pengiriman!");
  if(!/^[0-9+\-\s]{9,}$/.test(phone)) return toast("⚠️ Nomor telepon tidak valid!");
  const subtotal = cart.reduce((s,i) => s + effectivePrice(i)*i.qty, 0);
  const total = Math.max(0, subtotal - voucherDiscount(subtotal)) + 10000;
  document.getElementById("checkoutModal").classList.remove("show");
  closeAll();
  cart = []; updateCart(); renderProducts();
  alert(`🎉 TERIMA KASIH, ${name}!\n\nPesanan berhasil dibuat.\nMetode: ${pay}\nTotal: ${rp(total)}\n\nPesanan akan dikirim ke:\n${addr}`);
}

