// Datos de demostración sincronizados con data/catalogo.xml.
const fallbackProducts = [
  {
    id: "TEC-001",
    name: "Auriculares Nova Air",
    category: "Tecnología",
    seller: "AudioLab MX",
    price: 899,
    icon: "🎧",
    description: "Cancelación de ruido y batería de 30 horas.",
  },
  {
    id: "TEC-002",
    name: "Teclado mecánico Aura",
    category: "Tecnología",
    seller: "Pixel Store",
    price: 1249,
    icon: "⌨️",
    description: "Switches táctiles, iluminación RGB y conexión USB-C.",
  },
  {
    id: "HOG-001",
    name: "Lámpara Nórdica Luma",
    category: "Hogar",
    seller: "Casa Forma",
    price: 649,
    icon: "💡",
    description: "Lámpara de mesa con acabado de madera natural.",
  },
  {
    id: "ROP-001",
    name: "Sudadera Essential",
    category: "Ropa",
    seller: "Hilo Norte",
    price: 799,
    icon: "🧥",
    description: "Algodón suave, corte unisex y color verde bosque.",
  },
  {
    id: "VID-001",
    name: "Control inalámbrico Pulse",
    category: "Videojuegos",
    seller: "Game Hub",
    price: 1399,
    icon: "🎮",
    description: "Compatible con PC y consolas de nueva generación.",
  },
  {
    id: "LIB-001",
    name: "Diseño de sistemas",
    category: "Libros",
    seller: "Papel & Tinta",
    price: 420,
    icon: "📚",
    description: "Guía práctica de arquitectura y pensamiento digital.",
  },
  {
    id: "AUT-001",
    name: "Cámara Dash RoadView",
    category: "Automóviles",
    seller: "Ruta Segura",
    price: 1100,
    icon: "🚗",
    description: "Grabación Full HD, visión nocturna y sensor de impacto.",
  },
  {
    id: "HOG-002",
    name: "Set de café Terra",
    category: "Hogar",
    seller: "Casa Forma",
    price: 560,
    icon: "☕",
    description: "Cuatro tazas de cerámica artesanal.",
  },
];
let products = [...fallbackProducts];
let cart = JSON.parse(localStorage.getItem("nexo-cart") || "[]");
let activeCategory = "Todas";
const money = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    n,
  );
function render() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(
    (p) =>
      (activeCategory === "Todas" || p.category === activeCategory) &&
      [p.name, p.category, p.seller].join(" ").toLowerCase().includes(query),
  );
  document.getElementById("resultCount").textContent =
    `${filtered.length} productos`;
  document.getElementById("productGrid").innerHTML = filtered.length
    ? filtered
        .map(
          (p) =>
            `<article class="product"><div class="product-image">${p.icon}</div><div class="product-body"><span class="tag">${p.category}</span><h3>${p.name}</h3><span class="seller">Vendido por ${p.seller}</span><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" data-id="${p.id}">Agregar</button></div></div></article>`,
        )
        .join("")
    : '<p class="empty">No encontramos productos con esos criterios.</p>';
  document
    .querySelectorAll(".add")
    .forEach((b) => (b.onclick = () => add(b.dataset.id)));
  renderCart();
}
function add(id) {
  cart.push(id);
  save();
  toast("Producto agregado al carrito");
}
function save() {
  localStorage.setItem("nexo-cart", JSON.stringify(cart));
  renderCart();
}
function renderCart() {
  const items = cart
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);
  document.getElementById("cartCount").textContent = items.length;
  document.getElementById("cartItems").innerHTML = items.length
    ? items
        .map(
          (p, i) =>
            `<div class="cart-item"><span class="cart-item-icon">${p.icon}</span><div><h4>${p.name}</h4><small>${money(p.price)} · <button onclick="removeItem(${i})">Quitar</button></small></div></div>`,
        )
        .join("")
    : '<p class="empty">Tu carrito está vacío.</p>';
  document.getElementById("cartTotal").textContent = money(
    items.reduce((s, p) => s + p.price, 0),
  );
}
function removeItem(i) {
  cart.splice(i, 1);
  save();
}
function toast(message) {
  const t = document.getElementById("toast");
  t.textContent = message;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}
function saveProducts() {
  render();
}
async function loadCatalog() {
  try {
    const response = await fetch("/api/catalogo");
    if (!response.ok) throw new Error("No se pudo leer el catálogo XML");
    const xml = new DOMParser().parseFromString(await response.text(), "application/xml");
    const categoryNames = Object.fromEntries([...xml.querySelectorAll("categorias > categoria")].map((node) => [node.getAttribute("id"), node.textContent]));
    products = [...xml.querySelectorAll("productos > producto")].map((node) => ({
      id: node.getAttribute("id"),
      name: node.querySelector("nombre").textContent,
      category: categoryNames[node.getAttribute("categoria")] || node.getAttribute("categoria"),
      seller: node.querySelector("vendedor").textContent,
      price: Number(node.querySelector("precio").textContent),
      icon: node.getAttribute("icono") || "📦",
      description: node.querySelector("descripcion").textContent,
    }));
    render();
    toast("Catálogo XML cargado y validado");
  } catch (error) {
    render();
    toast("Modo demostración: inicia el servidor XML para conectar los archivos");
  }
}
async function persistProduct(action, product) {
  const response = await fetch("/api/productos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, product }) });
  if (!response.ok) throw new Error(await response.text());
  await loadCatalog();
}
function openRolePanel() {
  const role = document.getElementById("roleSelect").value;
  const panel = document.getElementById("rolePanel");
  const content = document.getElementById("roleContent");
  panel.hidden = false;
  document.getElementById("roleTitle").textContent = `Panel del ${role}`;
  if (role === "vendedor") {
    content.innerHTML = `<div class="panel-grid"><div class="panel-card"><h3>Publicar producto</h3><form id="productForm" class="panel-form"><input name="name" placeholder="Nombre del producto" required><select name="category"><option>Tecnología</option><option>Hogar</option><option>Ropa</option><option>Videojuegos</option><option>Libros</option><option>Automóviles</option></select><input name="price" type="number" min="1" placeholder="Precio MXN" required><input name="seller" placeholder="Nombre de la tienda" required><input name="icon" placeholder="Emoji representativo" value="📦"><input name="description" placeholder="Descripción" required><button type="submit">Publicar producto</button></form></div><div class="panel-card"><h3>Mis productos</h3><div id="sellerProducts"></div></div></div>`;
    renderSellerProducts();
    document.getElementById("productForm").onsubmit = async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target));
      const product = { id: `USR-${Date.now()}`, name: data.name, category: data.category, seller: data.seller, price: Number(data.price), icon: data.icon || "📦", description: data.description };
      await persistProduct("crear", product);
      event.target.reset();
      renderSellerProducts();
      toast("Producto publicado");
    };
  } else if (role === "administrador") {
    const orders = JSON.parse(localStorage.getItem("ultimo-pedido") || "null");
    content.innerHTML = `<div class="panel-grid"><div class="panel-card"><h3>Resumen del sistema</h3><p><strong>${products.length}</strong> productos registrados</p><p><strong>3</strong> tipos de usuario</p><p><strong>${orders ? 1 : 0}</strong> pedido local registrado</p></div><div class="panel-card"><h3>Usuarios del sistema</h3><p>COM-001 · Comprador</p><p>VEN-001 · Vendedor</p><p>ADM-001 · Administrador</p></div></div>`;
  } else {
    const order = JSON.parse(localStorage.getItem("ultimo-pedido") || "null");
    content.innerHTML = `<div class="panel-card"><h3>Perfil del comprador</h3><p>Consulta el catálogo, agrega productos y genera pedidos XML.</p><p>${order ? `Último pedido: <strong>${order.id}</strong> · ${money(order.total)}` : "Todavía no has generado pedidos."}</p></div>`;
  }
  panel.scrollIntoView({ behavior: "smooth" });
}
function renderSellerProducts() {
  const target = document.getElementById("sellerProducts");
  if (!target) return;
  const sellerProducts = products.filter((p) => p.id.startsWith("USR-") || ["AudioLab MX", "Pixel Store", "Casa Forma", "Hilo Norte", "Game Hub", "Papel & Tinta", "Ruta Segura"].includes(p.seller));
  target.innerHTML = sellerProducts.map((p) => `<div class="seller-row"><div><strong>${p.name}</strong><small>${money(p.price)} · ${p.category}</small></div><div><button class="panel-action" data-edit="${p.id}">Editar</button> <button class="panel-action danger" data-delete="${p.id}">Eliminar</button></div></div>`).join("") || '<p class="muted">Aún no hay productos publicados.</p>';
  target.querySelectorAll("[data-delete]").forEach((button) => button.onclick = async () => { const product = products.find((p) => p.id === button.dataset.delete); if (confirm("¿Eliminar este producto?")) { await persistProduct("eliminar", product); renderSellerProducts(); toast("Producto eliminado del XML"); } });
  target.querySelectorAll("[data-edit]").forEach((button) => button.onclick = async () => { const product = products.find((p) => p.id === button.dataset.edit); const name = prompt("Nombre del producto", product.name); const price = prompt("Precio MXN", product.price); if (name && price) { const updated = { ...product, name, price: Number(price) }; await persistProduct("editar", updated); renderSellerProducts(); toast("Producto actualizado en XML"); } });
}
document.getElementById("searchInput").oninput = render;
document.getElementById("searchButton").onclick = () =>
  document.getElementById("catalogo").scrollIntoView();
document.querySelectorAll(".category").forEach(
  (b) =>
    (b.onclick = () => {
      activeCategory = b.dataset.category;
      document
        .querySelectorAll(".category")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      render();
    }),
);
document.getElementById("cartButton").onclick = () =>
  document.getElementById("cartPanel").classList.add("open");
document.getElementById("closeCart").onclick = () =>
  document.getElementById("cartPanel").classList.remove("open");
document.getElementById("rolePanelButton").onclick = openRolePanel;
document.getElementById("closeRolePanel").onclick = () => { document.getElementById("rolePanel").hidden = true; };
document.getElementById("checkoutButton").onclick = async () => {
  if (!cart.length) return toast("Agrega al menos un producto");
  const orderId = "PED-" + Date.now(),
    items = cart.map((id) => products.find((p) => p.id === id)),
    total = items.reduce((s, p) => s + p.price, 0);
  const order = {
    id: orderId,
    date: new Date().toISOString(),
    items,
    status: "Pendiente",
    total,
  };
  localStorage.setItem("ultimo-pedido", JSON.stringify(order));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<pedido id="${orderId}" fecha="${order.date.slice(0, 10)}" estado="Pendiente">\n  <comprador id="COM-001"><nombre>Comprador de demostración</nombre></comprador>\n  <items>\n${items.map((p) => `    <item producto="${p.id}" cantidad="1" precio="${p.price}"/>`).join("\n")}\n  </items>\n  <total moneda="MXN">${total}</total>\n</pedido>`;
  try {
    const response = await fetch("/api/pedidos", { method: "POST", headers: { "Content-Type": "application/xml" }, body: xml });
    if (!response.ok) throw new Error(await response.text());
  } catch (error) {
    const blob = new Blob([xml], { type: "application/xml" }), link = document.createElement("a");
    link.href = URL.createObjectURL(blob); link.download = `${orderId}.xml`; link.click(); URL.revokeObjectURL(link.href);
  }
  cart = [];
  save();
  toast("Pedido XML generado y descargado");
};
loadCatalog();
