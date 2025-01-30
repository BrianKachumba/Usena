// Logout functionality
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token"); // Clear the token
        window.location.href = "login.html"; // Redirect to the login page
    });
}

// Fetch and display comments when the page loads
document.addEventListener("DOMContentLoaded", () => {
    fetchComments();
    fetchProducts();
});

function fetchComments() {
    fetch("http://localhost:3000/comments")
        .then((response) => response.json())
        .then((comments) => {
            // Sort comments by id in descending order (newest first)
            comments.sort((a, b) => b.id - a.id);
            renderComments(comments);
        })
        .catch((error) => console.error("Error fetching comments:", error));
}

function renderComments(comments) {
    const commentList = document.getElementById("comment-list");

    if (!commentList) {
        console.error("Comment list element not found.");
        return;
    }

    commentList.innerHTML = ""; // Clear existing comments

    comments.forEach((comment) => {
        const commentCard = document.createElement("div");
        commentCard.className = "comment-card";

        const commentName = document.createElement("h3");
        commentName.textContent = comment.name;

        const commentText = document.createElement("p");
        commentText.textContent = comment.comment;

        commentCard.appendChild(commentName);
        commentCard.appendChild(commentText);

        commentList.appendChild(commentCard);
    });
}

function fetchProducts() {
    fetch("http://localhost:3000/products")
        .then((response) => response.json())
        .then((products) => {
            renderProducts(products);
        })
        .catch((error) => console.error("Error fetching products:", error));
}

function renderProducts(products) {
    const productList = document.getElementById("product-list");

    if (!productList) {
        console.error("Product list element not found.");
        return;
    }

    productList.innerHTML = ""; // Clear existing products

    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.name;

        const productName = document.createElement("h3");
        productName.textContent = product.name;

        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;

        const productPrice = document.createElement("p");
        productPrice.textContent = `Price: $${product.price}`;

        const dealerMobile = document.createElement("p");
        dealerMobile.textContent = `Dealer's Mobile: ${product.dealer_mobile}`;

        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productDescription);
        productCard.appendChild(productPrice);
        productCard.appendChild(dealerMobile);

        productList.appendChild(productCard);
    });
}

// Search functionality
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");

if (searchBar && searchBtn) {
    searchBtn.addEventListener("click", () => {
        const searchTerm = searchBar.value.toLowerCase();
        filterProducts(searchTerm);
    });

    searchBar.addEventListener("input", () => {
        const searchTerm = searchBar.value.toLowerCase();
        filterProducts(searchTerm);
    });
}

function filterProducts(searchTerm) {
    fetch("http://localhost:3000/products")
        .then((response) => response.json())
        .then((products) => {
            const filteredProducts = products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        })
        .catch((error) => console.error("Error filtering products:", error));
}

// Handle form submission for comments
const commentForm = document.getElementById("commentForm");

if (commentForm) {
    commentForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the default form submission
        const name = document.getElementById("name").value;
        const comment = document.getElementById("comment").value;

        console.log("Submitting comment:", { name, comment }); // Debugging line

        // Send the comment data to the server via POST request
        fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, comment }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Comment posted successfully:", data);
                // Clear the form after successful submission
                commentForm.reset();
                // Refresh the comments section
                fetchComments();
            })
            .catch((error) => console.error("Error submitting comment:", error));
    });
}