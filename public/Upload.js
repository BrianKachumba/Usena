// Function to handle upload
const uploadForm = document.getElementById("uploadForm");
uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);

    try {
        const response = await fetch("/products", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the request
            },
            body: formData,
        });

        if (response.status === 201) {
            alert("Item uploaded successfully!");
            window.location.href = "dashboard.html"; // Redirect to the dashboard
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (error) {
        console.error("Error during upload:", error.message);
        alert("Something went wrong. Please try again later.");
    }
});

// Check if the user is logged in
const token = localStorage.getItem("token");

if (!token) {
    alert("You must be logged in to upload items.");
    window.location.href = "login.html"; // Redirect to the login page
}
