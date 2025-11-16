// Static weather values (matching the HTML content)
const temperature = 28; // °C
const windSpeed = 10; // km/h

// Function to calculate wind chill (Metric formula)
function calculateWindChill(temp, wind) {
    return 13.12 + 0.6215 * temp - 11.37 * Math.pow(wind, 0.16) + 0.3965 * temp * Math.pow(wind, 0.16);
}

// Function to update wind chill display
function updateWindChill() {
    const windchillElement = document.getElementById('windchill');
    
    // Check if conditions are met for wind chill calculation (Metric)
    // Temperature <= 10°C and Wind speed > 4.8 km/h
    if (temperature <= 10 && windSpeed > 4.8) {
        const windChill = calculateWindChill(temperature, windSpeed);
        windchillElement.textContent = `${windChill.toFixed(1)}°C`;
    } else {
        windchillElement.textContent = 'N/A';
    }
}

// Function to update footer with current year and last modified date
function updateFooter() {
    // Set current year
    const currentYear = new Date().getFullYear();
    document.getElementById('currentyear').textContent = currentYear;
    
    // Set last modified date
    const lastModified = document.lastModified;
    document.getElementById('lastModified').textContent = lastModified;
}

// Run functions when page loads
updateWindChill();
updateFooter();