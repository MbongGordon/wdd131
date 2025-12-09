// Review Confirmation Page Script

// Function to get URL parameters
function getUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
        productName: params.get('productName') || 'N/A',
        rating: params.get('rating') || 'N/A',
        installDate: params.get('installDate') || 'N/A',
        features: params.getAll('features'),
        writtenReview: params.get('writtenReview') || 'No written review provided',
        userName: params.get('userName') || 'Anonymous'
    };
}

// Function to format date
function formatDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    try {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return dateString;
    }
}

// Function to display star rating
function getStarRating(rating) {
    if (!rating || rating === 'N/A') return 'Not rated';
    
    const numRating = parseInt(rating);
    const filledStars = '★'.repeat(numRating);
    const emptyStars = '☆'.repeat(5 - numRating);
    return `${filledStars}${emptyStars} (${numRating}/5)`;
}

// Function to update review counter
function updateReviewCounter() {
    const counterKey = 'reviewCount';
    let currentCount = parseInt(localStorage.getItem(counterKey)) || 0;
    
    // Increment the counter
    currentCount++;
    
    // Save the new count
    localStorage.setItem(counterKey, currentCount.toString());
    
    // Display the count
    const counterElement = document.getElementById('reviewCounter');
    if (counterElement) {
        counterElement.textContent = currentCount;
    }
    
    return currentCount;
}

// Function to display review summary
function displayReviewSummary() {
    const reviewData = getUrlParameters();
    const summaryContainer = document.getElementById('reviewSummary');
    
    if (!summaryContainer) {
        console.error('Review summary container not found');
        return;
    }
    
    // Build the summary HTML
    let summaryHTML = '<h2>Review Details</h2>';
    
    // Product Name
    summaryHTML += `
        <div class="review-detail">
            <strong>Product:</strong>
            <p>${reviewData.productName}</p>
        </div>
    `;
    
    // Rating
    summaryHTML += `
        <div class="review-detail">
            <strong>Rating:</strong>
            <p>${getStarRating(reviewData.rating)}</p>
        </div>
    `;
    
    // Installation Date
    summaryHTML += `
        <div class="review-detail">
            <strong>Installation Date:</strong>
            <p>${formatDate(reviewData.installDate)}</p>
        </div>
    `;
    
    // Useful Features
    if (reviewData.features.length > 0) {
        summaryHTML += `
            <div class="review-detail">
                <strong>Useful Features:</strong>
                <p>${reviewData.features.join(', ')}</p>
            </div>
        `;
    } else {
        summaryHTML += `
            <div class="review-detail">
                <strong>Useful Features:</strong>
                <p>None selected</p>
            </div>
        `;
    }
    
    // Written Review
    summaryHTML += `
        <div class="review-detail">
            <strong>Written Review:</strong>
            <p>${reviewData.writtenReview}</p>
        </div>
    `;
    
    // User Name
    summaryHTML += `
        <div class="review-detail">
            <strong>Reviewer:</strong>
            <p>${reviewData.userName}</p>
        </div>
    `;
    
    // Insert the HTML
    summaryContainer.innerHTML = summaryHTML;
}

// Initialize the confirmation page
document.addEventListener('DOMContentLoaded', function() {
    // Update and display the review counter
    updateReviewCounter();
    
    // Display the review summary
    displayReviewSummary();
});

// Optional: Add animation to success icon
document.addEventListener('DOMContentLoaded', function() {
    const successIcon = document.querySelector('.success-icon');
    if (successIcon) {
        setTimeout(() => {
            successIcon.style.animation = 'pulse 0.5s ease-in-out';
        }, 100);
    }
});

// Add pulse animation via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(style);