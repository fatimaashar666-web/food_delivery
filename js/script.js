// script.js

// ---- Menu Data (6+ items) ----
const menuItems = [
  { id: 1, name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 12.99, emoji: '🍕' },
  { id: 2, name: 'Double Cheeseburger', description: 'Beef patty, cheddar, lettuce', price: 15.49, emoji: '🍔' },
  { id: 3, name: 'Crispy Chicken', description: 'Fried chicken, spicy mayo', price: 13.75, emoji: '🍗' },
  { id: 4, name: 'Veggie Sushi', description: 'Avocado, cucumber, carrot', price: 10.25, emoji: '🍣' },
  { id: 5, name: 'Pasta Alfredo', description: 'Creamy garlic parmesan', price: 11.90, emoji: '🍝' },
  { id: 6, name: 'Chocolate Shake', description: 'Rich cocoa, whipped cream', price: 5.99, emoji: '🥤' },
  { id: 7, name: 'Caesar Salad', description: 'Romaine, croutons, parmesan', price: 8.50, emoji: '🥗' },
  { id: 8, name: 'Chicken Sandwich', description: 'Shredded chicken, Mayonnaise, Black Pepper', price: 6.50, emoji: '🥪' },
  { id: 9, name: 'Chicken Corn Soup', description:'Corn, Chicken', price: 56.23, emoji: '🍲' },
  { id: 10, name: 'Chocolate Donut', description:'Chocolate, Sprinkles', price: 5.23, emoji: '🍩' }
];

// ---- Cart State ----
let cart = []; // each item: { id, name, price, quantity, emoji }

// ---- DOM Elements ----
const menuGrid = document.getElementById('menuGrid');
const cartCountEl = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const totalPriceEl = document.getElementById('totalPrice');
const cartTotalBadge = document.getElementById('cartTotalBadge');
const emptyCartMsg = document.getElementById('emptyCartMsg');
const checkoutForm = document.getElementById('checkoutForm');
const toast = document.getElementById('toast');

// ---- Helper Functions ----
function formatPrice(price) {
  return price.toFixed(2);
}

// Update cart count (header + badge)
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;
  if (cartTotalBadge) {
    cartTotalBadge.textContent = totalItems === 0 ? '0 items' : `${totalItems} item${totalItems > 1 ? 's' : ''}`;
  }
}

// Calculate total price
function calculateTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Render cart items in the cart section
function renderCart() {
  // Clear container but keep empty message logic
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    // Show empty message
    cartItemsEl.innerHTML = '<p class="empty-cart-msg" id="emptyCartMsg">Your cart is empty. Add some delicious food!</p>';
    totalPriceEl.textContent = '0.00';
    updateCartCount();
    return;
  }

  // Populate cart items
  cart.forEach(cartItem => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    itemDiv.dataset.id = cartItem.id;

    // Item info (name + price)
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('item-info');
    infoDiv.innerHTML = `
      <span class="item-name">${cartItem.emoji || ''} ${cartItem.name}</span>
      <span class="item-price">$${formatPrice(cartItem.price)}</span>
    `;

    // Quantity controls
    const qtyDiv = document.createElement('div');
    qtyDiv.classList.add('quantity-controls');
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '−';
    decreaseBtn.setAttribute('aria-label', 'Decrease quantity');
    decreaseBtn.addEventListener('click', () => updateQuantity(cartItem.id, -1));

    const qtySpan = document.createElement('span');
    qtySpan.textContent = cartItem.quantity;

    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.setAttribute('aria-label', 'Increase quantity');
    increaseBtn.addEventListener('click', () => updateQuantity(cartItem.id, 1));

    qtyDiv.appendChild(decreaseBtn);
    qtyDiv.appendChild(qtySpan);
    qtyDiv.appendChild(increaseBtn);

    // Subtotal
    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('item-subtotal');
    subtotalSpan.textContent = `$${formatPrice(cartItem.price * cartItem.quantity)}`;

    itemDiv.appendChild(infoDiv);
    itemDiv.appendChild(qtyDiv);
    itemDiv.appendChild(subtotalSpan);

    cartItemsEl.appendChild(itemDiv);
  });

  // Update total & count
  totalPriceEl.textContent = formatPrice(calculateTotal());
  updateCartCount();
}

// Update quantity of a cart item
function updateQuantity(productId, delta) {
  const cartItem = cart.find(item => item.id === productId);
  if (!cartItem) return;

  const newQty = cartItem.quantity + delta;
  if (newQty <= 0) {
    // Remove item from cart
    cart = cart.filter(item => item.id !== productId);
  } else {
    cartItem.quantity = newQty;
  }

  renderCart();
}

// Add item to cart (from menu)
function addToCart(productId) {
  const product = menuItems.find(item => item.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      emoji: product.emoji
    });
  }

  renderCart();

  // Optional: brief button feedback
  const addBtn = document.querySelector(`.btn-add[data-id="${productId}"]`);
  if (addBtn) {
    addBtn.innerHTML = '<i class="fas fa-check"></i> Added';
    setTimeout(() => {
      addBtn.innerHTML = '<i class="fas fa-plus"></i> Add to Cart';
    }, 600);
  }
}

// Render menu items
function renderMenu() {
  menuGrid.innerHTML = '';
  menuItems.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('menu-card');

    card.innerHTML = `
      <div class="card-img">
        <span>${item.emoji}</span>
      </div>
      <div class="card-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="price">$${formatPrice(item.price)}</div>
        <button class="btn-add" data-id="${item.id}"><i class="fas fa-plus"></i> Add to Cart</button>
      </div>
    `;

    // Attach event to the add button
    const addBtn = card.querySelector('.btn-add');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(item.id);
    });

    menuGrid.appendChild(card);
  });
}

// Show toast message
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Handle checkout form submission
function handleCheckout(e) {
  e.preventDefault();

  if (cart.length === 0) {
    showToast('Your cart is empty. Add items first!');
    return;
  }

  // Gather form data (optional, just for demonstration)
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();

  if (!name || !email || !phone || !address) {
    showToast('Please fill in all delivery details.');
    return;
  }

  // Simulate order placement
  showToast(`Order placed! 🍕 $${formatPrice(calculateTotal())} – Thank you, ${name}!`);

  // Clear cart
  cart = [];
  renderCart();

  // Reset form
  checkoutForm.reset();
}

// ---- Initialization ----
function init() {
  renderMenu();
  renderCart(); // sets empty state

  // Attach checkout form listener
  checkoutForm.addEventListener('submit', handleCheckout);

  // Cart icon click can scroll to cart section (optional UX)
  document.getElementById('cartIcon').addEventListener('click', () => {
    document.getElementById('cartSection').scrollIntoView({ behavior: 'smooth' });
  });
}

// Start the app
init();