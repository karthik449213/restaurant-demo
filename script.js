// Sample menu data
const menuData = [
    {
        id: 1,
        name: "Margherita Pizza",
        description: "Fresh tomatoes, mozzarella, basil",
        price: 12.99,
        category: "veg",
        tags: ["chef's special"],
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        name: "Chicken Alfredo",
        description: "Creamy pasta with grilled chicken",
        price: 15.99,
        category: "non-veg",
        tags: ["spicy"],
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Caesar Salad",
        description: "Crisp romaine, parmesan, croutons",
        price: 9.99,
        category: "veg",
        tags: ["starters"],
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Beef Burger",
        description: "Juicy beef patty with cheese",
        price: 14.99,
        category: "non-veg",
        tags: ["mains"],
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
    },
    {
        id: 5,
        name: "Chocolate Cake",
        description: "Rich chocolate with vanilla ice cream",
        price: 7.99,
        category: "veg",
        tags: ["desserts"],
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
    },
    {
        id: 6,
        name: "Fish Tacos",
        description: "Grilled fish with cabbage slaw",
        price: 13.99,
        category: "non-veg",
        tags: ["spicy", "chef's special"],
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop"
    }
];

// Gallery images
const galleryImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551782450-17144efb5723?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop"
];

// DOM elements
const menuGrid = document.getElementById('menu-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search');
const categoryChips = document.querySelectorAll('.chip');
const cartToggle = document.getElementById('cart-toggle');
const cartDrawer = document.getElementById('cart-drawer');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const closeCart = document.querySelector('.close-cart');
const galleryGrid = document.getElementById('gallery-grid');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImage = document.getElementById('lightbox-image');
const closeModalBtns = document.querySelectorAll('.close-modal');
const reservationForm = document.getElementById('reservation-form');
const reservationModal = document.getElementById('reservation-modal');
const reservationSummary = document.getElementById('reservation-summary');
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

// Cart state
let cart = [];

// Initialize the app
function init() {
    renderMenu(menuData);
    renderGallery();
    setupEventListeners();
}

// Render menu items
function renderMenu(items) {
    menuGrid.innerHTML = '';
    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy" srcset="${item.image.replace('w=400', 'w=200')} 200w, ${item.image} 400w" sizes="(max-width: 600px) 200px, 400px">
            <div class="menu-item-content">
                <h3>
                    <span class="${item.category}-icon" aria-label="${item.category === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}"></span>
                    ${item.name}
                </h3>
                <p>${item.description}</p>
                <p class="price">$${item.price.toFixed(2)}</p>
                <button class="btn btn-primary add-to-cart" data-id="${item.id}">Add to Cart</button>
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Render gallery
function renderGallery() {
    galleryGrid.innerHTML = '';
    galleryImages.forEach((src, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${src}" alt="Gallery image ${index + 1}" loading="lazy" data-src="${src}">
        `;
        galleryItem.addEventListener('click', () => openLightbox(src, `Gallery image ${index + 1}`));
        galleryGrid.appendChild(galleryItem);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Menu filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMenu();
        });
    });

    // Category chips
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterMenu();
        });
    });

    // Search
    searchInput.addEventListener('input', filterMenu);

    // Cart
    cartToggle.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);

    // Add to cart
    menuGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        }
    });

    // Reservation form
    reservationForm.addEventListener('submit', handleReservation);

    // Modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeModals();
    });

    reservationModal.addEventListener('click', (e) => {
        if (e.target === reservationModal) closeModals();
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightboxModal.classList.contains('show')) {
            if (e.key === 'Escape') closeModals();
        }
    });

    // Hamburger menu
    hamburger.addEventListener('click', toggleNav);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Filter menu
function filterMenu() {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const activeCategory = document.querySelector('.chip.active').dataset.category;
    const searchTerm = searchInput.value.toLowerCase();

    let filtered = menuData.filter(item => {
        const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
        const matchesCategory = activeCategory === 'all' || item.tags.includes(activeCategory);
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm);
        return matchesFilter && matchesCategory && matchesSearch;
    });

    renderMenu(filtered);
}

// Add to cart
function addToCart(id) {
    const item = menuData.find(item => item.id === id);
    const existingItem = cart.find(cartItem => cartItem.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCart();
}

// Update cart display
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
        count += item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = count;

    // Remove item event listeners
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            removeFromCart(id);
        });
    });
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Toggle cart
function toggleCart() {
    cartDrawer.classList.toggle('open');
}

// Handle reservation
function handleReservation(e) {
    e.preventDefault();

    // Simple validation
    const formData = new FormData(reservationForm);
    let isValid = true;
    const errors = {};

    // Check required fields
    ['name', 'phone', 'email', 'date', 'time', 'party-size'].forEach(field => {
        const value = formData.get(field);
        if (!value) {
            errors[field] = 'This field is required';
            isValid = false;
        }
    });

    // Email validation
    const email = formData.get('email');
    if (email && !/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Please enter a valid email';
        isValid = false;
    }

    // Display errors
    Object.keys(errors).forEach(field => {
        const errorEl = document.getElementById(`${field}-error`);
        errorEl.textContent = errors[field];
    });

    if (isValid) {
        // Clear errors
        document.querySelectorAll('.error').forEach(el => el.textContent = '');

        // Show confirmation modal
        const summary = `
            <p><strong>Name:</strong> ${formData.get('name')}</p>
            <p><strong>Phone:</strong> ${formData.get('phone')}</p>
            <p><strong>Email:</strong> ${formData.get('email')}</p>
            <p><strong>Date:</strong> ${formData.get('date')}</p>
            <p><strong>Time:</strong> ${formData.get('time')}</p>
            <p><strong>Party Size:</strong> ${formData.get('party-size')}</p>
            <p><strong>Special Requests:</strong> ${formData.get('requests') || 'None'}</p>
        `;
        reservationSummary.innerHTML = summary;
        reservationModal.classList.add('show');
        reservationModal.setAttribute('aria-hidden', 'false');

        // Note: In a real app, send data to backend here
        console.log('Reservation data:', Object.fromEntries(formData));
    }
}

// Open lightbox
function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxModal.classList.add('show');
    lightboxModal.setAttribute('aria-hidden', 'false');
}

// Close modals
function closeModals() {
    lightboxModal.classList.remove('show');
    reservationModal.classList.remove('show');
    lightboxModal.setAttribute('aria-hidden', 'true');
    reservationModal.setAttribute('aria-hidden', 'true');
}

// Toggle navigation
function toggleNav() {
    navList.classList.toggle('show');
    hamburger.classList.toggle('active');
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);
