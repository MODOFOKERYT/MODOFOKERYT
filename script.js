const products = [
  {id:1,name:"Pack de plantillas premium",category:"Plantillas",price:9.99,description:"Plantillas editables para impulsar tus proyectos.",symbol:"▤",label:"MÁS VENDIDO"},
  {id:2,name:"Kit de recursos para diseño",category:"Diseño",price:12.50,description:"Elementos creativos para tus próximos diseños.",symbol:"◈",label:"DESTACADO"},
  {id:3,name:"Guía digital para principiantes",category:"Educación",price:7.00,description:"Material práctico para aprender paso a paso.",symbol:"⌘",label:"NUEVO"},
  {id:4,name:"Herramientas para productividad",category:"Herramientas",price:14.99,description:"Organiza tareas y mejora tu flujo de trabajo.",symbol:"⚙",label:"PREMIUM"},
  {id:5,name:"Pack de banners para redes",category:"Diseño",price:8.50,description:"Diseños listos para personalizar y publicar.",symbol:"✦",label:"POPULAR"},
  {id:6,name:"Agenda digital editable",category:"Plantillas",price:5.99,description:"Planifica tus metas, proyectos y actividades.",symbol:"▦",label:"OFERTA"},
  {id:7,name:"Mini curso de creatividad",category:"Educación",price:19.00,description:"Ideas y ejercicios para desarrollar habilidades.",symbol:"✧",label:"CURSO"},
  {id:8,name:"Kit de organización digital",category:"Herramientas",price:11.00,description:"Recursos para mantener tus archivos organizados.",symbol:"▣",label:"RECOMENDADO"}
];
let activeCategory = "Todos";
let cart = [];
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const toast = document.getElementById("toast");
let toastTimer;
const money = n => "US$" + n.toFixed(2);

function renderProducts(){
  let list = products.filter(p => (activeCategory === "Todos" || p.category === activeCategory) &&
    (p.name + " " + p.description + " " + p.category).toLowerCase().includes(searchInput.value.toLowerCase()));
  if(sortSelect.value === "low") list.sort((a,b)=>a.price-b.price);
  if(sortSelect.value === "high") list.sort((a,b)=>b.price-a.price);
  grid.innerHTML = list.length ? list.map(p => `
    <article class="product-card">
      <div class="product-art"><span class="art-label">${p.label}</span><span class="art-symbol">${p.symbol}</span></div>
      <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><p>${p.description}</p>
      <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">+ Añadir</button></div></div>
    </article>`).join("") : '<div class="empty-results">No encontramos productos con esa búsqueda.</div>';
}
function showToast(message){
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove("show"),2400);
}
function renderCart(){
  document.getElementById("cartCount").textContent = cart.reduce((n,item)=>n+item.qty,0);
  const container = document.getElementById("cartItems");
  if(!cart.length){container.innerHTML='<p class="empty-cart">Tu carrito está vacío.</p>';}
  else {container.innerHTML=cart.map(item=>`<div class="cart-item"><div><strong>${item.name}</strong><small>${item.qty} × ${money(item.price)}</small></div><div><strong>${money(item.price*item.qty)}</strong><button class="remove-item" data-remove="${item.id}">Quitar</button></div></div>`).join("");}
  document.getElementById("cartTotal").textContent = money(cart.reduce((n,item)=>n+item.price*item.qty,0));
}
grid.addEventListener("click",e=>{
  const btn=e.target.closest("[data-add]"); if(!btn)return;
  const product=products.find(p=>p.id===Number(btn.dataset.add));
  const existing=cart.find(p=>p.id===product.id);
  if(existing)existing.qty++;else cart.push({...product,qty:1});
  renderCart(); showToast("Añadido al carrito: "+product.name);
});
document.getElementById("cartItems").addEventListener("click",e=>{
  const btn=e.target.closest("[data-remove]");if(!btn)return;
  cart=cart.filter(p=>p.id!==Number(btn.dataset.remove));renderCart();
});
document.querySelectorAll(".category-card").forEach(btn=>btn.addEventListener("click",()=>{
  activeCategory=btn.dataset.category;
  document.querySelectorAll(".category-card").forEach(b=>b.classList.toggle("selected",b===btn));
  renderProducts();document.getElementById("tienda").scrollIntoView({behavior:"smooth"});
}));
searchInput.addEventListener("input",renderProducts);
sortSelect.addEventListener("change",renderProducts);
document.getElementById("searchButton").addEventListener("click",()=>{document.getElementById("tienda").scrollIntoView({behavior:"smooth"});searchInput.focus();});
const panel=document.getElementById("cartPanel"),overlay=document.getElementById("overlay");
function openCart(){panel.classList.add("open");overlay.classList.add("show");panel.setAttribute("aria-hidden","false");}
function closeCart(){panel.classList.remove("open");overlay.classList.remove("show");panel.setAttribute("aria-hidden","true");}
document.getElementById("cartButton").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("checkoutButton").addEventListener("click",()=>{
  if(!cart.length){showToast("Añade un producto antes de continuar.");return;}
  showToast("Demo: conecta una pasarela de pago para activar las compras.");
});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
