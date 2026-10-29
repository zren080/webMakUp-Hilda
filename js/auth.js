const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "VildaAdmin123!";
const USERS_KEY = "vildaUsers";

// Jika sudah login, langsung masuk ke halaman belanja.
if (sessionStorage.getItem("vildaAdmin") === "yes" || sessionStorage.getItem("vildaUser")) {
  window.location.replace("shop.html");
}

function showForm(mode) {
  const isLogin = mode === "login";
  document.getElementById("loginForm").hidden = !isLogin;
  document.getElementById("registerForm").hidden = isLogin;
  document.getElementById("loginTab").classList.toggle("active", isLogin);
  document.getElementById("registerTab").classList.toggle("active", !isLogin);
}
function getUsers() {
  try { const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); return Array.isArray(users) ? users : []; }
  catch { return []; }
}
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem("vildaAdmin", "yes");
    sessionStorage.removeItem("vildaUser");
    window.location.href = "shop.html";
    return;
  }
  const user = getUsers().find(item => item.username.toLowerCase() === username.toLowerCase() && item.password === password);
  if (!user) { error.textContent = "Username atau password salah. Periksa kembali atau buat akun baru."; return; }
  sessionStorage.setItem("vildaUser", JSON.stringify({ username: user.username, name: user.name, role: "customer" }));
  sessionStorage.removeItem("vildaAdmin");
  window.location.href = "shop.html";
});
document.getElementById("registerForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("registerName").value.trim();
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value;
  const error = document.getElementById("registerError");
  const users = getUsers();
  if (username.toLowerCase() === ADMIN_USERNAME || users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
    error.textContent = "Username sudah digunakan. Silakan pilih username lain."; return;
  }
  if (!name || username.length < 3 || password.length < 6) { error.textContent = "Lengkapi data. Username minimal 3 dan password minimal 6 karakter."; return; }
  users.push({ name, username, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  sessionStorage.setItem("vildaUser", JSON.stringify({ username, name, role: "customer" }));
  window.location.href = "shop.html";
});
