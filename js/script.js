// Form submission and notification handling
document.addEventListener('DOMContentLoaded', function() {
    const emergencyForm = document.getElementById('emergency-form');
    const successNotification = document.getElementById('success-notification');
    
    if (emergencyForm) {
        emergencyForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission
            
            // Validate form (you can add more validation if needed)
            const requiredFields = emergencyForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Show success notification
                if (successNotification) {
                    successNotification.classList.add('show');
                    
                    // Simulate sending data to server (in a real app, you'd send data to a backend)
                    console.log('Emergency report submitted');
                    
                    // Store the report in local storage for "My Reports" section
                    saveReport();
                    
                    
                }
            }
        });
    }
    
    // Close notification when the close button is clicked
    const notificationCloseBtn = document.querySelector('.notification-close');
    if (notificationCloseBtn) {
        notificationCloseBtn.addEventListener('click', function() {
            successNotification.classList.remove('show');
        });
    }
    
    // Function to save the report to local storage
    function saveReport() {
        const emergencyType = document.getElementById('emergency-type').value;
        const reporterName = document.getElementById('reporter-name').value || 'Anonymous';
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const urgency = document.getElementById('urgency').value;
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;
        
        const report = {
            id: Date.now(),
            type: emergencyType,
            reporter: reporterName,
            location: location,
            description: description,
            urgency: urgency,
            coordinates: {
                latitude: latitude,
                longitude: longitude
            },
            status: 'Submitted',
            timestamp: new Date().toISOString()
        };
        
        // Get existing reports or initialize empty array
        let reports = JSON.parse(localStorage.getItem('emergencyReports')) || [];
        
        // Add new report
        reports.push(report);
        
        // Save back to local storage
        localStorage.setItem('emergencyReports', JSON.stringify(reports));
    }
});

// Initialize map
// Initialize map
let map = null;
let userMarker = null;
let aiSystem = null;

function initMap() {
    // Create the map centered on a default location (you can change these coordinates)
    map = L.map('emergency-map').setView([0, 0], 2);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Make map globally available
    window.map = map;
    window.L = L;
}

// Initialize map when the map section becomes visible
document.addEventListener('DOMContentLoaded', function() {
    const mapSection = document.getElementById('map-section');
    
    // Observer to initialize map when section becomes visible
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList.contains('active-section')) {
                if (!map) {
                    initMap();
                }
            }
        });
    });
    
    observer.observe(mapSection, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Handle Get My Location button
    document.getElementById('get-location-btn').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Center map on user location
                map.setView([lat, lng], 15);
                
                // Add or update user marker
                if (userMarker) {
                    userMarker.setLatLng([lat, lng]);
                } else {
                    userMarker = L.marker([lat, lng]).addTo(map);
                }
                
                userMarker.bindPopup('Your Location').openPopup();
                
                // Store coordinates for other functions
                window.userCoordinates = {
                    latitude: lat,
                    longitude: lng
                };
                
                // Initialize AI system with location
                aiSystem = new AIResponseSystem();
                aiSystem.userLocation = {
                    latitude: lat,
                    longitude: lng
                };
                
                
                
                // Enable share location button
                const shareLocationBtn = document.getElementById('share-location');
                shareLocationBtn.disabled = false;
                shareLocationBtn.classList.remove('disabled');
            }, function(error) {
                alert('Error getting your location: ' + error.message);
            });
        } else {
            alert('Geolocation is not supported by your browser');
        }
    });
});


// Handle Share Location button
document.getElementById('share-location').addEventListener('click', function() {
    if (!window.userCoordinates) {
        alert('Please get your location first');
        return;
    }
    
    const locationUrl = `https://www.google.com/maps?q=${window.userCoordinates.latitude},${window.userCoordinates.longitude}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Emergency Location',
            text: 'Here is my location for emergency assistance',
            url: locationUrl
        }).catch(err => {
            console.error('Error sharing:', err);
            // Fallback to copying to clipboard
            copyToClipboard(locationUrl);
        });
    } else {
        // Fallback for browsers that don't support sharing
        copyToClipboard(locationUrl);
    }
});

// Helper function to copy text to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('Location link copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy location link');
    }
    document.body.removeChild(textarea);
}