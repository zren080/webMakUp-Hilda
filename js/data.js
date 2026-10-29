/* ============ DATA (JavaScript — 25% nilai) ============ */

// 7 KATEGORI (minimal 5 ✓)
const categories = ["Lipstik","Foundation","Eyeshadow","Blush On","Mascara","Skincare","Kuas Makeup"];

// 12 PRODUK (minimal 10 ✓)
const products = [
  {id:1, name:"Matte Lipstick — Rose Velvet",   cat:"Lipstik",    price:89000,  rating:4.8, emoji:"💄", bg:"#f9c5d5"},
  {id:2, name:"Liquid Lipstick — Ruby Crush",   cat:"Lipstik",    price:105000, rating:4.9, emoji:"💋", bg:"#f7a8b8"},
  {id:3, name:"Foundation Stick — Ivory Glow",   cat:"Foundation", price:159000, rating:4.7, emoji:"🧴", bg:"#fbe0cf"},
  {id:4, name:"Cushion Foundation — Beige",      cat:"Foundation", price:189000, rating:4.8, emoji:"(powder)", bg:"#f5d9c8"},
  {id:5, name:"Eyeshadow Palette — Sunset",     cat:"Eyeshadow",  price:219000, rating:5.0, emoji:"🎨", bg:"#e8c3d9"},
  {id:6, name:"Eyeshadow Palette — Nude Chic",  cat:"Eyeshadow",  price:199000, rating:4.6, emoji:"👁️", bg:"#edd8c8"},
  {id:7, name:"Blush On — Peach Blossom",       cat:"Blush On",   price:75000,  rating:4.7, emoji:"🌸", bg:"#ffd4c4"},
  {id:8, name:"Powder Blush — Rosy Cheeks",     cat:"Blush On",   price:85000,  rating:4.5, emoji:"🌷", bg:"#ffcfd8"},
  {id:9, name:"Mascara Waterproof — Volume+",   cat:"Mascara",    price:95000,  rating:4.8, emoji:"✨", bg:"#d9c8e8"},
  {id:10,name:"Kuas Makeup Set — 12 pcs",        cat:"Kuas Makeup",price:249000, rating:4.9, emoji:"🖌️", bg:"#e8dcc8"},
  {id:11,name:"Serum Vitamin C — Glow Booster",  cat:"Skincare",   price:129000, rating:4.9, emoji:"🍊", bg:"#ffe3c2"},
  {id:12,name:"Makeup Remover — Gentle Clean",   cat:"Skincare",   price:69000,  rating:4.6, emoji:"💧", bg:"#cfe4f5"}
];
// ganti emoji produk 4 agar rapi:
products[3].emoji = "🪞";

let cart = [];
let activeCat = "Semua";


const rp = n => "Rp " + Number(n).toLocaleString("id-ID");
