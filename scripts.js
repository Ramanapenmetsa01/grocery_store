let cart = [];
let wishlist = [];

const cartBtn = document.getElementById("cart-btn");
const wishlistBtn = document.getElementById("wishlist-btn");
const cartEl = document.getElementById("cart");
const wishlistEl = document.getElementById("wishlist");
const cartItemsEl = document.getElementById("cart-items");
const wishlistItemsEl = document.getElementById("wishlist-items");
const cartCountEl = document.getElementById("cart-count");
const wishlistCountEl = document.getElementById("wishlist-count");
const cartTotalEl = document.getElementById("cart-total");
const closeCartBtn = document.getElementById("close-cart");
const closeWishlistBtn = document.getElementById("close-wishlist");
const checkoutBtn = document.getElementById("checkout-btn");
const searchInput = document.getElementById("search-input");

const checkoutModal = document.getElementById("checkout-modal");
const closeModalBtn = document.getElementById("close-modal");
const modalTotalEl = document.getElementById("modal-total");
const confirmPurchaseBtn = document.getElementById("confirm-purchase");
function updateCartDisplay() {
  cartItemsEl.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.textContent = `${item.name} x${item.quantity} `;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => {
      cart = cart.filter(cItem => cItem.id !== item.id);
      updateCartDisplay();
    });
    li.appendChild(removeBtn);
    cartItemsEl.appendChild(li);
  });
  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotalEl.textContent = total.toFixed(2);
}
function updateWishlistDisplay() {
  wishlistItemsEl.innerHTML = "";
  wishlist.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.name + " ";
    const addToCartBtn = document.createElement("button");
    addToCartBtn.textContent = "Add to Cart";
    addToCartBtn.addEventListener("click", () => {
      wishlist = wishlist.filter(wItem => wItem.id !== item.id);
      const existingCartItem = cart.find(cItem => cItem.id === item.id);
      if (existingCartItem) {
        existingCartItem.quantity++;
      } else {
        cart.push({ ...item, quantity: 1 });
      }
      updateWishlistDisplay();
      updateCartDisplay();
    });
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => {
      wishlist = wishlist.filter(wItem => wItem.id !== item.id);
      updateWishlistDisplay();
      document.querySelectorAll(".wishlist-icon").forEach(icon => {
        if (icon.getAttribute("data-id") === String(item.id)) {
          icon.classList.remove("active");
        }
      });
    });
    li.appendChild(addToCartBtn);
    li.appendChild(removeBtn);
    wishlistItemsEl.appendChild(li);
  });
  wishlistCountEl.textContent = wishlist.length;
}
function addToCart(product, productImg) {
  const existingItem = cart.find(cItem => cItem.id === product.id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartDisplay();
  animateFlyToCart(productImg);
}
function toggleWishlist(product, icon) {
  const existsInWishlist = wishlist.find(wItem => wItem.id === product.id);
  if (existsInWishlist) {
    wishlist = wishlist.filter(wItem => wItem.id !== product.id);
    icon.classList.remove("active");
  } else {
    wishlist.push(product);
    icon.classList.add("active");
  }
  updateWishlistDisplay();
}
function animateFlyToCart(productImg) {
  const clone = productImg.cloneNode(true);
  clone.classList.add("flying-image");
  document.body.appendChild(clone);
  const imgRect = productImg.getBoundingClientRect();
  clone.style.left = imgRect.left + "px";
  clone.style.top = imgRect.top + "px";
  clone.style.width = imgRect.width + "px";
  clone.offsetWidth;
  clone.style.transition = "transform 0.2s ease-out";
  clone.style.transform = "scale(1.1)";
  setTimeout(() => {
    const cartRect = cartBtn.getBoundingClientRect();
    const targetLeft = cartRect.left + cartRect.width / 2 - imgRect.width / 2;
    const targetTop = cartRect.top + cartRect.height / 2 - imgRect.height / 2;
    clone.style.transition = "all 0.8s ease-in-out";
    clone.style.left = targetLeft + "px";
    clone.style.top = targetTop + "px";
    clone.style.transform = "scale(0.3)";
    clone.style.opacity = "0.5";
  }, 200);
  setTimeout(() => {
    clone.remove();
  }, 1000);
}
function filterProducts() {
  const query = searchInput.value.toLowerCase();
  document.querySelectorAll(".product").forEach(product => {
    const name = product.getAttribute("data-name").toLowerCase();
    product.style.display = name.includes(query) ? "block" : "none";
  });
}
function showCheckoutModal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  modalTotalEl.textContent = total.toFixed(2);
  checkoutModal.style.display = "block";
}
function hideCheckoutModal() {
  checkoutModal.style.display = "none";
}
document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay();
  updateWishlistDisplay();
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      const productEl = e.target.closest(".product");
      const product = {
        id: productEl.getAttribute("data-id"),
        name: productEl.getAttribute("data-name"),
        price: parseFloat(productEl.getAttribute("data-price"))
      };
      const productImg = productEl.querySelector("img");
      addToCart(product, productImg);
    });
  });
  document.querySelectorAll(".wishlist-icon").forEach(icon => {
    icon.addEventListener("click", e => {
      const productEl = e.target.closest(".product");
      const product = {
        id: productEl.getAttribute("data-id"),
        name: productEl.getAttribute("data-name"),
        price: parseFloat(productEl.getAttribute("data-price"))
      };
      toggleWishlist(product, e.target);
    });
  });
  cartBtn.addEventListener("click", () => {
    wishlistEl.classList.remove("visible");
    cartEl.classList.toggle("visible");
  });
  wishlistBtn.addEventListener("click", () => {
    cartEl.classList.remove("visible");
    wishlistEl.classList.toggle("visible");
  });

  closeCartBtn.addEventListener("click", () => {
    cartEl.classList.remove("visible");
  });
  closeWishlistBtn.addEventListener("click", () => {
    wishlistEl.classList.remove("visible");
  });
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    showCheckoutModal();
  });

  closeModalBtn.addEventListener("click", hideCheckoutModal);
  confirmPurchaseBtn.addEventListener("click", () => {
    hideCheckoutModal();
    cart = [];
    updateCartDisplay();
    cartEl.classList.remove("visible");
  });
  searchInput.addEventListener("input", filterProducts);
});
