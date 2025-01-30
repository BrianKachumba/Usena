// Check if the user is logged in
const token = localStorage.getItem("token");

if (!token) {
    alert("You must be logged in to access this page.");
    window.location.href = "login.html"; // Redirect to the login page
}

// Load cart from localStorage
function loadCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Render cart items
function renderCart() {
    const cart = loadCart();
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = '0';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <p>${item.name} - Ksh ${item.price} x ${item.quantity}</p>
            <p>Ksh ${itemTotal}</p>
            <button onclick="removeFromCart('${item.name}')">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total;
}

// Remove item from cart
function removeFromCart(productName) {
    let cart = loadCart();
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Initialize cart
renderCart();

// Handle checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    alert('Proceeding to payment gateway...');
    // Add payment integration here
});




// DOM Elements
const profileName = document.getElementById('profile-name');
const profileLocation = document.getElementById('profile-location');
const profileGender = document.getElementById('profile-gender');
const profilePictureUpload = document.getElementById('profile-picture-upload');
const profileSetupSection = document.getElementById('profile-setup');
const profileSection = document.getElementById('profile-section');

// Check if profile information exists in localStorage
window.onload = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.profile) {
        // Display user profile if data exists
        document.getElementById('user-name').textContent = user.profile.name;
        document.getElementById('user-location').textContent = user.profile.location;
        document.getElementById('user-gender').textContent = user.profile.gender;
        document.getElementById('profile-picture').src = user.profile.picture || 'https://via.placeholder.com/150';
        profileSection.style.display = 'block';
        profileSetupSection.style.display = 'none';
    } else {
        // Show profile setup form if no data exists
        profileSetupSection.style.display = 'block';
        profileSection.style.display = 'none';
    }
};

// Handle profile form submission
document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather data from the form
    const profile = {
        name: profileName.value,
        location: profileLocation.value,
        gender: profileGender.value,
        picture: profilePictureUpload.files[0] ? URL.createObjectURL(profilePictureUpload.files[0]) : null
    };

    // Save profile data to localStorage
    let user = JSON.parse(localStorage.getItem('user')) || {};
    user.profile = profile;
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect to profile page after saving
    window.location.reload();
});


