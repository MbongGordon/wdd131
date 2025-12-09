// Product Array - Data Source
const products = [
    { id: "prod001", name: "Smart Thermostat Pro" },
    { id: "prod002", name: "LED Ceiling Light" },
    { id: "prod003", name: "Wireless Security Camera" },
    { id: "prod004", name: "Video Doorbell" },
    { id: "prod005", name: "Smart Door Lock" },
    { id: "prod006", name: "Motion Sensor Light" },
    { id: "prod007", name: "Smart Smoke Detector" },
    { id: "prod008", name: "WiFi Range Extender" },
    { id: "prod009", name: "Smart Plug" },
    { id: "prod010", name: "Energy Monitor" }
];

// Populate Product Select Options
function populateProducts() {
    const select = document.getElementById('productName');
    
    if (!select) {
        console.error('Product select element not found');
        return;
    }
    
    // Create and append options for each product
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        select.appendChild(option);
    });
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    populateProducts();
    
    // Set max date for installation date to today
    const installDateInput = document.getElementById('installDate');
    if (installDateInput) {
        const today = new Date().toISOString().split('T')[0];
        installDateInput.setAttribute('max', today);
    }
});

// Optional: Add visual feedback for star rating on hover
document.addEventListener('DOMContentLoaded', function() {
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    const starLabels = document.querySelectorAll('.star-label');
    
    ratingInputs.forEach((input, index) => {
        input.addEventListener('change', function() {
            // Update visual state when rating is selected
            updateStarDisplay(index);
        });
    });
});

function updateStarDisplay(selectedIndex) {
    const starLabels = document.querySelectorAll('.star-label');
    starLabels.forEach((label, index) => {
        const star = label.querySelector('.star');
        if (index <= selectedIndex) {
            star.style.color = 'var(--star-color)';
        } else {
            star.style.color = 'var(--star-empty)';
        }
    });
}