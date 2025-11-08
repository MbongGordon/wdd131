// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Set last modified date in footer
document.getElementById('lastModified').textContent = `Last Modified: ${document.lastModified}`;

// Hamburger menu toggle functionality
const menuButton = document.getElementById('menu-button');
const navigation = document.getElementById('navigation');

menuButton.addEventListener('click', () => {
    navigation.classList.toggle('open');
    
    // Toggle button icon between hamburger and X
    if (navigation.classList.contains('open')) {
        menuButton.textContent = '✕';
    } else {
        menuButton.textContent = '☰';
    }
});